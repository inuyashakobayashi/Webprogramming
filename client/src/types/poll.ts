// Basic Types
export interface PollOption {
  id: number;
  text: string;
}

export interface PollSettings {
  voices: number;
  worst: boolean;
  deadline: string;
}

export interface User {
  name: string;
  lock?: boolean;
}

// Poll Related Types
export interface PollBody {
  title: string;
  description: string;
  options: PollOption[];
  setting?: PollSettings;
  fixed?: number[];
}

export interface PollSecurity {
  owner?: User;
  users?: User[];
  visibility?: 'lock' | 'lack';
}

export interface Poll {
  body: PollBody;
  security?: PollSecurity;
  share: Token;
}

// Vote Related Types
export interface VoteChoice {
  id: number;
  worst: boolean;
}

export interface Vote {
  choice: VoteChoice[];
  owner?: User;
}

export interface VoteResult {
  edit: Token;
}

// Token Type
export interface Registration {
  name: string;
  password: string;
}

export interface PollResult {
  admin: Token;
  share: Token;
}

export interface Token {
  link?: string;
  value: string;
}

// Statistics Types
export interface StatisticsOption {
  voted: number[];
  worst?: number[];
}

export interface Statistics {
  poll: Poll;
  participants: User[];
  options: StatisticsOption[];
}

// Form Props Types
export interface PollFormProps {
  onSubmit: (data: PollBody) => void;
  isLocked?: boolean;
}

export interface VoteFormProps {
  poll: Poll;
  onSubmit: (vote: Vote) => void;
}

export interface StatisticsProps {
  statistics: Statistics;
}