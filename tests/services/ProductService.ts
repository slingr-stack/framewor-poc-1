import { BaseService } from "../../framework/core/BaseService";
import { Product } from "../models/Product";
import { InMemoryRepository } from "../../framework/dataSources/InMemoryRepository";

export class ProductService extends BaseService<Product> {
    constructor(repo: InMemoryRepository<Product>) {
        super(repo, Product);
    }

    async beforeCreate(data: Partial<Product>): Promise<void> {
        await super.beforeCreate(data);
        // Check for unique name
        if (data.name) {
            const existing = await this.repo.findOne({ name: data.name } as Product);
            if (existing) {
                throw new Error(`Product name '${data.name}' already exists.`);
            }
        }
    }

    async create(data: Partial<Product>): Promise<Product> {
        // Calculate tax and totalPrice
        const tax = Math.round((data.price || 0) * 0.21);
        const totalPrice = (data.price || 0) + tax;
        return super.create({ ...data, tax, totalPrice });
    }
}
