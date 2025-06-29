import React from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Brain, Shield, Sparkles, ArrowRight, Calendar, Mic, BarChart3 } from 'lucide-react';
import Button from '../ui/Button';

interface WelcomePageProps {
  onGetStarted: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="flex items-center justify-center">
          <Heart className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Solace Journal</h1>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your AI-Powered
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {' '}Emotional Companion
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Express yourself through text and voice. Let our intelligent AI understand your emotions 
              and provide personalized, empathetic responses to support your mental wellness journey.
            </p>
            
            <div className="flex justify-center">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                icon={<ArrowRight size={20} />}
              >
                Start Your Journey
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Solace?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of digital journaling with AI that truly understands you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Multi-Modal Input</h4>
              <p className="text-gray-600">Express yourself through text or voice - whatever feels natural in the moment.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">AI Emotional Intelligence</h4>
              <p className="text-gray-600">Advanced AI analyzes your emotions and provides personalized, empathetic responses.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Mood Tracking</h4>
              <p className="text-gray-600">Visualize your emotional journey with beautiful charts and insights over time.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Privacy First</h4>
              <p className="text-gray-600">Your thoughts stay secure. All data is encrypted and protected with enterprise-grade security.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              More Amazing Features
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Birthday Celebrations</h4>
              <p className="text-gray-600">Special sparkle effects and personalized messages on your special day.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Monthly Rewinds</h4>
              <p className="text-gray-600">AI-generated monthly wellness reports with insights and growth tracking.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="h-6 w-6 text-pink-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Voice Journaling</h4>
              <p className="text-gray-600">Speak your thoughts naturally and let AI transcribe and analyze your emotions.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Begin Your Wellness Journey?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands who have found peace and clarity through AI-powered journaling.
            Your mental wellness matters, and we're here to support you every step of the way.
          </p>
          
          <div className="flex justify-center">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              icon={<Heart size={20} />}
            >
              Create Your Account
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Free to start • No credit card required • Privacy guaranteed
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-200 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Solace Journal. Your privacy is our priority.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;