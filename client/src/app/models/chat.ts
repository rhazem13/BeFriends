export interface Chat {
  senderId: number;
  senderUsername: string;
  senderPhotoUrl: string;
  recipientPhotoUrl: string;
  content: string;
  dateRead?: Date;
  messageSent: Date;
  recipientUsername: string;
  contactUsername: string;
  contactPhotoUrl: string;
}
