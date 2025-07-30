'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Target, 
  Calendar, 
  BarChart3, 
  Trophy, 
  CheckCircle, 
  Users, 
  ArrowRight,
  Star,
  Zap,
  Shield
} from 'lucide-react'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (session) {
      router.push('/dashboard')
    }
  }, [session, status, router])

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Strive</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
          <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
        </nav>
        <Link href="/auth">
          <Button variant="outline">Sign In</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Transform Your Life, One Challenge at a Time
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create meaningful challenges, track your daily progress, and build lasting habits that lead to personal growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to help you create, track, and complete your personal growth journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardHeader>
              <Target className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Challenge Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create custom challenges with clear goals, deadlines, and daily tasks to keep you motivated.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardHeader>
              <Calendar className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Daily Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Organize your day with smart scheduling, priority levels, and time management tools.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardHeader>
              <BarChart3 className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Progress Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Visualize your progress with detailed charts, completion rates, and streak tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg bg-card/50 backdrop-blur">
            <CardHeader>
              <Trophy className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Unlock badges and achievements as you reach milestones and maintain streaks.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started with your personal growth journey in just three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Challenge</h3>
              <p className="text-muted-foreground">
                Define your goals, set timeframes, and break them down into manageable daily tasks.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Track Daily Progress</h3>
              <p className="text-muted-foreground">
                Complete daily tasks, schedule your time, and mark achievements as you go.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">See Your Growth</h3>
              <p className="text-muted-foreground">
                Analyze your progress, earn achievements, and build lasting habits that stick.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Challenges Completed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">85%</div>
            <div className="text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of people who are already transforming their lives with Strive.
          </p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Strive</span>
              </div>
              <p className="text-muted-foreground">
                Transform your life, one challenge at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Strive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
