"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { Product } from "../types";

//Get latest products
export async function getLatestProducts() {
    const data: Product[] = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { createdAt: "desc" },
    });

    const modifiedData = data.map((product) => ({
        ...product,
        price: product.price.toString(),
        rating: product.rating.toString(),
    }));

    return convertToPlainObject(modifiedData);
}

//Get single product by its slug
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: { slug: slug },
    });
}
