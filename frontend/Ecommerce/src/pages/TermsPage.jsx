import { useState } from "react";
import { ChevronDown } from "lucide-react";

const sections = [
  { id: "terms", label: "Terms & Conditions" },
  { id: "shipping", label: "Shipping Policy" },
  { id: "returns", label: "Returns & Refunds" },
  { id: "faq", label: "FAQ" },
];

const faqs = [
  {
    q: "How can I track my order?",
    a: "You can track your order using the tracking number sent to your email after shipment.",
  },
  {
    q: "Can I change my shipping address?",
    a: "If your order has not yet been shipped, contact customer support as soon as possible to request an address update.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept major credit/debit cards, PayPal (where available), and Cash on Delivery in eligible locations.",
  },
  {
    q: "How long do refunds take?",
    a: "Refunds are typically processed within 5–10 business days after the returned item has been inspected and approved.",
  },
  {
    q: "How do I contact customer support?",
    a: "You can reach us by email at support@trendcart.com or by phone during our business hours.",
  },
];

const SectionHeading = ({ id, children }) => (
  <h2 id={id} className="text-xl font-bold mb-4 scroll-mt-24">
    {children}
  </h2>
);

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left px-5 py-4 font-medium hover:bg-gray-50 transition"
      >
        {q}
        <ChevronDown
          size={18}
          className={`text-gray-400 shrink-0 ml-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-gray-600 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
};

const TermsPage = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide mb-2">
        Terms & Conditions
      </h1>
      <p className="text-gray-500 mb-10 sm:mb-12">Last Updated: July 27, 2026</p>

      <div className="grid lg:grid-cols-[200px_1fr] gap-10 lg:gap-14">

        {/* Sticky nav — desktop only */}
        <nav className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className="block w-full text-left text-sm text-gray-500 hover:text-yellow-600 py-2 border-l-2 border-transparent hover:border-yellow-500 pl-3 transition"
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile pill nav */}
        <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className="shrink-0 text-sm border border-gray-200 rounded-full px-4 py-1.5 hover:border-yellow-500 hover:text-yellow-600 transition"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-16 min-w-0">

          {/* Terms & Conditions */}
          <section id="terms">
            <SectionHeading id="terms-heading">Terms & Conditions</SectionHeading>
            <p className="text-gray-700 leading-relaxed mb-8">
              By using TrendCart, you agree to these Terms & Conditions.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="font-bold mb-2">Website Use</h3>
                <p className="text-gray-700 mb-3">You agree to use this website only for lawful purposes.</p>
                <p className="text-gray-700 mb-2">You must not:</p>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                  <li>Attempt to hack or damage the website</li>
                  <li>Submit false information</li>
                  <li>Interfere with other users</li>
                  <li>Upload malicious software</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">Products</h3>
                <p className="text-gray-700 mb-3">
                  We strive to display accurate product information, including pricing,
                  descriptions, and images. However, errors may occasionally occur.
                </p>
                <p className="text-gray-700 mb-2">We reserve the right to:</p>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                  <li>Correct pricing errors</li>
                  <li>Update product information</li>
                  <li>Cancel orders affected by incorrect information</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">Orders</h3>
                <p className="text-gray-700 mb-3">Orders are subject to acceptance and availability.</p>
                <p className="text-gray-700 mb-2">We may cancel orders if:</p>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                  <li>Payment fails</li>
                  <li>Products become unavailable</li>
                  <li>Fraud is suspected</li>
                  <li>Incorrect pricing is displayed</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">Pricing</h3>
                <p className="text-gray-700">
                  Prices are subject to change without prior notice. Applicable taxes and
                  shipping charges will be calculated during checkout.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Payments</h3>
                <p className="text-gray-700">
                  We accept approved payment methods shown during checkout. Payments are
                  processed securely through trusted payment providers.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Intellectual Property</h3>
                <p className="text-gray-700 mb-2">All website content including:</p>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700 mb-3">
                  <li>Logos</li>
                  <li>Images</li>
                  <li>Product descriptions</li>
                  <li>Graphics</li>
                  <li>Design</li>
                  <li>Source code</li>
                </ul>
                <p className="text-gray-700">
                  is owned by TrendCart and may not be copied without written permission.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Limitation of Liability</h3>
                <p className="text-gray-700">
                  TrendCart shall not be liable for indirect, incidental, or consequential
                  damages resulting from the use of our website or products.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Governing Law</h3>
                <p className="text-gray-700">
                  These Terms shall be governed by the laws applicable in the jurisdiction
                  where TrendCart operates.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping Policy */}
          <section id="shipping">
            <SectionHeading id="shipping-heading">Shipping Policy</SectionHeading>

            <div className="space-y-8">
              <div>
                <h3 className="font-bold mb-2">Order Processing</h3>
                <p className="text-gray-700">
                  Orders are usually processed within 1–3 business days. Orders placed on
                  weekends or holidays will be processed on the next business day.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Shipping Time</h3>
                <p className="text-gray-700 mb-3">Estimated delivery times:</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-3">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Local orders</p>
                    <p className="font-bold text-lg">2–5 business days</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">International orders</p>
                    <p className="font-bold text-lg">7–15 business days</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">
                  Delivery times may vary due to weather, customs, or carrier delays.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Shipping Charges</h3>
                <p className="text-gray-700 mb-2">Shipping charges are calculated during checkout based on:</p>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                  <li>Delivery location</li>
                  <li>Order weight</li>
                  <li>Shipping method</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">Order Tracking</h3>
                <p className="text-gray-700">
                  Once your order ships, you'll receive a tracking number by email.
                </p>
              </div>
            </div>
          </section>

          {/* Returns & Refunds */}
          <section id="returns">
            <SectionHeading id="returns-heading">Return & Refund Policy</SectionHeading>
            <p className="text-gray-700 leading-relaxed mb-8">
              We want you to be satisfied with your purchase.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="font-bold mb-2">Returns</h3>
                <p className="text-gray-700 mb-2">
                  You may request a return within 14 days of receiving your order. Returned
                  items must:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                  <li>Be unused</li>
                  <li>Be in original packaging</li>
                  <li>Include all accessories and tags</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">Non-Returnable Items</h3>
                <p className="text-gray-700 mb-2">The following items cannot be returned:</p>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                  <li>Gift cards</li>
                  <li>Personalized products</li>
                  <li>Final sale items</li>
                  <li>Opened hygiene or personal care products (where applicable)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">Refunds</h3>
                <p className="text-gray-700 mb-2">Once we receive and inspect your returned item:</p>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                  <li>Approved refunds will be issued to your original payment method.</li>
                  <li>Processing may take 5–10 business days, depending on your payment provider.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">Damaged or Incorrect Items</h3>
                <p className="text-gray-700">
                  If your order arrives damaged or incorrect, contact us within 48 hours of
                  delivery with photos of the issue.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Cancellation Policy</h3>
                <p className="text-gray-700">
                  Orders may be canceled before they are shipped. Once an order has been
                  dispatched, cancellation is no longer possible. You may instead request a
                  return according to our Return & Refund Policy.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <SectionHeading id="faq-heading">Frequently Asked Questions</SectionHeading>
            <div className="space-y-3">
              {faqs.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 pt-8">
            <h3 className="font-bold mb-2">Still have questions?</h3>
            <p className="text-gray-700 mb-1">
              Email:{" "}
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=alwahab20089@gmail.com"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-yellow-500 transition break-all"
  >
    alwahab20089@gmail.com
  </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsPage;