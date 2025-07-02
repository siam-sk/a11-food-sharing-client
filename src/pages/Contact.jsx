import React from "react";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Contact = () => (
  <div className="bg-base-200 py-16 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto">
      
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <EnvelopeIcon className="h-20 w-20 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-base-content drop-shadow">
          Get In <span className="text-primary">Touch</span>
        </h1>
        <p className="mt-4 text-lg text-base-content/80 max-w-2xl mx-auto">
          Have questions or want to get involved? We'd love to hear from you!
        </p>
      </motion.div>

      
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <motion.div
          className="text-center p-8 bg-base-100 rounded-xl shadow-lg"
          whileHover={{ y: -5 }}
        >
          <MapPinIcon className="h-12 w-12 text-secondary mx-auto mb-4" />
          <h3 className="font-bold text-xl text-base-content mb-2">Our Location</h3>
          <p className="text-base-content/80 mb-3">123 Community Lane, Food City, FS 12345</p>
          <a href="#" className="font-semibold text-primary hover:underline">
            View on Map
          </a>
        </motion.div>
        <motion.div
          className="text-center p-8 bg-base-100 rounded-xl shadow-lg"
          whileHover={{ y: -5 }}
        >
          <PhoneIcon className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="font-bold text-xl text-base-content mb-2">Call Us</h3>
          <p className="text-base-content/80 mb-3">(123) 456-7890</p>
          <a href="tel:1234567890" className="font-semibold text-primary hover:underline">
            Give us a call
          </a>
        </motion.div>
        <motion.div
          className="text-center p-8 bg-base-100 rounded-xl shadow-lg"
          whileHover={{ y: -5 }}
        >
          <EnvelopeIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-xl text-base-content mb-2">Email Us</h3>
          <p className="text-base-content/80 mb-3">contact@sharedspoon.com</p>
          <a href="mailto:contact@sharedspoon.com" className="font-semibold text-primary hover:underline">
            Send an email
          </a>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          className="bg-base-100 p-8 rounded-xl shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-base-content mb-6">Send a Direct Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="textarea textarea-bordered w-full resize-none"
            />
            <button
              type="submit"
              className="btn btn-primary w-full"
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