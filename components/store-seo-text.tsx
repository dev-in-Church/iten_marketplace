import Link from "next/link";

export function StoreSEOText() {
  return (
    <section className="bg-white border-t border-neutral-200 mt-12 py-10 text-neutral-700">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="space-y-6 max-w-none prose prose-sm prose-neutral">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">
              RunnerMKT - Kenya's Leading Online Sports & Fitness Marketplace
            </h1>
            <h2 className="text-sm md:text-base font-semibold text-neutral-800 mb-2">
              Welcome to the ultimate destination for sports gear and apparel!
            </h2>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
              Our e-commerce platform is built to revolutionize your athletic
              shopping experience across Kenya. Whether you are on the hunt for
              high-end fitness tracking technology, professional running shoes,
              or essential strength equipment, we've got you covered. Skip the
              stress of navigating crowded local malls. Enjoy premium shopping
              convenience from Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and
              all across the country.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-xs md:text-sm text-neutral-600">
            <div>
              <h3 className="font-bold text-neutral-800 text-sm md:text-base mb-1">
                Best Prices, Authentic Brands & Diverse Categories
              </h3>
              <p className="leading-relaxed">
                We bridge the gap between verified local vendors and athletes,
                ensuring you get maximum value for your money. Explore deep
                catalogs featuring functional fitness tech, lightweight training
                tees, durable water bottles, and protective gym accessories.
                Shop directly from world-renowned brands such as{" "}
                <Link
                  href="/products?brand=Adidas"
                  className="text-ig-green hover:underline font-medium"
                >
                  Adidas
                </Link>
                ,{" "}
                <Link
                  href="/products?brand=Nike"
                  className="text-ig-green hover:underline font-medium"
                >
                  Nike
                </Link>
                ,{" "}
                <Link
                  href="/products?brand=Asics"
                  className="text-ig-green hover:underline font-medium"
                >
                  Asics
                </Link>
                , and{" "}
                <Link
                  href="/products?brand=Garmin"
                  className="text-ig-green hover:underline font-medium"
                >
                  Garmin
                </Link>{" "}
                with guaranteed quality assurance.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-800 text-sm md:text-base mb-1">
                Exceptional Delivery & Support Systems
              </h3>
              <p className="leading-relaxed">
                Get premium items delivered securely to your doorstep. We
                coordinate with fast logistics channels to guarantee quick
                timelines. Purchases above KES 5,000 enjoy free shipping! Need
                assistance tracking a package, checking item warranties, or
                managing custom team orders? Contact our live support system or
                drop us a message instantly via WhatsApp using our header help
                links.
              </p>
            </div>
          </div>

          <hr className="border-neutral-200 my-6" />

          <div>
            <h3 className="text-sm md:text-base font-bold text-neutral-900 mb-4">
              Frequently Asked Questions (FAQs)
            </h3>
            <div className="space-y-4 text-xs md:text-sm">
              <div>
                <p className="font-semibold text-neutral-800">
                  1. How do I place an order?
                </p>
                <p className="text-neutral-600">
                  Finding and ordering gear is simple: search or browse
                  categories, add your favorite products to your shopping cart,
                  and follow checkout prompts to complete your secure delivery
                  details.
                </p>
              </div>
              <div>
                <p className="font-semibold text-neutral-800">
                  2. What payment methods do you support?
                </p>
                <p className="text-neutral-600">
                  We accept Lipa na M-PESA Paybill transactions, verified
                  Credit/Debit Cards (Visa/Mastercard), and traditional secure
                  checkout integrations tailored for regional Kenyan customers.
                </p>
              </div>
              <div>
                <p className="font-semibold text-neutral-800">
                  3. How long does shipping take?
                </p>
                <p className="text-neutral-600">
                  Standard deliveries within Iten & Eldoret take 3 to 12 working
                  hours. Upcountry orders across other major cities and towns
                  take between 2 to 4 business days depending on localized
                  vendor dispatch configurations.
                </p>
              </div>
              <div>
                <p className="font-semibold text-neutral-800">
                  4. Can I sell items on RunnerMKT?
                </p>
                <p className="text-neutral-600">
                  Yes! If you are an authorized distributor, independent gym
                  equipment supplier, or fitness merchant in Kenya, click 'Sell
                  on RunnerMKT' at the top bar to set up your store vendor
                  portal profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
