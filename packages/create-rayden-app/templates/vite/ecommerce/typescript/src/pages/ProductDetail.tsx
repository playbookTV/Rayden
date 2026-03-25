import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Badge, Button, Breadcrumb, Divider, Counter } from "@raydenui/ui";
import { getProductById, formatPrice, products } from "../data/products";
import { addToCart } from "../data/cart";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-grey-900 mb-4">Product not found</h1>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const badgeColors = {
    sale: "error" as const,
    new: "blue" as const,
    bestseller: "success" as const,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
        className="mb-8"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-grey-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {product.badge && (
            <Badge color={badgeColors[product.badge]} className="absolute top-4 left-4 uppercase">
              {product.badge}
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-sm text-grey-500 mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold text-grey-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="font-medium text-grey-900">{product.rating}</span>
            </div>
            <span className="text-grey-400">|</span>
            <span className="text-grey-600">{product.reviews} reviews</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-grey-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xl text-grey-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <Badge color="error">
                Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>

          <p className="text-grey-600 mb-8">{product.description}</p>

          <Divider className="mb-6" />

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-grey-700">Quantity:</span>
            <Counter value={quantity} onChange={setQuantity} min={1} max={10} size="md" />
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button size="lg" variant="grey" appearance="outlined">
              ♡
            </Button>
          </div>

          {!product.inStock && (
            <p className="text-sm text-error-500 mt-4">This product is currently out of stock.</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-grey-900 mb-8">Related Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
