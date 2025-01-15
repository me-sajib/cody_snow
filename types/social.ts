export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  joinDate: Date;
  bio: string;
  achievements: Achievement[];
  connections: {
    udio?: string;
    suno?: string;
    mureka?: string;
    sonauto?: string;
  };
  stats: {
    songsShared: number;
    likesReceived: number;
    commentsReceived: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: Date;
}

export interface Comment {
  id: string;
  content: string;
  user: UserProfile;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
}

export interface SharedSong {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  user: UserProfile;
  createdAt: Date;
  likes: number;
  plays: number;
  comments: Comment[];
  generator: 'Udio' | 'Suno' | 'Mureka' | 'Sonauto';
}

