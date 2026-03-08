import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-saffron-50 py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" className="text-saffron-500" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Become a Volunteer
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
            >
              Join our network of compassionate volunteers dedicated to providing dignity and support to families during their most difficult times.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Link to="/contact" className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
                Apply to Volunteer
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How You Can Help</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">We offer various ways for you to contribute your time and skills.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm border p-8 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-saffron-100 rounded-xl flex items-center justify-center mb-6 text-saffron-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Field Coordinator</h3>
                <p className="text-gray-600">Assist families directly at the cremation ground, coordinate with pandits, and ensure all arrangements are in place.</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm border p-8 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-saffron-100 rounded-xl flex items-center justify-center mb-6 text-saffron-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Helpline Support</h3>
                <p className="text-gray-600">Help answer calls, coordinate requests, and provide emotional support to grieving families over the phone.</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm border p-8 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-saffron-100 rounded-xl flex items-center justify-center mb-6 text-saffron-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Resource Management</h3>
                <p className="text-gray-600">Help assemble Antim Sanskar Kits, manage inventory, and ensure supplies are always available for emergencies.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <svg className="w-12 h-12 text-saffron-300 mx-auto mb-6" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p className="text-2xl font-medium text-gray-900 italic mb-8">
              "Volunteering with Moksh Sanskar Foundation has been the most fulfilling experience of my life. Being able to provide a shoulder to lean on during someone's darkest hour is truly a privilege."
            </p>
            <div className="font-bold text-gray-900">Rahul Sharma</div>
            <div className="text-center text-gray-500">Volunteer since 2024</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
