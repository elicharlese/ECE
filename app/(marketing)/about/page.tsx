import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | ECE Platform",
  description: "Learn about ECE Platform, our mission, and our team.",
}

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">About ECE Platform</h1>
          <p className="text-xl text-muted-foreground">
            Building the future of blockchain technology and decentralized applications.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="leading-7">
            At ECE Platform, we're dedicated to making blockchain technology accessible, secure, and practical for
            developers and businesses alike. Our platform bridges the gap between traditional development workflows and
            blockchain infrastructure, enabling teams to build decentralized applications with confidence.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="leading-7">
            Founded in 2023, ECE Platform emerged from a collective frustration with the complexity and fragmentation of
            blockchain development tools. Our founding team of engineers and designers set out to create a unified
            platform that would simplify the development process while maintaining the security and decentralization
            principles that make blockchain technology revolutionary.
          </p>
          <p className="leading-7">
            Since then, we've grown into a diverse team of experts spanning blockchain technology, security, UX design,
            and enterprise solutions. We're proud to support thousands of developers and hundreds of projects building
            the next generation of decentralized applications.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Values</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li className="leading-7">
              <span className="font-semibold">Security First:</span> We prioritize security in everything we build,
              ensuring our platform meets the highest standards.
            </li>
            <li className="leading-7">
              <span className="font-semibold">Accessibility:</span> We believe blockchain technology should be
              accessible to developers of all skill levels.
            </li>
            <li className="leading-7">
              <span className="font-semibold">Transparency:</span> We operate with complete transparency, both in our
              code and in our business practices.
            </li>
            <li className="leading-7">
              <span className="font-semibold">Community-Driven:</span> We actively engage with our community and
              incorporate feedback into our development process.
            </li>
            <li className="leading-7">
              <span className="font-semibold">Innovation:</span> We continuously push the boundaries of what's possible
              in blockchain development.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
