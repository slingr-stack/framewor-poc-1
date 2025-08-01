
import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { IsString, IsNotEmpty } from "class-validator";
import { Product } from "./Product";

@Entity()
export class ProductReview {
    @PrimaryKey()
    @IsString()
    id!: string;

    @ManyToOne(() => Product)
    product!: Product;

    @Property()
    @IsString()
    @IsNotEmpty()
    review!: string;
}
