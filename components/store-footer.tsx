import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function StoreFooter() {
  return (
    <footer className="bg-ig-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Image
              src="/images/logo.png"
              alt="RunnerMKT"
              width={140}
              height={48}
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {
                "Kenya's leading multi-vendor sports equipment marketplace. Quality gear from verified vendors, delivered to your doorstep."
              }
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-ig-green transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-ig-green transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-ig-green transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-ig-green transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/products"
                  className="text-white/60 text-sm hover:text-ig-green transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=running"
                  className="text-white/60 text-sm hover:text-ig-green transition-colors"
                >
                  Running
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=football"
                  className="text-white/60 text-sm hover:text-ig-green transition-colors"
                >
                  Football
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=gym-fitness"
                  className="text-white/60 text-sm hover:text-ig-green transition-colors"
                >
                  Gym & Fitness
                </Link>
              </li>
              <li>
                <Link
                  href="https://vendorcenter.sporttechies.com/"
                  className="text-white/60 text-sm hover:text-ig-green transition-colors"
                >
                  Sell on RunnerMKT
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/help"
                  className="text-white/60 text-sm hover:text-ig-green transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-white/60 text-sm hover:text-ig-green transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-white/60 text-sm hover:text-ig-green transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/60 text-sm hover:text-ig-green transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-white/60 text-sm hover:text-ig-green transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-ig-green shrink-0" />
                <span className="text-white/60 text-sm">
                  Iten Town, Elgeyo Marakwet, Kenya
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-ig-green shrink-0" />
                <span className="text-white/60 text-sm">+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-ig-green shrink-0" />
                <span className="text-white/60 text-sm">
                  support@runnermkt.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment methods & copyright */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            {`\u00A9 ${new Date().getFullYear()} RunnerMKT. All rights reserved.`}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs">Accepted Payments:</span>
            <span className="bg-ig-green px-3 py-1 rounded text-xs font-bold">
              M-PESA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
