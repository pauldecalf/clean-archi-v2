import { NewUser, users } from "@/database/schema";
import { UserConnectedType, UserSignInType, UserType } from "../entities/user";
import { IUserRepository } from "../repositories/user.repository.interface";
import { db } from "@/database/db";
import { eq } from "drizzle-orm";

export class UserRepository implements IUserRepository {
    async createUser(user: Omit<UserType, "id">): Promise<UserConnectedType> {
        try {
            const newUser: Omit<NewUser, "id"> = {
                name: user.name,
                lastname: user.lastname,
                mail: user.mail,
                password: user.password,
            };

            const [createdUser] = await db
                .insert(users)
                .values(newUser)
                .returning();

            const userCreated = {
                id: createdUser.id,
                name: createdUser.name,
                lastname: createdUser.lastname,
                mail: createdUser.mail
            };

            return userCreated;
        } catch (error: any) {
            throw new Error("Failed to create account", error);
        }
    }

    async getAllUsers(): Promise<UserType[]> {
        try {
            const allUsers = await db.select().from(users);
            return allUsers.map(user => ({
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                mail: user.mail,
                password: user.password,
            }));
        } catch (error: any) {
            throw new Error("Failed to get all users", error);
        }
    }

    async getUserByMail(mail: UserType["mail"]): Promise<UserConnectedType | null> {
        try {
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.mail, mail))
                .limit(1);

            if (!user) {
                return null;
            }

            return {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                mail: user.mail,
            };
        } catch (error: any) {
            throw new Error("Failed to get user by mail", error);
        }
    }

    async getUserById(id: UserType["id"]): Promise<UserConnectedType | null> {
        try {
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.id, id))
                .limit(1);

            if (!user) {
                return null;
            }

            return {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                mail: user.mail,
            };
        } catch (error: any) {
            throw new Error("Failed to get user by id", error);
        }
    }

    async userConnect(payload: UserSignInType): Promise<UserConnectedType | null> {
        try {
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.mail, payload.mail))
                .limit(1);

            if (!user) {
                return null;
            }

            if (user.password === payload.password) {
                return {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    mail: user.mail,
                };
            }

            return null;
        } catch (error: any) {
            throw new Error("Failed to connect user", error);
        }
    }
}