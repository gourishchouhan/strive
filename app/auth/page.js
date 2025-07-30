'use client'

import { useSession, signIn, getProviders } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, ArrowLeft, Mail } from 'lucide-react'

export default function AuthPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [providers, setProviders] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (session) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  const handleSignIn = async (providerId) => {
    setIsLoading(true)
    try {
      await signIn(providerId, { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Strive</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Journey</h1>
          <p className="text-muted-foreground">
            Sign in to start creating challenges and tracking your progress
          </p>
        </div>

        {/* Authentication Card */}
        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {providers &&
              Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  {provider.id === 'google' && (
                    <Button
                      onClick={() => handleSignIn(provider.id)}
                      disabled={isLoading}
                      className="w-full h-12 text-base"
                      variant="outline"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                      ) : (
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      )}
                      Continue with Google
                    </Button>
                  )}
                </div>
              ))}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Coming Soon</span>
              </div>
            </div>

            <Button
              disabled
              className="w-full h-12 text-base"
              variant="outline"
            >
              <Mail className="w-5 h-5 mr-2" />
              Continue with Email
            </Button>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-8 text-center">
          <h3 className="font-semibold mb-4 text-muted-foreground">What you&apos;ll get:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center">
              <Target className="h-4 w-4 mr-2 text-primary" />
              Unlimited challenges and tasks
            </div>
            <div className="flex items-center justify-center">
              <Target className="h-4 w-4 mr-2 text-primary" />
              Progress tracking and analytics
            </div>
            <div className="flex items-center justify-center">
              <Target className="h-4 w-4 mr-2 text-primary" />
              Achievement system
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}
