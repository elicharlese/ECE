import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | ECE Platform",
  description: "ECE Platform's privacy policy explains how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="container py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">Last updated: May 11, 2025</p>
        </div>

        <div className="space-y-4">
          <p className="leading-7">
            At ECE Platform, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our platform and services.
          </p>
          <p className="leading-7">
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please
            do not access the platform.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Collection of Your Information</h2>
          <p className="leading-7">
            We may collect information about you in a variety of ways. The information we may collect via the Platform
            includes:
          </p>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Personal Data</h3>
            <p className="leading-7">
              Personally identifiable information, such as your name, email address, and telephone number, that you
              voluntarily give to us when you register with the Platform or when you choose to participate in various
              activities related to the Platform.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Derivative Data</h3>
            <p className="leading-7">
              Information our servers automatically collect when you access the Platform, such as your IP address,
              browser type, operating system, access times, and the pages you have viewed directly before and after
              accessing the Platform.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Financial Data</h3>
            <p className="leading-7">
              Financial information, such as data related to your payment method (e.g., valid credit card number, card
              brand, expiration date) that we may collect when you purchase, order, return, exchange, or request
              information about our services from the Platform.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Blockchain Data</h3>
            <p className="leading-7">
              Information related to blockchain transactions, wallet addresses, and other public blockchain data that is
              inherently transparent due to the nature of blockchain technology.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Use of Your Information</h2>
          <p className="leading-7">
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized
            experience. Specifically, we may use information collected about you via the Platform to:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li className="leading-7">Create and manage your account.</li>
            <li className="leading-7">Process transactions and send transaction notifications.</li>
            <li className="leading-7">
              Compile anonymous statistical data and analysis for use internally or with third parties.
            </li>
            <li className="leading-7">
              Deliver targeted advertising, newsletters, and other information regarding promotions.
            </li>
            <li className="leading-7">Email you regarding your account or order.</li>
            <li className="leading-7">Enable user-to-user communications.</li>
            <li className="leading-7">
              Fulfill and manage purchases, orders, payments, and other transactions related to the Platform.
            </li>
            <li className="leading-7">
              Generate a personal profile about you to make future visits to the Platform more personalized.
            </li>
            <li className="leading-7">Increase the efficiency and operation of the Platform.</li>
            <li className="leading-7">
              Monitor and analyze usage and trends to improve your experience with the Platform.
            </li>
            <li className="leading-7">Notify you of updates to the Platform.</li>
            <li className="leading-7">
              Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.
            </li>
            <li className="leading-7">Process payments and refunds.</li>
            <li className="leading-7">Request feedback and contact you about your use of the Platform.</li>
            <li className="leading-7">Resolve disputes and troubleshoot problems.</li>
            <li className="leading-7">Respond to product and customer service requests.</li>
            <li className="leading-7">Send you a newsletter.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <p className="leading-7">
            If you have questions or comments about this Privacy Policy, please contact us at:
          </p>
          <p className="leading-7">
            ECE Platform
            <br />
            123 Blockchain Avenue
            <br />
            Suite 456
            <br />
            San Francisco, CA 94105
            <br />
            United States
            <br />
            privacy@eceplatform.com
          </p>
        </div>
      </div>
    </div>
  )
}
