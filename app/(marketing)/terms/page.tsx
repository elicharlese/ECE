import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | ECE Platform",
  description: "ECE Platform's terms of service outline the rules and guidelines for using our platform.",
}

export default function TermsPage() {
  return (
    <div className="container py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">Last updated: May 11, 2025</p>
        </div>

        <div className="space-y-4">
          <p className="leading-7">
            These Terms of Service ("Terms") govern your access to and use of the ECE Platform, including any content,
            functionality, and services offered on or through our website and platform (collectively, the "Service").
          </p>
          <p className="leading-7">
            Please read the Terms carefully before you start to use the Service. By using the Service, you accept and
            agree to be bound and abide by these Terms. If you do not want to agree to these Terms, you must not access
            or use the Service.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">1. Accounts and Registration</h2>
          <p className="leading-7">
            When you create an account with us, you must provide information that is accurate, complete, and current at
            all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of
            your account on our Service.
          </p>
          <p className="leading-7">
            You are responsible for safeguarding the password that you use to access the Service and for any activities
            or actions under your password, whether your password is with our Service or a third-party service.
          </p>
          <p className="leading-7">
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming
            aware of any breach of security or unauthorized use of your account.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">2. Intellectual Property</h2>
          <p className="leading-7">
            The Service and its original content, features, and functionality are and will remain the exclusive property
            of ECE Platform and its licensors. The Service is protected by copyright, trademark, and other laws of both
            the United States and foreign countries.
          </p>
          <p className="leading-7">
            Our trademarks and trade dress may not be used in connection with any product or service without the prior
            written consent of ECE Platform.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">3. User Content</h2>
          <p className="leading-7">
            Our Service allows you to post, link, store, share and otherwise make available certain information, text,
            graphics, videos, or other material ("User Content"). You are responsible for the User Content that you post
            on or through the Service, including its legality, reliability, and appropriateness.
          </p>
          <p className="leading-7">
            By posting User Content on or through the Service, you represent and warrant that: (i) the User Content is
            yours (you own it) or you have the right to use it and grant us the rights and license as provided in these
            Terms, and (ii) the posting of your User Content on or through the Service does not violate the privacy
            rights, publicity rights, copyrights, contract rights or any other rights of any person.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">4. Blockchain and Cryptocurrency</h2>
          <p className="leading-7">
            Our Service involves blockchain technology, cryptocurrencies, and digital assets. You acknowledge and agree
            that:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li className="leading-7">
              The value of cryptocurrencies and digital assets can be volatile, and we make no representations about the
              future value of any cryptocurrency or digital asset.
            </li>
            <li className="leading-7">
              Blockchain transactions are irreversible, and we cannot recover or reverse any transaction once it has
              been submitted to the blockchain.
            </li>
            <li className="leading-7">
              You are solely responsible for maintaining the security of your private keys and wallet credentials.
            </li>
            <li className="leading-7">
              Regulatory frameworks for blockchain technology, cryptocurrencies, and digital assets are still evolving,
              and changes in regulations may adversely affect our Service or your ability to use it.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
          <p className="leading-7">
            In no event shall ECE Platform, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access
            to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on
            the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of
            your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other
            legal theory, whether or not we have been informed of the possibility of such damage.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">6. Contact Us</h2>
          <p className="leading-7">If you have any questions about these Terms, please contact us at:</p>
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
            legal@eceplatform.com
          </p>
        </div>
      </div>
    </div>
  )
}
