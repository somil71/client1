import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function PublicServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Public Services Collaboration
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-primary-100 max-w-3xl mx-auto"
            >
              Working hand in hand with hospitals, mortuaries, and civic authorities to ensure seamless and dignified final rites for all citizens.
            </motion.p>
          </div>
        </section>

        {/* Integration Points */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Hospital Integrations</h2>
                <p className="text-lg text-gray-600 mb-6">
                  We partner with major hospitals to provide immediate assistance to families. Our coordinators are connected with hospital administration and social workers to step in when needed.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-saffron-500 shrink-0"></div>
                    <span className="text-gray-700">Dedicated help desk within partner hospitals.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-saffron-500 shrink-0"></div>
                    <span className="text-gray-700">Rapid response team for mortuary coordination.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-saffron-500 shrink-0"></div>
                    <span className="text-gray-700">Ambulance and hearse van assistance.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center p-8 border-4 border-white shadow-xl">
                <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center flex-row-reverse">
              <div className="order-2 md:order-1 bg-saffron-50 rounded-2xl h-80 flex items-center justify-center p-8 border-4 border-white shadow-xl">
                <svg className="w-32 h-32 text-saffron-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Civic Body Support</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Collaboration with municipal corporations and to maintain dignified conditions at public cremation grounds and support unclaimed body rites.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-saffron-500 shrink-0"></div>
                    <span className="text-gray-700">Upgrading basic facilities at cremation grounds.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-saffron-500 shrink-0"></div>
                    <span className="text-gray-700">Digital documentation and death certificate support.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-saffron-500 shrink-0"></div>
                    <span className="text-gray-700">Performing rites for unclaimed bodies with adherence to religious protocols.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-saffron-500 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Are you a public service official?</h2>
            <p className="text-xl mb-8 mix-blend-overlay">Contact our administrative office to discuss formal alignment and SLAs.</p>
            <a href="mailto:admin@moksh.org" className="btn bg-white text-saffron-600 hover:bg-gray-50 text-lg px-8 py-3">
              Contact Administration
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
