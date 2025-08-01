import { InMemoryRepository } from "../../framework/dataSources/InMemoryRepository";
import { Repository, RepositoryType } from "../../framework/decorators/repository";
import { ProductReview } from "../models/ProductReview";

@Repository({ type: RepositoryType.SQL, db: "main" })
export class ProductReviewRepository extends InMemoryRepository<ProductReview> {
    constructor() {
        super();
    }
}
