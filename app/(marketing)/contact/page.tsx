import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | ECE Platform",
  description: "Get in touch with the ECE Platform team for support, partnerships, or general inquiries.",
}

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-xl text-muted-foreground">We'd love to hear from you. Get in touch with our team.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <p className="leading-7">
              Have questions about our platform, pricing, or need technical support? Our team is here to help. Fill out
              the form and we'll get back to you as soon as possible.
            </p>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="leading-7">support@eceplatform.com</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Office</h3>
              <p className="leading-7">
                123 Blockchain Avenue
                <br />
                Suite 456
                <br />
                San Francisco, CA 94105
                <br />
                United States
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Social</h3>
              <p className="leading-7">
                Follow us on Twitter, GitHub, LinkedIn, YouTube, and Instagram for the latest updates.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Send a Message</h2>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Your message..."
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
