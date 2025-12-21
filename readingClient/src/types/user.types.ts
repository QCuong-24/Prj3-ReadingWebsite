export interface User {
  userId: number;
  username: string;
  email: string;
  avatarUrl?: string;
  roles: string[];
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  targetUrl: string;
  isRead: boolean;
  createdAt: string;
}