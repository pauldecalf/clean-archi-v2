import {IUserRepository} from "@/src/repository/user.repository.interface";
import {UserConnectedType, UserType} from "@/src/entities/user";

export class CreateNewUserUseCase {
    constructor(private readonly UserRepository: IUserRepository) {

    }

    async execute(payload: Omit<UserType, "id">): Promise<UserConnectedType> {
        const {name, lastname, mail, password} = payload;

        const userExist = await this.UserRepository.getUserByMail(mail);

        if (userExist) {
            throw new Error("User already exist");
        }

        return this.UserRepository.createUser(payload);
    }
}