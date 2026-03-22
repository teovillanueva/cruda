export interface PhotoWithUser {
  id: string;
  title: string | null;
  description: string | null;
  url: string;
  width: number;
  height: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
  isSaved: boolean;
}

export interface PhotoPage {
  photos: PhotoWithUser[];
  nextCursor: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  image: string | null;
  isFollowed: boolean;
}
