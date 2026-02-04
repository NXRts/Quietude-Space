export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Sound {
  id: string;
  name: string;
  src: string;
  icon: React.ReactNode;
  color?: string;
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
