import { InMemoryRepository } from "../../framework/dataSources/InMemoryRepository";
import { Repository, RepositoryType } from "../../framework/decorators/repository";
import { Product } from "../models/Product";

@Repository({ type: RepositoryType.SQL, db: "main" })
export class ProductRepository extends InMemoryRepository<Product> {
    constructor() {
        super();
    }
}
