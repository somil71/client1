import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestsAPI } from '../services/api';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    completedRequests: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await requestsAPI.getStatistics();
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };

    fetchStats();
  }, []);


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-saffron-50 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container-max text-center py-32">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            variants={itemVariants}
          >
            Compassionate Support When You Need It Most
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Moksh Sanskar Foundation provides dignified assistance and support for families during funeral arrangements.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <a
              href="/request-help"
              className="btn btn-primary text-lg sm:text-base"
            >
              Request Help
            </a>
            <a
              href="/track-request"
              className="btn btn-outline text-lg sm:text-base"
            >
              Track Request
            </a>
            <a href="#contact" className="btn btn-outline text-lg sm:text-base">
              Contact Us
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="section-padding bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container-max">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              Our Mission
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 leading-relaxed"
              variants={itemVariants}
            >
              At Moksh Sanskar Foundation, we believe that every family deserves compassionate support during their time of grief. We provide free, dignified assistance with funeral arrangements, spiritual guidance, and community support to ensure families can focus on honoring their loved ones.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Initiatives Section */}
      <InitiativesSection />

      {/* How We Help Section */}
      <HowWeHelpSection />

      {/* Impact Section */}
      <ImpactSection stats={stats} />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Donation CTA Section */}
      <DonationSection />

      {/* Emergency Support Banner */}
      <EmergencyBanner />

      {/* Contact Section */}
      <ContactSection />

      <Footer />
    </div>
  );
}

function InitiativesSection() {
  const initiatives = [
    {
      title: 'Free Antim Sanskar Kits',
      description: 'Complete kits with essential items for funeral arrangements provided at no cost.',
      icon: '🙏',
    },
    {
      title: 'Pandit Assistance',
      description: 'Connect with experienced pandits for proper rituals and ceremonies.',
      icon: '📿',
    },
    {
      title: 'Eco-Friendly Cremation',
      description: 'Support for environmentally conscious cremation processes.',
      icon: '🌿',
    },
    {
      title: 'Community Support',
      description: 'Emotional support and guidance from our trained counselors.',
      icon: '🤝',
    },
  ];

  return (
    <motion.section
      className="section-padding bg-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container-max">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Initiatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {initiatives.map((initiative, index) => (
            <motion.div
              key={index}
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-4xl mb-4">{initiative.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{initiative.title}</h3>
              <p className="text-gray-600">{initiative.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function HowWeHelpSection() {
  const steps = [
    { number: 1, title: 'Submit Request', description: 'Fill out our simple form with your details and requirements' },
    { number: 2, title: 'Review & Approval', description: 'Our team reviews your request within 24 hours' },
    { number: 3, title: 'Assistance Delivered', description: 'Receive support and guidance from our volunteers' },
  ];

  return (
    <motion.section
      className="section-padding bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container-max">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How We Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {steps.map((step) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.number * 0.2 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-saffron-500 text-white flex items-center justify-center rounded-full text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {step.number < 3 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-saffron-200" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ImpactSection({ stats }: any) {
  const Counter = ({ end, label }: { end: number; label: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const timer = setInterval(() => {
        start += end / 50;
        if (start > end) start = end;
        setCount(Math.floor(start));
        if (start >= end) clearInterval(timer);
      }, 50);

      return () => clearInterval(timer);
    }, [end]);

    return (
      <div className="text-center">
        <div className="text-5xl font-bold text-saffron-600 mb-2">{count.toLocaleString()}+</div>
        <p className="text-gray-600">{label}</p>
      </div>
    );
  };

  return (
    <motion.section
      className="section-padding bg-gradient-to-r from-saffron-50 to-orange-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container-max">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Counter end={stats.totalRequests} label="Families Helped" />
          <Counter end={stats.approvedRequests} label="Kits Distributed" />
          <Counter end={stats.completedRequests} label="Support Delivered" />
        </div>
      </div>
    </motion.section>
  );
}

function TestimonialSection() {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      text: 'Moksh Sanskar Foundation provided invaluable support during our difficult time. Their assistance and compassion made a real difference.',
    },
    {
      name: 'Priya Sharma',
      text: 'The team was so understanding and helpful. They handled everything with dignity and respect. Highly grateful.',
    },
    {
      name: 'Amit Patel',
      text: 'From the first contact to the completion, the entire process was smooth and caring. Thank you for your service.',
    },
  ];

  return (
    <motion.section
      className="section-padding bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container-max">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">What Families Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold text-gray-900">- {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function DonationSection() {
  return (
    <motion.section
      className="section-padding bg-gradient-to-r from-primary-100 to-saffron-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container-max text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Support Our Cause</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Your contribution helps us provide free assistance to families in need. Every donation makes a difference.
        </p>
        <a href="/contact" className="btn btn-primary text-lg inline-block mt-4">Donate Now</a>
      </div>
    </motion.section>
  );
}

function EmergencyBanner() {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
      <div className="container-max">
        <h3 className="text-lg font-bold text-red-900 mb-2">🚨 Emergency Support Available</h3>
        <p className="text-red-700">
          Our support team is available 24/7. Call us immediately for urgent assistance.
        </p>
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <motion.section
      id="contact"
      className="section-padding bg-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container-max">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Get In Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-4">📞</div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600">+91 (800) 123-4567</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-4">✉️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">contact@moksh.org</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-4">📍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600">Moksh Sanskar Foundation, New Delhi, India</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
