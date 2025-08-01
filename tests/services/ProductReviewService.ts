import { BaseService } from "../../framework/core/BaseService";
import { ProductReview } from "../models/ProductReview";
import { ProductReviewRepository } from "../repositories/ProductReviewRepository";

export class ProductReviewService extends BaseService<ProductReview> {
    constructor(repo: ProductReviewRepository) {
        super(repo, ProductReview);
    }
}
