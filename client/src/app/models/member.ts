import { Photo } from "./photo";

export interface Member {
  id: number;
  username: string;
  photoUrl: string;
  coverUrl: string;
  age: number;
  knownAs: string;
  created: Date;
  lastActive: Date;
  gender: string;
  bio: string;
  hobbies: string;
  city: string;
  country: string;
  photos: Photo[];
  followed: boolean;
}

