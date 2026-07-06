import { ShieldCheck, Truck, RotateCcw, Lock, Tag, Star, ShieldCheck as ShieldPromise } from "lucide-react";

const topFeatures = [
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Directly from brands. Every product verified.",
    badge: "Verified Quality",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free shipping on prepaid orders above ₹499.",
    badge: "No Extra Charges",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day hassle-free return policy.",
    badge: "Quick & Easy",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Razorpay secured. UPI, Cards, Net banking & more.",
    badge: "100% Safe",
  },
];

const bottomFeatures = [
  {
    icon: Tag,
    title: "Best Prices",
    description: "Unbeatable offers on top brands",
  },
  {
    icon: Star,
    title: "4.8/5 Customer Rating",
    description: "Trusted by 50,000+ happy customers",
  },
  {
    icon: ShieldPromise,
    title: "Brand Promise",
    description: "Genuine products. Always.",
  },
];

export default function TrustBadges() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Top 4-card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topFeatures.map(({ icon: Icon, title, description, badge }) => (
          <div
            key={title}
            className="border border-gray-200 rounded-xl p-5 flex flex-col gap-3 bg-white"
          >
            <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center">
              <Icon className="w-6 h-6 text-green-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-[15px]">
                {title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 leading-snug">
                {description}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 self-start text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
              {badge}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom strip */}
      <div className="mt-4 bg-green-50/60 rounded-xl px-6 py-5 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-green-200">
        {bottomFeatures.map(({ icon: Icon, title, description }, i) => (
          <div
            key={title}
            className={`flex items-start gap-3 py-3 sm:py-0 ${
              i === 0 ? "sm:pr-6" : i === 1 ? "sm:px-6" : "sm:pl-6"
            }`}
          >
            <Icon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
