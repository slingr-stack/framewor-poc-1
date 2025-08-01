import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { IsString, IsNotEmpty, IsNumber, Min, IsUUID } from "class-validator";

@Entity()
export class Product {
    @PrimaryKey()
    @IsUUID()
    id!: string;

    @Property()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @Property()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @Min(0)
    price!: number;

    @Property()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @Min(0)
    tax!: number;

    @Property()
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @Min(0)
    totalPrice!: number;
}
