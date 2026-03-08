import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <motion.section className="section-padding bg-gradient-to-br from-primary-50 to-saffron-50">
        <div className="container-max">
          <motion.h1
            className="text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            About Moksh Sanskar Foundation
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 leading-relaxed max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Moksh Sanskar Foundation is dedicated to providing compassionate support and assistance
            to families during their time of grief. We believe in dignity, respect, and the importance
            of proper funeral arrangements during this emotional period.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        className="section-padding bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container-max">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Compassion',
                description:
                  'We approach every family with empathy and understanding during their most difficult moments.',
              },
              {
                title: 'Dignity',
                description:
                  'We ensure that all funeral arrangements are conducted with respect and honor to the deceased.',
              },
              {
                title: 'Accessibility',
                description:
                  'We provide free assistance to all families regardless of their financial circumstances.',
              },
              {
                title: 'Community',
                description:
                  'We believe in the power of community support to help families heal and move forward.',
              },
              {
                title: 'Excellence',
                description:
                  'We strive to provide the highest quality service and support in all our endeavors.',
              },
              {
                title: 'Transparency',
                description:
                  'We operate with honesty and openness in all our dealings with families and partners.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="section-padding bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container-max max-w-3xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Our History</h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              Moksh Sanskar Foundation was established with the mission to serve families in their
              time of need. Recognizing the challenges and expenses associated with funeral
              arrangements, we set out to provide comprehensive support.
            </p>
            <p>
              Over the years, we have evolved to offer not just financial assistance but also
              emotional support, practical guidance, and community resources. Our team of dedicated
              volunteers and staff work tirelessly to ensure that every family receives the care and
              attention they deserve.
            </p>
            <p>
              Today, we continue to expand our services and reach more families across the region.
              Our commitment to compassion, dignity, and excellence remains at the heart of
              everything we do.
            </p>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
