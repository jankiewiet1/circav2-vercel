import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendlyEmbed } from "@/components/booking/CalendlyEmbed";
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from "@/components/ui/language-selector";
import { Logo } from "@/components/branding/Logo";

export default function SuccessPage({ searchParams }: { searchParams: Record<string, string> }) {
  const { t } = useTranslation();
  const email = searchParams.email;
  const firstName = searchParams.firstName;
  const lastName = searchParams.lastName;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container flex items-center justify-between">
          <Link href="/">
            <Logo className="h-8 w-auto" />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 container flex items-center justify-center py-12">
        <Card className="w-full max-w-3xl shadow-md">
          <CardHeader className="bg-circa-green-light/10 border-b">
            <CardTitle className="text-2xl font-bold text-circa-green-dark flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('auth.welcomeToCirga', 'Welcome to Circa!')} 🌱
            </CardTitle>
            <CardDescription>
              {t('auth.thankYouForJoining', 'Thank you for joining us in making carbon accounting simple and effective.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-circa-green-dark">{t('auth.nextSteps', 'Next Steps:')}</h3>
              
              <div className="space-y-2 p-4 rounded-lg bg-green-50/50 border border-green-100">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="bg-circa-green w-6 h-6 rounded-full flex items-center justify-center text-white font-bold">1</span>
                  {t('auth.confirmEmail', 'Confirm Your Email')}
                </h4>
                <p className="text-sm text-gray-600 ml-8">
                  {t('auth.sentConfirmationEmail', "We've sent you a confirmation email. Please click the link to verify your account.")}
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-green-50/50 border border-green-100">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="bg-circa-green w-6 h-6 rounded-full flex items-center justify-center text-white font-bold">2</span>
                  {t('auth.bookOnboarding', 'Book Your Onboarding Call')}
                </h4>
                <p className="text-sm text-gray-600 ml-8 mb-4">
                  {t('auth.onboardingDescription', 'Let us show you how Circa can help your organization track and reduce its carbon footprint.')}
                </p>
                <div className="rounded-lg border bg-white overflow-hidden h-[750px] shadow-sm">
                  <CalendlyEmbed 
                    url="https://calendly.com/circa-info"
                    prefill={{
                      email,
                      firstName,
                      lastName
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-green-50/50 border border-green-100">
                <h4 className="font-medium flex items-center gap-2">
                  <span className="bg-circa-green w-6 h-6 rounded-full flex items-center justify-center text-white font-bold">3</span>
                  {t('auth.exploreDashboard', 'Explore the Dashboard')}
                </h4>
                <p className="text-sm text-gray-600 ml-8">
                  {t('auth.afterConfirmation', 'Once your email is confirmed, you can start exploring your carbon accounting dashboard.')}
                </p>
                <Button className="ml-8 mt-2 bg-circa-green hover:bg-circa-green-dark" asChild>
                  <Link href="/dashboard">
                    {t('auth.goToDashboard', 'Go to Dashboard')}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 pt-4 border-t">
              <p>{t('auth.needHelp', 'Need help?')} <a href="mailto:info@circa.site" className="text-circa-green hover:underline">info@circa.site</a></p>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Circa. {t('common.allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
} 