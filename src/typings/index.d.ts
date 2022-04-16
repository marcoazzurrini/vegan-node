declare global {
  namespace Express {
    interface Request {
      verifiedUser: UserInt;
    }
  }
}

export interface UserInt {
  id: string;
  username: string;
  password: string;
}

export interface DataInt {
  user?: IUser;
  jwt?: string;
}
