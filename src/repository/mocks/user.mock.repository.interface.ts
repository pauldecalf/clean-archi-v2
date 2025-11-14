import { UserConnectedType, UserSignInType, UserType } from "@/src/entities/user";
import { IUserRepository } from "../user.repository.interface";

/**
 * Ici je réplique des appels à la base de donnée
 * Utiliser ce mockRepository pour les tests
 */
export class MockUserRepository implements IUserRepository {
    private _users: UserType[];

    constructor() {
        this._users = [];
    }

    async createUser(payload: Omit<UserType, "id">): Promise<UserConnectedType> {
        const id = crypto.randomUUID();
        const created = {
            ...payload,
            id,
        };

        await this._users.push(created);

        const user = this._users.find((user) => user.id === id);

        const newUser = {
            id: user?.id,
            name: user?.name,
            lastname: user?.lastname,
            mail: user?.mail,
            };

        return newUser as UserConnectedType;
    }

    async getUserByMail(mail: string): Promise<UserConnectedType | null> {
        return this._users.find((user) => user.mail === mail) || null;
    }

    async getAllUsers(): Promise<UserType[]> {
        return this._users;
    }

    async getUserById(id: UserType["id"]): Promise<UserConnectedType | null> {
        return this._users.find((user) => user.id === id) || null;
    }

    async userConnect(payload: UserSignInType): Promise<UserConnectedType | null> {
        const user = this._users.find((user) => user.mail === payload.mail);
        if(!user) {
            return null;
        }

        if(user && user.password === payload.password) {
            return {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                mail: user.mail,
            };
        }

        return null;
    }
}
