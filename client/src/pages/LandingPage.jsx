import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  ArrowRight, 
  Heart, 
  Users, 
  Leaf, 
  Star,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const LandingPage = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Heart,
      title: 'Sustainable Fashion',
      description: 'Give your clothes a second life and reduce textile waste in our community.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with like-minded fashion enthusiasts who care about sustainability.'
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Every swap helps reduce the environmental impact of fast fashion.'
    },
    {
      icon: Star,
      title: 'Quality Items',
      description: 'Carefully curated items from community members who value quality.'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Items Swapped', value: '50K+' },
    { label: 'CO2 Saved', value: '25K kg' },
    { label: 'Happy Swappers', value: '95%' }
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'List Your Items',
      description: 'Upload photos and details of clothing you no longer wear.'
    },
    {
      step: '2',
      title: 'Browse & Connect',
      description: 'Discover items from other community members and initiate swaps.'
    },
    {
      step: '3',
      title: 'Swap & Save',
      description: 'Complete exchanges and earn points for future swaps.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>ReWear - Community Clothing Exchange | Sustainable Fashion</title>
        <meta name="description" content="Join ReWear's community clothing exchange platform. Swap unused clothing, reduce waste, and embrace sustainable fashion." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-50 to-accent-50 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
                Sustainable Fashion
                <span className="block gradient-text">Community Exchange</span>
              </h1>
              <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
                Join thousands of fashion enthusiasts who are reducing waste and building 
                a sustainable future through clothing swaps and community connections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Link
                    to="/items"
                    className="btn btn-primary btn-lg group"
                  >
                    Browse Items
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn btn-primary btn-lg group"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/items"
                      className="btn btn-outline btn-lg"
                    >
                      Browse Items
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-secondary-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Why Choose ReWear?
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                We're building a community that values sustainability, quality, and connection.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                Getting started with ReWear is simple and rewarding.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-secondary-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-primary-600 to-accent-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Swapping?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join our community today and start your sustainable fashion journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/add-item"
                  className="btn bg-white text-primary-600 hover:bg-secondary-50 btn-lg"
                >
                  List Your First Item
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn bg-white text-primary-600 hover:bg-secondary-50 btn-lg"
                  >
                    Join ReWear
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 btn-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-secondary-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Shield className="w-12 h-12 text-primary-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
                <p className="text-secondary-300">
                  Your data and transactions are protected with industry-standard security.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="w-12 h-12 text-primary-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
                <p className="text-secondary-300">
                  Simple interface designed for quick and effortless clothing exchanges.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="w-12 h-12 text-primary-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Growing Community</h3>
                <p className="text-secondary-300">
                  Join thousands of users who are already making a difference.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default LandingPage 