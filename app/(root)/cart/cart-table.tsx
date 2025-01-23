"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { round2 } from "@/lib/utils";

const CartTable = ({ cart }: { cart?: Cart }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    return (
        <>
            <h1 className="py-4 h2-bold">Shopping cart</h1>
            {!cart || !cart.items.length ? (
                <div>
                    Cart is empty. <Link href="/">Go shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.items.map((item) => (
                                    <TableRow key={item.slug}>
                                        <TableCell>
                                            <Link href={`/product/${item.slug}`} className="flex items-center">
                                                <Image src={item.image} alt={item.name} width={50} height={50} />
                                                <span className="px-2">{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="flex-center gap-2">
                                            <Button
                                                disabled={isPending}
                                                variant="outline"
                                                type="button"
                                                onClick={() =>
                                                    startTransition(async () => {
                                                        const res = await removeItemFromCart(item.productId);
                                                        if (!res.success) {
                                                            toast({
                                                                variant: "destructive",
                                                                description: res.message,
                                                            });
                                                        }
                                                    })
                                                }
                                            >
                                                {isPending ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Minus className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <span>{item.qty}</span>
                                            <Button
                                                disabled={isPending}
                                                variant="outline"
                                                type="button"
                                                onClick={() =>
                                                    startTransition(async () => {
                                                        const res = await addItemToCart(item);
                                                        if (!res.success) {
                                                            toast({
                                                                variant: "destructive",
                                                                description: res.message,
                                                            });
                                                        }
                                                    })
                                                }
                                            >
                                                {isPending ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">${round2(item.price).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <div className="pb-3 text-xl">
                                Subtotal ({cart.items.reduce((acc, item) => acc + item.qty, 0)}):
                                <span className="font-bold">{formatCurrency(cart.itemsPrice)}</span>
                            </div>
                            <Button
                                className="w-full"
                                disabled={isPending}
                                onClick={() =>
                                    startTransition(async () => {
                                        router.push("/shipping");
                                    })
                                }
                            >
                                {isPending ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-4 h-4" />
                                )}{" "}
                                Proceed to checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
};

export default CartTable;
