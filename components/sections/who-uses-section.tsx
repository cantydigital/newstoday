import { Card, CardContent } from "@/components/ui/card"
import { Users, BarChart3, Zap, Globe } from "lucide-react"

const userTypes = [
  {
    icon: Users,
    title: "For Businesses",
    description: "Share recent news, new services, or leadership changes. Maintain contact with stakeholders through professional releases."
  },
  {
    icon: BarChart3,
    title: "For PR & Marketing Agencies",
    description: "Easily manage news for various clients. Post, update, and monitor press releases across industries in one place."
  },
  {
    icon: Zap,
    title: "For Startups",
    description: "Gain initial exposure in a competitive market. Share funding news, app launches, or partnerships with journalists and investors."
  },
  {
    icon: Globe,
    title: "For Nonprofits",
    description: "Post your cause, events, and impact stories. Enhance your message and gain followers through professional distribution."
  }
]

export default function WhoUsesSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Who Uses News Today
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {userTypes.map((userType) => {
            const Icon = userType.icon
            return (
              <Card key={userType.title} className="border-border">
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{userType.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {userType.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
