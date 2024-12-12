// src/types/poll.ts
export interface PollSecurity {
  owner?: User;
  users?: User[];
  visibility: 'lock' | 'lack';  // defaults to 'lack' per API spec
}

export interface User {
  name: string;
  lock?: boolean;
}

// For API responses
export interface PollResult {
  admin: Token;
  share: Token;
}

export interface Statistics {
  poll: Poll;
  participants: User[];
  options: StatisticsOption[];
}

export interface StatisticsOption {
  voted: number[];
  worst?: number[];
}

export interface Vote {
  owner: User;
  choice: VoteChoice[];
}

export interface VoteChoice {
  id: number;
  worst?: boolean;
}

export interface VoteResult {
  edit: Token;
}

export interface VoteInfo {
  poll: Poll;
  vote: Vote;
  time: string;
}


// src/types/poll.ts
export interface Poll {
  body: PollBody;
  security?: PollSecurity;
  share: Token;
}

export interface PollBody {
  title: string;
  description?: string;
  options: PollOption[];
  setting?: PollSetting;
  fixed?: number[];
}

export interface PollOption {
  id: number;
  text: string;
}

export interface PollSetting {
  voices?: number;
  worst?: boolean;
  deadline?: string;
}

export interface Token {
  link?: string;
  value: string;
}