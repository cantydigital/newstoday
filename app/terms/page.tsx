import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Scale, Mail, Globe, MapPin, AlertTriangle, Shield, Users } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              Terms of Service
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 text-balance">
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
              Welcome to News Today. By using our website and services, you agree to these Terms of Service. Please read them carefully.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Scale className="h-4 w-4" />
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
                  Welcome to News Today ("we," "us," or "our"). By using or accessing our website <strong>newstoday.au</strong> and services such as submitting press releases, distributing them, or any similar functionality, you agree to and accept these Terms of Service ("Terms"). Please read them carefully.
                </p>
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Important:</strong> If you do not agree to these Terms, please do not use our website and services.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acceptance of Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Acceptance of Terms</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">
                    By using News Today, you acknowledge that you have read and accepted these Terms, our Privacy Policy, and any other policies referenced herein. These Terms apply to all visitors, users, and others who access or use our services.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Eligibility */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Eligibility</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Users className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        You must be at least 18 years old to use News Today. If you are under this age or under the legal age to enter into agreements in your jurisdiction, you are prohibited from using our services.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        By agreeing to these Terms, you warrant that you are legally able to enter into this agreement.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Registration */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Account Registration</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Certain features of News Today may require account creation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>You agree to provide accurate and complete information during registration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>You are responsible for maintaining the confidentiality of your account credentials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>You are liable for all activities that occur under your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>News Today reserves the right to suspend or terminate accounts for unauthorized or fraudulent activity</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Use of Services */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Use of Services</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">a. Press Release Submission</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>You may submit press releases through our platform for publication and distribution</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>By submitting content, you warrant that you have the right to publish the material and that it does not infringe on third-party rights</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Your submissions must comply with all applicable laws and News Today's editorial guidelines</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">b. Prohibited Content</h3>
                    <p className="text-muted-foreground mb-4">You may not submit content that is:</p>
                    <ul className="space-y-2 text-muted-foreground mb-4">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-2">×</span>
                        <span>Defamatory, abusive, or obscene</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-2">×</span>
                        <span>Infringing on copyright, trademark, or other intellectual property rights</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-2">×</span>
                        <span>Containing misleading or false information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-2">×</span>
                        <span>Promoting illegal activities, viruses, or malware</span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground">
                      News Today reserves the right to review, edit, or reject any content at our sole discretion.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Payment and Subscription */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Payment and Subscription</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Paid services such as premium press release submissions are charged according to the selected plan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>All transactions are processed securely through third-party payment processors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Refunds are at News Today's discretion and subject to our refund policy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>You are responsible for any applicable taxes on your purchases</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Intellectual Property</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>News Today owns all website content, branding, logos, and software, or has proper licensing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>You may not copy, reproduce, distribute, or create derivative works without written permission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>User-submitted press releases remain your intellectual property</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>By submitting content, you grant News Today a non-exclusive, worldwide, royalty-free license to publish, distribute, and promote the material through our platform</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Termination</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>News Today may suspend or terminate user access, accounts, or content at our sole discretion, including for violations of these Terms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Upon termination, you lose all rights to use the platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Payments made prior to termination are non-refundable unless otherwise specified</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Disclaimers */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Disclaimers</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      News Today provides the platform on an "AS-IS" basis and makes no warranties regarding the accuracy, completeness, or reliability of submitted content.
                    </p>
                    <p>
                      We are not responsible for third-party actions or media coverage resulting from your press release distribution.
                    </p>
                    <p>
                      News Today disclaims all warranties, whether express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Limitation of Liability</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      To the maximum extent permitted by law, News Today shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform.
                    </p>
                    <p>
                      This includes, but is not limited to, loss of revenue, data, or reputation.
                    </p>
                    <p>
                      Your sole remedy for dissatisfaction with the platform is to discontinue use.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Indemnification */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Indemnification</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    You agree to defend, indemnify, and hold harmless News Today, its officers, employees, and affiliates from any claims, damages, liabilities, or expenses arising from:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Your content submissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Your violation of these Terms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Your infringement of third-party rights</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Changes to Terms</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    News Today reserves the right to modify these Terms at any time. Changes will be posted on <strong>newstoday.au</strong> with a new Effective Date. Continued use of the platform constitutes acceptance of the revised Terms.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Governing Law</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Scale className="h-6 w-6 text-primary mt-1" />
                    <p className="text-muted-foreground">
                      These Terms are governed by Australian law. Any disputes will be subject to the exclusive jurisdiction of the courts in Sydney, Australia.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Contact Us</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">
                    If you have any questions or concerns regarding these Terms, please contact us:
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
                <p className="text-muted-foreground mb-4">
                  By using News Today, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
                <p className="text-sm text-muted-foreground">
                  Thank you for choosing News Today for your press release distribution needs.
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
