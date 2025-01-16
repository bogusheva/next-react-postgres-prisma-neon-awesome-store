import { Product } from "@/lib/types";
import ProductCard from "./product-card";

interface Props {
    products: Product[];
    title?: string;
    limit?: number;
}

const ProductList = ({ products, title, limit }: Props) => {
    const limitedProductList = limit ? products.slice(0, limit) : products;

    return (
        <div className="my-10">
            <h2 className="h2-bold mb-4">{title}</h2>
            {!!limitedProductList.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {limitedProductList.map((product: Product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))}
                </div>
            ) : (
                <h2>No products found</h2>
            )}
        </div>
    );
};

export default ProductList;
