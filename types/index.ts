export interface Session {
  startedAt: string;
  duration: number;
}

export interface SessionsByDay {
  [key: string]: {
    totalTime: number;
    sessions: Session[];
  };
}
