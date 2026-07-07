// Poll Repository Interface

import { Either } from '@/domain/repositories';
import { Poll, PollOption, PollVote } from '@/domain/entities/community';

export interface IPollRepository {
  // Polls
  getPoll(postId: string): Promise<Either<Error, Poll>>;
  createPoll(poll: Omit<Poll, 'id' | 'createdAt'>): Promise<Either<Error, Poll>>;
  updatePoll(id: string, data: Partial<Poll>): Promise<Either<Error, Poll>>;
  deletePoll(id: string): Promise<Either<Error, void>>;
  
  // Poll Options
  addPollOption(pollId: string, text: string): Promise<Either<Error, PollOption>>;
  removePollOption(optionId: string): Promise<Either<Error, void>>;
  
  // Poll Votes
  votePoll(pollId: string, optionId: string, userId: string): Promise<Either<Error, PollVote>>;
  removeVote(pollId: string, userId: string): Promise<Either<Error, void>>;
  getPollVotes(pollId: string): Promise<Either<Error, PollVote[]>>;
  hasVoted(pollId: string, userId: string): Promise<Either<Error, boolean>>;
}
