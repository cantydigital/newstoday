import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    quote: "News Today assisted our product launch in getting coverage in several local stations. It was an easy, quick and cheap process.",
    author: "Sophie L.",
    title: "Marketing Director, TechGrow Solutions",
    initials: "SL"
  },
  {
    quote: "News Today has been used to make announcements for all clients. The visibility and the results of the SEO have been superb.",
    author: "Daniel R.",
    title: "PR Consultant, Sydney",
    initials: "DR"
  }
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Trusted by Brands Across Australia
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author} className="border-border">
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{testimonial.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
