import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import SignUpForm from "@/components/auth/SignUpForm";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Logo } from "@/components/branding/Logo";

export default function Register() {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t('signup.pageTitle', 'Create Account')} | Circa</title>
        <meta name="description" content={t('signup.pageDescription', 'Create your Circa account to manage your carbon footprint')} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <header className="border-b py-4">
          <div className="container flex items-center justify-between">
            <Link href="/">
              <Logo className="h-8 w-auto" />
            </Link>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button variant="ghost" asChild>
                <Link href="/auth/login">{t('common.login', 'Log in')}</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 container py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-bold tracking-tight mb-3">
                {t('signup.title', 'Create your account')}
              </h1>
              <p className="text-lg text-gray-600">
                {t('signup.subtitle', 'Enter your details to get started with Circa')}
              </p>
            </div>
            
            <SignUpForm />
            
            <div className="mt-12 text-center space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">{t('signup.whyJoinWaitlist', 'Why join our waitlist?')}</h2>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-primary text-xl font-bold mb-2">1.</div>
                    <h3 className="font-medium mb-2">{t('signup.benefit1Title', 'Early Access')}</h3>
                    <p className="text-gray-600 text-sm">{t('signup.benefit1Description', 'Be among the first to use our platform when it launches')}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-primary text-xl font-bold mb-2">2.</div>
                    <h3 className="font-medium mb-2">{t('signup.benefit2Title', 'Personalized Onboarding')}</h3>
                    <p className="text-gray-600 text-sm">{t('signup.benefit2Description', 'Get personalized support to set up your account')}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-primary text-xl font-bold mb-2">3.</div>
                    <h3 className="font-medium mb-2">{t('signup.benefit3Title', 'Exclusive Offers')}</h3>
                    <p className="text-gray-600 text-sm">{t('signup.benefit3Description', 'Receive exclusive offers and discounts')}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  {t('signup.privacyNotice', 'By signing up, you agree to our Terms of Service and Privacy Policy.')}
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 border-t">
          <div className="container text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Circa. {t('common.allRightsReserved', 'All rights reserved')}</p>
          </div>
        </footer>
      </div>
    </>
  );
}
