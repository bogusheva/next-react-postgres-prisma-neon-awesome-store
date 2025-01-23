"use server";
import { cookies } from "next/headers";
import { convertToPlainObject, formatErrors, round2 } from "../utils";
import { CartItem } from "../types";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, inserCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

//Calculate cart prices
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0));
    const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
    const taxPrice = round2(0.15 * itemsPrice);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    };
};

export async function addItemToCart(data: CartItem) {
    try {
        //check for cart cookie
        const sessionCartId = (await cookies()).get("sessionCartId")?.value;

        if (!sessionCartId) {
            throw new Error("Cart session is not found");
        }
        //Get session and user Id
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;

        //get cart
        const cart = await getMyCart();

        //Parse and validate item
        const item = cartItemSchema.parse(data);

        //Find product in database
        const product = await prisma.product.findFirst({
            where: {
                id: item.productId,
            },
        });

        if (!product) {
            throw new Error("Product not found!");
        }

        if (!cart) {
            //Create new Cart object
            const newCart = inserCartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calcPrice([item]),
            });

            //Add to database
            await prisma.cart.create({
                data: newCart,
            });

            //Revalidate product page
            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} added to cart`,
            };
        }
        //Check if item is in the cart
        const existItem = (cart.items as CartItem[]).find((item) => product.id === item.productId);
        if (existItem) {
            //Check stock
            if (product.stock < existItem.qty + 1) throw new Error("Not enough stock");

            //Increase the quantity
            existItem.qty += 1;
        } else {
            //If item doesn't exist
            //Check stock
            if (product.stock < 1) throw new Error("Not enough stock");

            //Add item to the cart.items
            cart.items.push(item);
        }
        //Save to database
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as CartItem[]),
            },
        });

        revalidatePath(`/product/${product.slug}`);

        return {
            success: true,
            message: `${product.name} ${existItem ? "updated in" : "added to"} cart`,
        };
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error),
        };
    }
}

export async function getMyCart() {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
        throw new Error("Cart session is not found");
    }

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //Get user cart from database
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) return undefined;

    //convert decimals and return
    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    });
}

export async function removeItemFromCart(productId: string) {
    try {
        //check for cart cookie
        const sessionCartId = (await cookies()).get("sessionCartId")?.value;
        if (!sessionCartId) {
            throw new Error("Cart session is not found");
        }

        //Get product
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
            },
        });

        if (!product) {
            throw new Error("Product not found!");
        }

        //Get user cart
        const cart = await getMyCart();
        if (!cart) {
            throw new Error("Cart not found!");
        }

        //Check for item
        const existItem = (cart.items as CartItem[]).find((item) => item.productId === productId);
        if (!existItem) {
            throw new Error("Item not found!");
        }

        //Check the quantity of item
        if (existItem.qty === 1) {
            //Remove from cart
            cart.items = (cart.items as CartItem[]).filter((item) => item.productId !== existItem.productId);
        } else {
            //Decrease the item's quantity
            (cart.items as CartItem[]).find((item) => item.productId === existItem.productId)!.qty = existItem.qty - 1;
        }

        //Update cart in database
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as CartItem[]),
            },
        });

        revalidatePath(`/product/${product.slug}`);

        return {
            success: true,
            message: `${product.name} was removed from cart`,
        };
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error),
        };
    }
}
