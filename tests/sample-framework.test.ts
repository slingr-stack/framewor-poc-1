
import "reflect-metadata";

import { Product } from "./models/Product";
import { ProductService } from "./services/ProductService";
import { UserService } from "./services/UserService";
import { ProductReviewService } from "./services/ProductReviewService";
import { UserRepository } from "./repositories/UserRepository";
import { ProductRepository } from "./repositories/ProductRepository";
import { ProductReviewRepository } from "./repositories/ProductReviewRepository";

describe("Framework sample integration", () => {
    // Each model has its own repository and service
    let userRepository: UserRepository;
    let userService: UserService;

    let productRepository: ProductRepository;
    let productService: ProductService;

    let reviewRepository: ProductReviewRepository;
    let reviewService: ProductReviewService;

    beforeAll(() => {
        userRepository = new UserRepository();
        userService = new UserService(userRepository);

        productRepository = new ProductRepository();
        productService = new ProductService(productRepository);

        reviewRepository = new ProductReviewRepository();
        reviewService = new ProductReviewService(reviewRepository);
    });

    it("should create a remote user via REST", async () => {
        const user = await userService.create({ name: "Alice" });
        expect(user).toHaveProperty("id");
        expect(user.name).toBe("Alice");
    });

    it("should create a product with calculated fields", async () => {
        const product = await productService.create({ name: "Widget", price: 100 });
        expect(product.tax).toBe(21);
        expect(product.totalPrice).toBe(121);
    });

    it("should not allow duplicate product names", async () => {
        await productService.create({ name: "UniqueName", price: 50 });
        await expect(productService.create({ name: "UniqueName", price: 60 }))
            .rejects.toThrow(/already exists/);
    });

    it("should create a review linked to a product", async () => {
        const product = await productService.create({ name: "Gadget", price: 200 });
        const review = await reviewService.create({ review: "Great!", product: product });
        expect(review.product.id).toBe(product.id);
    });
});
