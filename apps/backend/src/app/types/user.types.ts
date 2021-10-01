export interface UserType {
  _id: string;
  email: string;
  password?: string;
}

export interface UserTokenType {
  userId: string;
}
