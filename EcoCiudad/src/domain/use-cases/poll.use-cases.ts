// Poll Use Cases

import { Either } from '@/domain/entities';
import { Poll, PollOption, PollVote } from '@/domain/entities/community';
import { IPollRepository } from '@/domain/repositories/poll.repository';

export class GetPollUseCase {
  constructor(private repository: IPollRepository) {}

  async execute(postId: string): Promise<Either<Error, Poll>> {
    return this.repository.getPoll(postId);
  }
}

export class CreatePollUseCase {
  constructor(private repository: IPollRepository) {}

  async execute(poll: Omit<Poll, 'id' | 'createdAt'>): Promise<Either<Error, Poll>> {
    return this.repository.createPoll(poll);
  }
}

export class UpdatePollUseCase {
  constructor(private repository: IPollRepository) {}

  async execute(id: string, data: Partial<Poll>): Promise<Either<Error, Poll>> {
    return this.repository.updatePoll(id, data);
  }
}

export class DeletePollUseCase {
  constructor(private repository: IPollRepository) {}

  async execute(id: string): Promise<Either<Error, void>> {
    return this.repository.deletePoll(id);
  }
}

export class AddPollOptionUseCase {
  constructor(private repository: IPollRepository) {}

  async execute(pollId: string, text: string): Promise<Either<Error, PollOption>> {
    return this.repository.addPollOption(pollId, text);
  }
}

export class RemovePollOptionUseCase {
  constructor(private repository: IPollRepository) {}

  async execute(optionId: string): Promise<Either<Error, void>> {
    return this.repository.removePollOption(optionId);
  }
}

export class VotePollUseCase {
  constructor(private repository: IPollRepository) {}

  async execute(
    pollId: string,
    optionId: string,
    userId: string
  ): Promise<Either<Error, PollVote>> {
    return this.repository.votePoll(pollId, optionId, userId);
  }
}

export class RemoveVoteUseCase {
  constructor(private repository: IPollRepository) {}

  async execute(pollId: string, userId: string): Promise<Either<Error, void>> {
    return this.repository.removeVote(pollId, userId);
  }
}

export class HasVotedUseCase {
  constructor(private repository: IPollRepository) {}

  async execute(pollId: string, userId: string): Promise<Either<Error, boolean>> {
    return this.repository.hasVoted(pollId, userId);
  }
}
