
import { UserRepository } from "@/src/ports/user-repository";
import { UserType } from "@/src/entities/user";
import {CreateNewUserUseCase} from "@/src/repository/use-cases/create-new-user.use-case";
import {createUserValidation} from "@/src/adapters/validations/create-user-validation";

export class CreateUserController {
    private createNewUserUseCase: CreateNewUserUseCase;

    constructor() {
        const userRepository = new UserRepository();
        this.createNewUserUseCase = new CreateNewUserUseCase(userRepository);
    }

    async handle(requestBody: Omit<UserType, "id">): Promise<{
        success: boolean;
        data?: {
            id: string;
            name: string;
            lastname: string;
            mail: string;
        };
        error?: string;
    }> {
        try {
            // Validation des champs requis
            const validatePayload = createUserValidation.safeParse(requestBody);
            if (!validatePayload.success) {
                return {
                    success: false,
                    error: "invalid payload",
                }
            }

            // Validation de l'email (format basique)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(requestBody.mail)) {
                return {
                    success: false,
                    error: "Invalid email format"
                };
            }

            // Exécution du use case
            const createdUser = await this.createNewUserUseCase.execute(requestBody);

            return {
                success: true,
                data: createdUser
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || "Failed to create user"
            };
        }
    }
}

