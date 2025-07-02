import React from "react";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Contact = () => (
  <div className="bg-gradient-to-br from-sky-50 via-white to-blue-100 py-16 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto">
      
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <EnvelopeIcon className="h-20 w-20 mx-auto mb-4 text-sky-500" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-800 drop-shadow">
          Get In <span className="text-blue-600">Touch</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          We&apos;re here to help and answer any question you might have. We look forward to hearing from you!
        </p>
      </motion.div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
        <motion.div
          className="text-center p-8 bg-white rounded-xl shadow-lg"
          whileHover={{ y: -5 }}
        >
          <EnvelopeIcon className="h-12 w-12 text-sky-500 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-gray-800 mb-2">Email Us</h3>
          <p className="text-gray-600 mb-3">Our team is here to help with any questions.</p>
          <a href="mailto:support@sharedspoon.com" className="font-semibold text-sky-600 hover:underline">
            support@sharedspoon.com
          </a>
        </motion.div>
        <motion.div
          className="text-center p-8 bg-white rounded-xl shadow-lg"
          whileHover={{ y: -5 }}
        >
          <MapPinIcon className="h-12 w-12 text-pink-500 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-gray-800 mb-2">Our Location</h3>
          <p className="text-gray-600 mb-3">123 Community Lane, Food City, FS 12345</p>
          <a href="#" className="font-semibold text-sky-600 hover:underline">
            View on Map
          </a>
        </motion.div>
        <motion.div
          className="text-center p-8 bg-white rounded-xl shadow-lg"
          whileHover={{ y: -5 }}
        >
          <PhoneIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-gray-800 mb-2">Call Us</h3>
          <p className="text-gray-600 mb-3">Mon-Fri from 8am to 5pm.</p>
          <a href="tel:+123456789" className="font-semibold text-sky-600 hover:underline">
            +1 (23) 456-7890
          </a>
        </motion.div>
      </div>

      
      <div className="grid md:grid-cols-2 gap-12 items-start bg-white p-8 rounded-2xl shadow-xl mb-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Send a Message</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-300 outline-none transition"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-300 outline-none transition"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-300 outline-none transition resize-none"
            />
            <button
              type="submit"
              className="mt-2 px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold shadow hover:bg-sky-700 transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>
        <motion.div
          className="h-96 w-full rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019539579721!2d144.9537353153169!3d-37.81720997975179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1620312922839!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Google Maps Location"
          ></iframe>
        </motion.div>
      </div>
    </div>
  </div>
);

export default Contact;