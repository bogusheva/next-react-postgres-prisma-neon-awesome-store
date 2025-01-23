import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/lib/types";
import ShippingAddressForm from "./shipping-form";

export const metadata: Metadata = {
    title: "Shipping address",
};

const ShippingAddressPage = async () => {
    const cart = await getMyCart();
    if (!cart || !cart.items.length) redirect("/cart");

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) throw new Error("No user ID");

    const user = await getUserById(userId);

    return (
        <>
            <ShippingAddressForm address={user.address as ShippingAddress} />
        </>
    );
};

export default ShippingAddressPage;
