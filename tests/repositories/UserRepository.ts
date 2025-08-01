import { RestRepository } from "../../framework/dataSources/RestRepository";
import { User } from "../models/User";

export class UserRepository extends RestRepository<User> {
    constructor() {
        super("https://api.example.com/users");
    }
}
