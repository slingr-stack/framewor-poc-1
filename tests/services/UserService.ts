import { BaseService } from "../../framework/core/BaseService";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService extends BaseService<User> {
    constructor(repo: UserRepository) {
        super(repo, User);
    }
}
