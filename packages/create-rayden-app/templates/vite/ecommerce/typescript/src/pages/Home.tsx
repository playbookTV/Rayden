import { Link } from "react-router-dom";
import { Button, Badge } from "@raydenui/ui";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge color="orange" className="mb-4">
              New Arrivals
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-grey-900 mb-4">
              Discover Premium Products
            </h1>
            <p className="text-lg text-grey-600 max-w-2xl mx-auto mb-8">
              Shop the latest trends with free shipping on orders over $50. Quality products,
              unbeatable prices.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/products">
                <Button size="lg">Shop Now</Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="grey" appearance="outlined">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-grey-900">Featured Products</h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-grey-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {["Electronics", "Clothing", "Home & Garden", "Sports"].map((category) => (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group relative h-48 rounded-xl overflow-hidden bg-grey-900"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-grey-900/80 to-grey-900/20 group-hover:from-grey-900/90 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-semibold text-white">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-grey-900 rounded-2xl p-8 md:p-12 text-center">
            <Badge color="orange" className="mb-4">
              Limited Time Offer
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-4">Get 20% Off Your First Order</h2>
            <p className="text-grey-300 mb-6 max-w-xl mx-auto">
              Sign up for our newsletter and receive an exclusive discount code for your first
              purchase.
            </p>
            <Button size="lg" variant="primary">
              Subscribe Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
