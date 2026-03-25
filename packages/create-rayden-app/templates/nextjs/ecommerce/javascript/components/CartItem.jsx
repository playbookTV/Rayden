"use client";

import { Button, Counter } from "@raydenui/ui";
import { formatPrice } from "@/data/products";
import { updateQuantity, removeFromCart } from "@/data/cart";

export default function CartItem({ item }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-grey-200 last:border-0">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-grey-100 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-grey-900 truncate">{item.name}</h3>
        <p className="text-sm text-grey-500">{item.category}</p>
        <p className="text-lg font-semibold text-grey-900 mt-1">
          {formatPrice(item.price)}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Counter
          value={item.quantity}
          onChange={(value) => updateQuantity(item.id, value)}
          min={1}
          max={10}
          size="sm"
        />
        <Button
          variant="destructive"
          appearance="outlined"
          size="sm"
          onClick={() => removeFromCart(item.id)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
