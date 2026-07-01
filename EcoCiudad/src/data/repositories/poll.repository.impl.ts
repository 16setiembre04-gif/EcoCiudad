// Poll Repository Implementation

import { Either, left, right } from '@/domain/entities';
import { Poll, PollOption, PollVote } from '@/domain/entities/community';
import { IPollRepository } from '@/domain/repositories/poll.repository';
import { CommunityRemoteDataSource } from '@/data/datasources/remote/community.datasource';
import { PollMapper, PollOptionMapper, PollVoteMapper } from '@/data/mappers/community.mapper';

export class PollRepository implements IPollRepository {
  constructor(private dataSource: CommunityRemoteDataSource) {}

  async getPoll(postId: string): Promise<Either<Error, Poll>> {
    try {
      const dto = await this.dataSource.getPoll(postId);
      return right(PollMapper.toDomain(dto));
    } catch (error) {
      return left(error as Error);
    }
  }

  async createPoll(poll: Omit<Poll, 'id' | 'createdAt'>): Promise<Either<Error, Poll>> {
    try {
      const dto = PollMapper.toDto(poll as Poll);
      const created = await this.dataSource.createPoll(dto);
      return right(PollMapper.toDomain(created));
    } catch (error) {
      return left(error as Error);
    }
  }

  async updatePoll(id: string, data: Partial<Poll>): Promise<Either<Error, Poll>> {
    try {
      const dto = PollMapper.toDto(data as Poll);
      const updated = await this.dataSource.updatePoll(id, dto);
      return right(PollMapper.toDomain(updated));
    } catch (error) {
      return left(error as Error);
    }
  }

  async deletePoll(id: string): Promise<Either<Error, void>> {
    try {
      await this.dataSource.deletePoll(id);
      return right(undefined);
    } catch (error) {
      return left(error as Error);
    }
  }

  async addPollOption(pollId: string, text: string): Promise<Either<Error, PollOption>> {
    try {
      const dto = await this.dataSource.addPollOption(pollId, text);
      return right(PollOptionMapper.toDomain(dto));
    } catch (error) {
      return left(error as Error);
    }
  }

  async removePollOption(optionId: string): Promise<Either<Error, void>> {
    try {
      await this.dataSource.removePollOption(optionId);
      return right(undefined);
    } catch (error) {
      return left(error as Error);
    }
  }

  async votePoll(
    pollId: string,
    optionId: string,
    userId: string
  ): Promise<Either<Error, PollVote>> {
    try {
      const dto = await this.dataSource.votePoll(pollId, optionId, userId);
      return right(PollVoteMapper.toDomain(dto));
    } catch (error) {
      return left(error as Error);
    }
  }

  async removeVote(pollId: string, userId: string): Promise<Either<Error, void>> {
    try {
      await this.dataSource.removeVote(pollId, userId);
      return right(undefined);
    } catch (error) {
      return left(error as Error);
    }
  }

  async getPollVotes(pollId: string): Promise<Either<Error, PollVote[]>> {
    try {
      const dtos = await this.dataSource.getPollVotes(pollId);
      const votes = dtos.map(PollVoteMapper.toDomain);
      return right(votes);
    } catch (error) {
      return left(error as Error);
    }
  }

  async hasVoted(pollId: string, userId: string): Promise<Either<Error, boolean>> {
    try {
      const hasVoted = await this.dataSource.hasVoted(pollId, userId);
      return right(hasVoted);
    } catch (error) {
      return left(error as Error);
    }
  }
}
