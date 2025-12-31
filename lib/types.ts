export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  profilePicture?: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category?: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (name: string, profilePicture?: string) => void;
}
