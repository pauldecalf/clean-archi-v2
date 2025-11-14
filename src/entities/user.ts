/**
 * Protege ce model
 */
interface User {
    id: string;
    name: string;
    lastname: string;
    mail: string;
    password: string;
};

export type UserType = User;

export type UserConnectedType = Omit<UserType, "password">;

export type UserSignInType = Pick<UserType, "mail" | "password">