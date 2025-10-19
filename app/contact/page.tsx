import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  MessageCircle, 
  FileText, 
  Briefcase, 
  Users, 
  HeadphonesIcon,
  ArrowRight,
  Linkedin,
  Twitter,
  Facebook
} from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ContactForm from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with News Today",
  description: "Have questions about our press release distribution service? Contact News Today for support, media inquiries, or to learn more about getting your news published across Australia.",
  keywords: [
    "contact news today",
    "press release support",
    "media inquiry Australia",
    "press release help",
    "news distribution contact",
    "Australian media contact"
  ],
  openGraph: {
    title: "Contact Us - Get in Touch with News Today",
    description: "Have questions about our press release distribution service? Contact News Today for support, media inquiries, or to learn more about getting your news published across Australia.",
    url: 'https://newstoday.com.au/contact',
    type: 'website',
    images: [
      {
        url: '/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact News Today - Press Release Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact Us - Get in Touch with News Today",
    description: "Have questions about our press release distribution service? Contact News Today for support, media inquiries, or to learn more about getting your news published across Australia.",
    images: ['/og-contact.jpg'],
  },
  alternates: {
    canonical: 'https://newstoday.com.au/contact',
  },
}

const contactReasons = [
  {
    icon: FileText,
    title: "Submit a Press Release",
    description: "Have news to share? We make it easy, quick, and efficient to submit press releases. Get your story to journalists, media, and readers across Australia.",
    buttonText: "Submit Your Press Release",
    buttonLink: "/submit"
  },
  {
    icon: Briefcase,
    title: "Business & PR Inquiries",
    description: "Need to know about our plans and pricing? Our team will help you find the most suitable options for your company or agency.",
    buttonText: "View Pricing",
    buttonLink: "/pricing"
  },
  {
    icon: Users,
    title: "Media & Partnerships",
    description: "Journalists, bloggers, and media professionals: contact us to discuss partnerships, syndication, or content collaborations.",
    buttonText: "Contact Us",
    buttonLink: "#contact-form"
  },
  {
    icon: HeadphonesIcon,
    title: "Support & Feedback",
    description: "Have a question or suggestion on how to improve our platform? Your feedback helps us serve you better.",
    buttonText: "Get Support",
    buttonLink: "#contact-form"
  }
]

const benefits = [
  "Quick and reliable response to all inquiries",
  "Guidance on press release submission and distribution",
  "Expert advice on SEO, media targeting, and analytics",
  "Dedicated support for businesses, PR agencies, and media partners"
]

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              Contact Us
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 text-balance">
              We'd Love to Hear from You
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
              Whether you have a press release to submit, are interested in our services, or want to explore partnerships, our team is here to help you.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>At News Today, we value transparent communication and timely responses</span>
            </div>
          </div>
        </div>
      </section>

      {/* How Can We Help Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
                How Can We Help You?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {contactReasons.map((reason) => {
                const Icon = reason.icon
                return (
                  <Card key={reason.title} className="border-border hover:shadow-lg transition-shadow">
                    <CardContent className="pt-8">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-3">{reason.title}</h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {reason.description}
                          </p>
                          <Button variant="outline" asChild>
                            <Link href={reason.buttonLink}>
                              {reason.buttonText}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
                Contact Details
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-muted-foreground text-sm">info@newstoday.au</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                  <p className="text-muted-foreground text-sm">+61 2 1234 5678</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Website</h3>
                  <p className="text-muted-foreground text-sm">newstoday.au</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Location</h3>
                  <p className="text-muted-foreground text-sm">Sydney, Australia</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
                Contact Form
              </h2>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and our team will respond as soon as possible.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Why Reach Out Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
                Why Reach Out to News Today?
              </h2>
            </div>

            <Card>
              <CardContent className="pt-8">
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-6 text-center">
                  Our goal is to make your experience smooth and professional, ensuring all press releases and inquiries are handled effectively.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Follow Us Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 text-balance">
              Follow Us
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Stay updated with the latest releases, tips, and media insights from News Today:
            </p>

            <div className="flex justify-center gap-6">
              <Button variant="outline" size="lg" asChild>
                <Link href="#" className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#" className="flex items-center gap-2">
                  <Twitter className="h-5 w-5" />
                  Twitter
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#" className="flex items-center gap-2">
                  <Facebook className="h-5 w-5" />
                  Facebook
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-balance">
              Begin Your Press Release Journey
            </h2>
            <p className="text-lg mb-8 text-pretty opacity-90 leading-relaxed">
              Have a story to tell? Don't wait any longer. Submit your press release or get in touch with us. At News Today, we ensure your news is heard, shared, and remembered.
            </p>
            
            <Button size="lg" variant="secondary" className="text-base" asChild>
              <Link href="/submit">
                Submit Your Press Release
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
