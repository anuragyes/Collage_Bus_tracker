import { useState, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../Context/authContext';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const ContactPage = () => {
  const { currentuser } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  // ✅ Send Email with loader
  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm(
        'service_ovlp5xz',   // 🔹 Replace with your Service ID
        'template_2ye20ma',  // 🔹 Replace with your Template ID
        formRef.current,
        'YTG-_BIikCdw40hai'  // 🔹 Your Public Key
      )
      .then(
        (result) => {
          toast.success("Mail sent successfully! 🎉");
          console.log("SUCCESS!", result.text);

          // Reset form
          if (formRef.current) formRef.current.reset();
        },
        (error) => {
          toast.error("Failed to send mail ❌");
          console.error("FAILED...", error.text);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Contact information
  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      details: ['123 Campus Drive', 'University Park', 'College Town, CT 12345'],
      delay: 0.1
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      details: ['+91 9301409957', '+91 865490001'],
      delay: 0.2
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      details: ['support@finderapp.com', 'help@finderapp.com'],
      delay: 0.3
    },
    {
      icon: ClockIcon,
      title: 'Working Hours',
      details: ['Mon - Fri: 10:00 AM - 4:00 PM', 'Sat - Sun: OFF'],
      delay: 0.4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center"
        >
          <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Get in <span className="text-blue-600">Touch</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions about Finder? We're here to help you track your campus buses better.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Contact Info */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start space-x-4 group cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                        <item.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <PaperAirplaneIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
            </div>

            <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type="text"
                    name="from_name"
                    required
                    defaultValue={currentuser?.username || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type="email"
                    name="from_email"
                    required
                    defaultValue={currentuser?.email || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className='text-red-400'>*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className='text-red-400'>*</span>
                </label>
                <textarea
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
