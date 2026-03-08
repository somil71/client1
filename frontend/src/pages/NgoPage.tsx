import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NgoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-saffron-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Partner With Us
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
            >
              We collaborate with NGOs across India to extend our reach and impact. Together, we can ensure every family receives the support they need during difficult times.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/contact" className="btn btn-primary text-lg px-8 py-4">
                Become a Partner
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Partner With Moksh Sanskar?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600 font-bold text-xl">1</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Expanded Impact</h3>
                      <p className="text-gray-600">Combine resources to help more families in your local community.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600 font-bold text-xl">2</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Resource Sharing</h3>
                      <p className="text-gray-600">Access our standardized Antim Sanskar kits and network of trusted Pandits.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600 font-bold text-xl">3</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Capacity Building</h3>
                      <p className="text-gray-600">Receive training and operational support for managing funeral assistance programs.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Partnership Criteria</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-700">Registered NGO under Section 8, Trust, or Society Act</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-700">Active FCRA and 80G/12A registrations (preferred)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-700">Minimum 3 years of operational history in social work</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-700">Demonstrated commitment to transparency and dignity</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
