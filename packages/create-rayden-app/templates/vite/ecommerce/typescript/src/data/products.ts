export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: "sale" | "new" | "bestseller";
}

export interface CartItem extends Product {
  quantity: number;
}

export const categories = ["All", "Electronics", "Clothing", "Home & Garden", "Sports"];

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium noise-cancelling headphones with 30-hour battery life and crystal-clear audio.",
    price: 199.99,
    originalPrice: 249.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 342,
    inStock: true,
    badge: "sale",
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    description:
      "Track your fitness, receive notifications, and stay connected with this premium smartwatch.",
    price: 299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 189,
    inStock: true,
    badge: "new",
  },
  {
    id: "3",
    name: "Cotton Comfort T-Shirt",
    description: "Ultra-soft 100% organic cotton t-shirt for everyday comfort.",
    price: 29.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 567,
    inStock: true,
    badge: "bestseller",
  },
  {
    id: "4",
    name: "Running Shoes Elite",
    description: "Lightweight performance running shoes with advanced cushioning technology.",
    price: 149.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 423,
    inStock: true,
  },
  {
    id: "5",
    name: "Modern Desk Lamp",
    description:
      "Adjustable LED desk lamp with multiple brightness settings and wireless charging base.",
    price: 79.99,
    originalPrice: 99.99,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 234,
    inStock: true,
    badge: "sale",
  },
  {
    id: "6",
    name: "Ceramic Plant Pot Set",
    description: "Set of 3 minimalist ceramic plant pots with drainage holes and bamboo trays.",
    price: 45.99,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    rating: 4.3,
    reviews: 156,
    inStock: true,
  },
  {
    id: "7",
    name: "Denim Jacket Classic",
    description: "Timeless denim jacket with a modern fit. Perfect for any casual occasion.",
    price: 89.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 312,
    inStock: false,
  },
  {
    id: "8",
    name: "Yoga Mat Premium",
    description: "Extra-thick eco-friendly yoga mat with non-slip surface and carrying strap.",
    price: 59.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 289,
    inStock: true,
    badge: "new",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((product) => product.category === category);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
