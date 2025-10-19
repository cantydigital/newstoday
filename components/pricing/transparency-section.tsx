import { BarChart3, Shield, Zap } from "lucide-react"

export default function TransparencySection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Easy, Clear and No Hidden Agenda
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Flexible Payment</h3>
              <p className="text-sm text-muted-foreground">
                Pay per submission or subscribe monthly
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Transparent Pricing</h3>
              <p className="text-sm text-muted-foreground">
                You know exactly what you're getting
              </p>
            </div>
            <div className="text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Scale Anytime</h3>
              <p className="text-sm text-muted-foreground">
                Upgrade when your business needs more
              </p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            With News Today, you pay only for what you need - and every release is optimized for maximum exposure and brand influence.
          </p>
        </div>
      </div>
    </section>
  )
}
