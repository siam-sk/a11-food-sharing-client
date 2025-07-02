import React from "react";
import { UsersIcon, HeartIcon, GlobeAltIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";


const TeamMember = ({ name, role, imageUrl }) => (
  <motion.div
    className="text-center text-base-content"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <img
      className="mx-auto h-24 w-24 rounded-full object-cover shadow-lg border-4 border-base-100"
      src={imageUrl}
      alt={name}
    />
    <h3 className="mt-4 text-lg font-semibold">{name}</h3>
    <p className="text-sm text-primary">{role}</p>
  </motion.div>
);

const About = () => (
  <div className="bg-base-200 py-16 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto">
      
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="/logo.png"
          alt="SharedSpoon Logo"
          className="h-20 w-20 mx-auto mb-4 rounded-full shadow-lg border-2 border-primary"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-base-content drop-shadow">
          We are <span className="text-primary">SharedSpoon</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto">
          A passionate community dedicated to fighting food waste and building a more sustainable future, one meal at a time.
        </p>
      </motion.div>

      
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-base-content mb-4">Our Mission</h2>
          <p className="text-base-content/80 mb-6">
            Our mission is simple: connect surplus food with those who need it most. We believe that no food should go to waste when there are people in our communities who face hunger. SharedSpoon is the bridge that makes this connection possible.
          </p>
          <h2 className="text-3xl font-bold text-base-content mb-4">Our Story</h2>
          <p className="text-base-content/80">
            SharedSpoon started as a small idea in a local community center. We saw perfectly good food being discarded while our neighbors struggled. We knew there had to be a better way. Today, we are a growing platform powered by technology and compassion, making a real impact every day.
          </p>
        </motion.div>
        <motion.div
          className="h-80 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <img
            src="https://images.pexels.com/photos/6995201/pexels-photo-6995201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Community food sharing"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      
      <div className="my-20">
        <h2 className="text-3xl font-bold text-center text-base-content mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-6 bg-base-100 rounded-xl shadow-lg">
            <UsersIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-xl text-base-content mb-2">Community First</h3>
            <p className="text-base-content/80">We empower local communities to support each other, fostering connection and reducing hunger together.</p>
          </div>
          <div className="text-center p-6 bg-base-100 rounded-xl shadow-lg">
            <HeartIcon className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="font-bold text-xl text-base-content mb-2">Act with Compassion</h3>
            <p className="text-base-content/80">Every action is driven by empathy and a genuine desire to help our neighbors and our planet.</p>
          </div>
          <div className="text-center p-6 bg-base-100 rounded-xl shadow-lg">
            <GlobeAltIcon className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-bold text-xl text-base-content mb-2">Drive Sustainability</h3>
            <p className="text-base-content/80">We are committed to creating a greener world by ensuring that good food nourishes people, not landfills.</p>
          </div>
        </div>
      </div>

      
      <div className="text-center bg-primary text-primary-content p-12 my-20 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Whether you have food to share or are in need of support, you can make a difference. Become a part of the SharedSpoon family today.
        </p>
        <a
          href="/available-foods"
          className="inline-block px-8 py-3 rounded-lg bg-white text-primary font-semibold shadow-md hover:bg-primary/90 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  </div>
);

export default About;