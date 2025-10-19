import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Mail, Phone, Globe, CheckCircle, XCircle, Clock, Search, Image, Shield } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function EditorialGuidelinesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              Editorial Guidelines
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 text-balance">
              Editorial Guidelines
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
              News Today is committed to maintaining high editorial standards and ensuring the accuracy, professionalism, and newsworthiness of all press releases published on our platform.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Quality standards for professional press release distribution</span>
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
                  Our Editorial Guidelines help you create content that meets our quality standards and effectively reaches your target audience. By submitting a press release on <strong>newstoday.au</strong>, you agree to follow these guidelines.
                </p>
              </CardContent>
            </Card>

            {/* Newsworthiness and Relevance */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Newsworthiness and Relevance</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">Your press release should:</p>
                  <ul className="space-y-3 text-muted-foreground mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Be timely, relevant, and interesting to journalists, media outlets, and readers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Announce significant company developments, products, partnerships, events, awards, or milestones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Avoid purely promotional or sales-oriented content that lacks news value</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    We prioritize informative, educational, or newsworthy content that provides genuine value to our audience.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Accuracy and Truthfulness */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Accuracy and Truthfulness</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-muted-foreground mb-4">
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>All information must be factual and verifiable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Avoid exaggerations, false claims, or misleading statements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Ensure all statistics, quotes, and data are accurate and properly sourced</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    News Today reserves the right to reject or request revisions to any content containing inaccurate or unverified information.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Professional Tone and Style */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Professional Tone and Style</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Writing Standards</h3>
                    <ul className="space-y-2 text-muted-foreground mb-4">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Write in a professional, clear, and concise manner</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Use neutral language - avoid offensive, inflammatory, or discriminatory content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-2">•</span>
                        <span>Minimize jargon or overly technical language unless relevant to your audience</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Required Structure</h3>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-3"></div>
                        <div>
                          <strong>Headline:</strong> Clear, informative, and engaging
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-3"></div>
                        <div>
                          <strong>Subheadline (optional):</strong> Provides additional context
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-3"></div>
                        <div>
                          <strong>Dateline:</strong> City and date of release
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-3"></div>
                        <div>
                          <strong>Body:</strong> Organized in inverted pyramid format with most important information first
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-3"></div>
                        <div>
                          <strong>Quotes (recommended):</strong> From company representatives, partners, or stakeholders
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-3"></div>
                        <div>
                          <strong>Contact Information:</strong> Include at least one media contact
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Formatting and Length */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Formatting and Length</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span><strong>Preferred length:</strong> 300-800 words. Longer releases may be accepted if they have significant news value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Use clear headings and paragraphs for easy readability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Use standard fonts and avoid excessive formatting, colors, or graphics that may affect readability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-2">•</span>
                      <span>Images, logos, and videos should be high-resolution and relevant to the press release</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Prohibited Content */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Prohibited Content</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">News Today does not accept press releases containing:</p>
                  <ul className="space-y-2 text-muted-foreground mb-4">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Defamatory, abusive, obscene, or offensive content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Discriminatory language, hate speech, or illegal material</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>False or misleading information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Unauthorized copyrighted or third-party content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Political lobbying, fundraising requests, or unrelated advertisements</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    Non-compliance may result in rejection or removal of your press release.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Editorial Review Process */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Editorial Review Process</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-2">•</span>
                          <span>Our editorial team reviews every submission for quality, clarity, and compliance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-2">•</span>
                          <span>We may edit headlines, formatting, or minor errors to improve readability and SEO performance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-2">•</span>
                          <span>We may contact submitters for additional information or clarification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-2">•</span>
                          <span><strong>Review time:</strong> Typically 24-48 hours. Priority review available with premium plans</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Multimedia and Copyright */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Multimedia and Copyright</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Image className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-2">•</span>
                          <span>You must own or be licensed to use all images, logos, and multimedia content</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-2">•</span>
                          <span>Provide appropriate captions and credits for images where required</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-2">•</span>
                          <span>Ensure multimedia files are relevant, professional, and high-quality</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-2">•</span>
                          <span>News Today reserves the right to remove or reject content that violates copyright or licensing terms</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SEO and Metadata */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">SEO and Metadata</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Search className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-2">•</span>
                          <span>Include relevant keywords naturally throughout your release for better search visibility</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-2">•</span>
                          <span>Use clear and descriptive titles and meta descriptions for optimal SEO performance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-2">•</span>
                          <span>Avoid keyword stuffing and unnatural phrasing - readability comes first</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance and Legal Responsibility */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Compliance and Legal Responsibility</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Submitters are responsible for ensuring their content complies with all applicable laws, including advertising standards, privacy regulations, and intellectual property laws.
                    </p>
                    <p>
                      News Today accepts no legal liability for any legal issues arising from content you submit.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Best Practices */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Best Practices for Effective Press Releases</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Start with the most important information first</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Keep sentences and paragraphs concise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Include quotes to add authenticity and human interest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Provide links to company websites or relevant resources where appropriate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>End with a company boilerplate describing your organization</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Following these practices increases your chances of media pickup, audience engagement, and online visibility.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Editorial Contact */}
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Editorial Contact</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">
                    If you have questions about our Editorial Guidelines or need assistance with your press release, please contact our editorial team:
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Email</p>
                        <p className="text-muted-foreground">editorial@newstoday.au</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Phone</p>
                        <p className="text-muted-foreground">+61 2 1234 5678</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold text-foreground">Website</p>
                        <p className="text-muted-foreground">https://newstoday.au</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Closing Statement */}
            <Card className="bg-muted/30">
              <CardContent className="pt-8 text-center">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  News Today is committed to maintaining the highest editorial standards to ensure all press releases are professional, credible, and effective.
                </p>
                <p className="text-sm text-muted-foreground">
                  By following these guidelines, you help us provide a trusted platform where businesses, agencies, and journalists can confidently share and discover news.
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
