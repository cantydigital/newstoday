import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Target, 
  Eye, 
  Users, 
  CheckCircle, 
  Zap, 
  Search, 
  DollarSign, 
  Shield,
  Building2,
  Briefcase,
  Heart,
  Calendar,
  GraduationCap,
  Mail,
  Globe,
  MapPin,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const services = [
  {
    icon: Target,
    title: "Press Release Distribution",
    description: "Your press releases are announced in a large network of online websites, publications, and search engines, so that your announcement gets the attention of the right people at the right time."
  },
  {
    icon: Search,
    title: "Media Visibility",
    description: "Each release that is distributed with the help of News Today is optimised to achieve better results in search engines and visibility so that your brand could be ranked in the relevant search results and become tractionable across the web."
  },
  {
    icon: Shield,
    title: "Editorial Support",
    description: "This is done by our professional editorial team which goes through every submission and checks on the quality, readability and journalistic ethics. We assist in editing business news into interesting newsworthy stories."
  },
  {
    icon: Building2,
    title: "Business & Industry Coverage",
    description: "We have more than 35 industries, such as technology, finance, and healthcare; entertainment, lifestyle, and startups. News Today is your media partner in terms of professional exposure, no matter your field."
  }
]

const whyChooseUs = [
  {
    icon: CheckCircle,
    title: "Trusted Platform",
    description: "100% Australian owned and operated and has open publishing standards."
  },
  {
    icon: Zap,
    title: "Fast Distribution",
    description: "The majority of the press releases are analyzed and published in 24-48 hours."
  },
  {
    icon: Search,
    title: "SEO Optimised",
    description: "Each issue is designed to increase search presence and online accessibility."
  },
  {
    icon: DollarSign,
    title: "Cost-Effective",
    description: "Economical pricing of individual, agency and business plans."
  },
  {
    icon: Shield,
    title: "Editorial Integrity",
    description: "Our team takes care of all the stories to comply with the professional and ethical standards."
  }
]

const whoUsesUs = [
  {
    icon: Building2,
    title: "Businesses and Startups",
    description: "Promote the opening, investment, or product."
  },
  {
    icon: Briefcase,
    title: "Public Relations Agencies",
    description: "Deal with the media coverage of a number of clients."
  },
  {
    icon: Heart,
    title: "Nonprofits & Institutions",
    description: "Publicize causes and share updates."
  },
  {
    icon: Calendar,
    title: "Event Organizers and Influencers",
    description: "Market future events, prizes or achievements."
  },
  {
    icon: GraduationCap,
    title: "Government & Educational Bodies",
    description: "Disseminate updates or Government initiatives."
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              About News Today
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 text-balance">
              Your Trusted Press Release Platform
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
              News Today is the reliable press release platform for media visibility and brand storytelling in Australia. 
              At newstoday.au, we assist businesses, organizations, and individuals to share their stories with the world 
              through strategic publication and syndication of press releases.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
              <Target className="h-4 w-4" />
              <span>Making news distribution fast, transparent and accessible to everyone</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/submit">
                  Share Your Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 text-balance">
                Who We Are
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
              <p className="text-lg mb-6">
                News Today is an independent Australian press release distribution site developed for the contemporary digital age of communication. 
                We are the bridge between brands with something to say and the audience that needs to hear it.
              </p>
              <p className="text-lg mb-6">
                Whether it's your first product being announced, a national corporation making an announcement, a public figure making a statement to the media, 
                or whatever you have to say—you can be sure that your message will be posted, indexed, and found among readers and journalists 
                that span the nation and around the globe.
              </p>
              <p className="text-lg">
                Our technical and editorial team collaborate to ensure high professionalism, high turnover, and believable publication quality—helping each story count.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 text-balance">
                What We Do
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                At News Today, we are experts in comprehensive press release distribution and media visibility services.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <Card key={service.title} className="border-border hover:shadow-lg transition-shadow">
                    <CardContent className="pt-8">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {service.description}
                          </p>
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

      {/* Mission & Vision */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="border-border">
                <CardContent className="pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-serif font-bold text-foreground">Our Mission</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We want to help businesses and communicators share verified, newsworthy material in a way that they are credible and confident. 
                    We are of the opinion that all organizations, large or small, should have a chance to have their stories shared, found and believed.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We simplify media coverage and make it quicker and more open through a simplified submission process, 
                    professional editorial standards and a robust digital network.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-serif font-bold text-foreground">Our Vision</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    To become the most reliable and innovative tool of press release delivery and media communications in Australia, 
                    allowing people to have equal access to the public space and to influence the future of digital PR.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We also strive to change the relationship between brands and media through data-driven authentic and technology-enhanced storytelling.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose News Today */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 text-balance">
                Why Choose News Today
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                You will not be releasing an announcement only when you publish with News Today, but you will be establishing 
                a presence that will continue to be solid throughout the years and enhance your credibility on the internet.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChooseUs.map((reason) => {
                const Icon = reason.icon
                return (
                  <Card key={reason.title} className="text-center border-border hover:shadow-md transition-shadow">
                    <CardContent className="pt-8">
                      <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-3">{reason.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses News Today */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 text-balance">
                Who Uses News Today
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Anyone who has a story to be told is targeted by our platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whoUsesUs.map((user) => {
                const Icon = user.icon
                return (
                  <Card key={user.title} className="border-border hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{user.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{user.description}</p>
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

      {/* Our Commitment to Quality */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 text-balance">
              Our Commitment to Quality
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
              <p className="text-lg mb-6">
                We are proud of being transparent, professional, and addressing journalistic ethics. 
                Every content is checked as per our Editorial Guidelines to ascertain accuracy, relevance and value to our readers and media partners.
              </p>
              <p className="text-lg">
                We do not like misinformation, spam, or unscrupulous practices—credibility is at the core of our activities.
              </p>
            </div>
            <div className="mt-8">
              <Button variant="outline" asChild>
                <Link href="/editorial">
                  View Editorial Guidelines
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 text-balance">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Have something to tell the world? We will be there to support you through it.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-muted-foreground">info@newstoday.au</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Website</h3>
                  <p className="text-muted-foreground">newstoday.au</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Location</h3>
                  <p className="text-muted-foreground">Sydney, Australia</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                News Today - Your News, Your Spotlight.
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Share your message. Reach your audience. Be confident in making headlines.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/submit">
                    Submit Your Press Release
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
