export interface getPost {
  id: number;
  posterUserName: string;
  posterKnownAs: string;
  posterPhotoUrl: string;
  content: string;
  contentImageUrl: string;
  posted: Date;
  likes: number;
  comments: number;
}
