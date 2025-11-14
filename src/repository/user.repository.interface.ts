import { UserConnectedType, UserSignInType, UserType } from "../entities/user";

export interface IUserRepository {
    createUser(payload: Omit<UserType, "id">): Promise<UserConnectedType>;
    getAllUsers(): Promise<UserType[]>;
    getUserByMail(mail: UserType["mail"]): Promise<UserConnectedType | null>
    getUserById(id: UserType["id"]): Promise<UserConnectedType | null>;
    userConnect(payload: UserSignInType): Promise<UserConnectedType | null>;
};
