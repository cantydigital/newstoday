import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Mail, Globe, MapPin } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              Privacy Policy
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 text-balance">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
              Your privacy is our number one priority at News Today. This Privacy Policy describes how we collect, use, and protect your personal information.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Effective Date: October 16, 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            {/* Introduction */}
            <Card className="mb-8">
              <CardContent className="pt-8">
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is our number one priority at News Today ("we," "us," or "our"). This Privacy Policy describes what we collect, how we use, and how we protect your personal information when you visit our website, submit press releases, or use our services at <strong>newstoday.au</strong>. By using News Today, you accept the terms of this policy.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Information We Collect</h2>
              <p className="text-muted-foreground mb-6">
                When you interact with News Today, we may collect the following information:
              </p>

              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">a. Personal Information</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Name, email address, phone number</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Company or organization details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Billing information for paid submissions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Username and password for account creation</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">b. Press Release Data</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Text, images, and media files that you submit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Category and industry selections</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Metadata for SEO purposes</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">c. Technical and Usage Data</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Browser, IP address, and device information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Page views, clicks, and time spent on site</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Cookies and analytics data to improve your experience</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">How We Use Your Information</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">We use your information for the following purposes:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>To publish and distribute press releases through newstoday.au</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>To respond to inquiries and provide customer support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>To process payments for premium plans or services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>To improve our services and website functionality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>To send newsletters, updates, or promotional offers (only if you opt-in)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>To comply with legal requirements</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sharing Your Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Sharing Your Information</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    We respect your privacy and do not sell your personal data. We may share information in the following circumstances:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>With service providers who help us operate our platform (e.g., hosting, analytics, email services)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>With journalists and media outlets when distributing your press releases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>When required by law or in response to legal processes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>In connection with business transfers, mergers, or acquisitions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Cookies and Tracking */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Cookies and Tracking Technologies</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    News Today uses cookies and similar technologies to enhance your experience, including:
                  </p>
                  <ul className="space-y-2 text-muted-foreground mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Remembering your login information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Analyzing website usage and performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Providing personalized content and offers</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    You can control cookie preferences through your browser settings. Please note that disabling cookies may affect site functionality.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Data Security</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or modification. This includes encryption, secure servers, and regular security audits.
                  </p>
                  <p className="text-muted-foreground">
                    While we strive to protect your data, no method of online transmission is 100% secure. You acknowledge this limitation by using our service.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Your Rights</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">Depending on your location, you may have the right to:</p>
                  <ul className="space-y-2 text-muted-foreground mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Access and obtain a copy of the personal data we hold about you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Request correction of inaccurate or incomplete information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Request deletion of your personal information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Unsubscribe from marketing communications</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    To exercise your rights, please contact us at <strong>info@newstoday.au</strong>.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Children's Privacy</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    News Today is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If we discover that we have collected such information, we will delete it immediately.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Third-Party Links */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Third-Party Links</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    Our website may contain links to third-party websites. We are not responsible for the privacy practices of these sites. Please review their privacy policies before providing any personal information.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Changes to Privacy Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Changes to This Privacy Policy</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. Changes will be posted on this page with a new effective date. We encourage you to review this policy periodically to stay informed about how we protect your information.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Contact Us</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">
                    If you have any questions about this Privacy Policy or your personal information, please contact us:
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Email</p>
                        <p className="text-muted-foreground">info@newstoday.au</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Website</p>
                        <p className="text-muted-foreground">https://newstoday.au</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Address</p>
                        <p className="text-muted-foreground">Sydney, Australia</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Closing Statement */}
            <Card className="bg-muted/30">
              <CardContent className="pt-8 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  News Today is committed to protecting your privacy and ensuring you have a secure, transparent experience when distributing press releases.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
