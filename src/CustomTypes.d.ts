declare type CurrentUser = {
   userId: string;
   email: string;
   accountNumber: string;
   deviceId: string;
   followingIds: string[];
   token: string;
   notificationTokens:string[]
};

declare type BlogComment = {
   commentId: string;
   refId: string;
   userId: number;
   content: string;
   createdAt: Date;
   updatedAt: Date;
   repliesCount: number;
   likesCount: number;
   liked: boolean;
   createdBy: User;
};

declare type Action = {
   type: string;
   payload?: any;
};

declare type Like = {
   likeId: string;
   refId: string;
   userId: string;
   createdAt?: Date;
   updatedAt?: Date;
};

declare type Share = {
   shareId?: string;
   refId: string;
   userId: string;
   createdAt?: Date;
   updatedAt?: Date;
};

declare type Blog = {
   blogId: string;
   text: string;
   title: string | null;
   images: string[] | null;
   video: string | null;
   url: string | null;
   userId: string;
   slug: string | null;
   summary: string | null;
   fromUserId?: string | null;
   fromBlogId?: string | null;
   shared?: number | null;
   createdAt: Date;
   updatedAt: Date;
};

declare type User = {
   userId: string;
   firstName: string;
   middleName: string;
   lastName: string;
   fullName: string;
   profileImage: string;
   password: string;
   pinCode: string;
   lastSeenStatus?: string | Date | null;
   gender: string;
   accountNumber: string;
   email: string;
   dob: string;
   verified: boolean;
   verificationRank: "low" | "medium" | "high" | string;
   createdAt: Date;
   updatedAt: Date;
};

declare type ChatUser = {
   _id: string | number;
   name: string;
   avatar: string;
};

declare type IMessage = {
   _id: string | number;
   text: string;
   createdAt: Date;
   user: ChatUser;
   image?: string;
   video?: string;
   audio?: string;
   system?: boolean;
   sent?: boolean;
   received?: boolean;
   pending?: boolean;
};

declare type CustomNotification = {
   notificationId: string;
   userId: string;
   title: string;
   message: string;
   readStatus: boolean;
   notificationFromId: string;
   notificationForId: string;
   createdAt: Date;
   notificationType: string;
   updatedAt: Date | null;
};

declare type Room = {
   roomId: string;
   senderId: string;
   recipientId: string;
   lastText: string | null;
   recipientReadStatus: boolean | null;
   numberOfUnreadText: number | null;
   createdAt: Date;
   updatedAt: null;
};
