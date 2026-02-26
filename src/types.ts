export interface Task {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  progress: number;
}

export interface AudienceSample {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  reason: string;
}

export interface AudienceCardData {
  totalCount: number;
  samples: AudienceSample[];
}

export interface CopyCardData {
  content: string;
  type: string;
}

export interface ConfirmCardData {
  title: string;
  count: number;
  contentSnapshot: string;
  target?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tasks?: Task[];
  audienceCard?: AudienceCardData;
  copyCard?: CopyCardData | CopyCardData[];
  confirmCard?: ConfirmCardData | ConfirmCardData[];
  isError?: boolean;
  actionButtons?: { label: string; action: string; primary?: boolean }[];
}
