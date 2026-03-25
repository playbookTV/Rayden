"use client";

import Link from "next/link";
import { Badge, Button } from "@raydenui/ui";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { addToCart } from "@/data/cart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const badgeColors = {
    sale: "error" as const,
    new: "blue" as const,
    bestseller: "success" as const,
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-grey-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <Badge
            color={badgeColors[product.badge]}
            className="absolute top-3 left-3 uppercase text-xs"
          >
            {product.badge}
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-grey-900/50 flex items-center justify-center">
            <Badge color="neutral">Out of Stock</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-grey-500 mb-1">{product.category}</p>
        <h3 className="font-medium text-grey-900 mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-grey-600">{product.rating}</span>
          </div>
          <span className="text-sm text-grey-400">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-grey-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-grey-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Button size="sm" onClick={handleAddToCart} disabled={!product.inStock}>
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
}
