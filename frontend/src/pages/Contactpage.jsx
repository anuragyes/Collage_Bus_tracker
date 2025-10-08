import { useState, useRef, useContext } from 'react';
import { AuthContext } from '../Context/authContext';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';

const Contactpage = () => {
  const { currentuser } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  // Send Email with loader
  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

     console.log("this is user " , currentuser)

    emailjs
      .sendForm(
        'service_ovlp5xz',   // Your Service ID
        'template_2ye20ma',  // Your Template ID
        formRef.current,
        'YTG-_BIikCdw40hai'  // Your Public Key
      )
      .then(
        (result) => {
          toast.success("Mail sent successfully! 🎉");
          console.log("SUCCESS!", result.text);

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

  const contactInfo = [
    { icon: "📍", title: "Visit Us", details: ["123 Campus Drive", "University Park", "College Town, CT 12345"] },
    { icon: "📞", title: "Call Us", details: ["+91 9301409957", "+91 865490001"] },
    { icon: "✉️", title: "Email Us", details: ["support@finderapp.com", "help@finderapp.com"] },
    { icon: "⏰", title: "Working Hours", details: ["Mon - Fri: 10:00 AM - 4:00 PM", "Sat - Sun: OFF"] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl">
          💬
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Get in <span className="text-blue-600">Touch</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions about Finder? We're here to help you track your campus buses better.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg">
              ✈️
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

            {/* <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting && currentuser ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Message ✈️</span>
              )}
            </button> */}

            <button
  type="submit"
  disabled={isSubmitting || !currentuser} // disable if submitting or no user
  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
>
  {isSubmitting && currentuser ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>Sending...</span>
    </>
  ) : !currentuser ? (
    <span>Please login to send a message ✉️</span>
  ) : (
    <span>Send Message ✈️</span>
  )}
</button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Contactpage;
