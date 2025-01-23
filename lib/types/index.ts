import { z } from "zod";
import { cartItemSchema, inserCartSchema, insertProductSchema, shippingAddressSchema } from "../validators";

export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: string;
    createdAt: Date;
};

export type Cart = z.infer<typeof inserCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type SignInFormData = {
    success: boolean;
    message: string;
};
