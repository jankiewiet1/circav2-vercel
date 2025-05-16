import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { FormItem } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Logo } from "@/components/branding/Logo";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirect } = router.query;
  const from = redirect ? String(redirect) : "/dashboard";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn, session } = useAuth();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (session) {
      router.replace(from);
    }
  }, [session, router, from]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password, remember);
      if (error) {
        throw error;
      }
      // Navigation handled by useEffect
    } catch (error: any) {
      setError(error.message || t('login.genericError', 'Login failed. Please try again.'));
      setLoading(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{t('login.pageTitle', 'Log In')} | Circa</title>
        <meta name="description" content={t('login.pageDescription', 'Log in to your Circa account')} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <header className="border-b py-4">
          <div className="container flex items-center justify-between">
            <Link href="/">
              <Logo className="h-8 w-auto" />
            </Link>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button variant="primary" asChild>
                <Link href="/auth/register">{t('common.signup', 'Sign up')}</Link>
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 container py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                {t('login.title', 'Log in to your account')}
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                {t('login.subtitle', 'Enter your email and password to access your account')}
              </p>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <FormItem>
                <Label htmlFor="email">{t('common.email', 'Email')}</Label>
                <Input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </FormItem>
              
              <FormItem>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('common.password', 'Password')}</Label>
                  <Link 
                    href="/auth/forgot-password"
                    className="text-sm font-semibold text-primary hover:text-primary/90"
                  >
                    {t('login.forgotPassword', 'Forgot password?')}
                  </Link>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </FormItem>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked as boolean)}
                />
                <label 
                  htmlFor="remember"
                  className="text-sm text-gray-500 cursor-pointer"
                >
                  {t('login.rememberMe', 'Remember me')}
                </label>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.loading', 'Loading...')}
                  </>
                ) : (
                  t('login.loginButton', 'Log in')
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-500">
                {t('login.noAccount', "Don't have an account?")}{' '}
                <Link 
                  href="/auth/register"
                  className="font-semibold text-primary hover:text-primary/90"
                >
                  {t('login.createAccount', 'Create an account')}
                </Link>
              </div>
            </form>
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
