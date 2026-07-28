const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-10">Last Updated: July 27, 2026</p>

      <p className="text-gray-700 leading-relaxed mb-10">
        Welcome to TrendCart. We value your privacy and are committed to protecting your
        personal information. This Privacy Policy explains how we collect, use, and safeguard
        your information when you use our website.
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold mb-3">Information We Collect</h2>
          <p className="text-gray-700 mb-3">We may collect:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Shipping and billing address</li>
            <li>Payment information (processed securely through third-party payment providers)</li>
            <li>Order history</li>
            <li>Device and browser information</li>
            <li>IP address</li>
            <li>Cookies and usage data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">How We Use Your Information</h2>
          <p className="text-gray-700 mb-3">We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
            <li>Process and deliver orders</li>
            <li>Manage your account</li>
            <li>Respond to customer support requests</li>
            <li>Improve our website and services</li>
            <li>Send order updates and promotional emails (you may unsubscribe at any time)</li>
            <li>Prevent fraud and maintain website security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Cookies</h2>
          <p className="text-gray-700 mb-3">We use cookies to:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
            <li>Remember your preferences</li>
            <li>Keep you logged in</li>
            <li>Improve website performance</li>
            <li>Analyze website traffic</li>
          </ul>
          <p className="text-gray-700 mt-3">
            You can disable cookies in your browser settings, although some features may not
            function properly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Sharing Information</h2>
          <p className="text-gray-700 mb-3">We do not sell your personal information.</p>
          <p className="text-gray-700 mb-3">
            We may share your information only with trusted third parties such as:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
            <li>Payment processors</li>
            <li>Shipping providers</li>
            <li>Analytics providers</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Data Security</h2>
          <p className="text-gray-700">
            We implement reasonable security measures to protect your personal information.
            However, no online system is completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Your Rights</h2>
          <p className="text-gray-700 mb-3">Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for marketing communications</li>
          </ul>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold mb-3">Contact</h2>
          <p className="text-gray-700 mb-2">
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-700">
            Email:{" "}
            <a href="mailto:support@trendcart.com" className="text-yellow-600 hover:underline">
              support@trendcart.com
            </a>
          </p>
          <p className="text-gray-700">Phone: +1 (000) 000-0000</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;