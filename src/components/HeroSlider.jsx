import React from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HeroSlider.css'; 

const sliderContent = [
  {
    bgImage: "url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
    title: "Reduce Waste, Share a Meal",
    description: "Join our community to connect surplus food with those who need it most. Every meal shared makes a difference.",
    buttonText: "See Available Foods",
    buttonLink: "/available-foods"
  },
  {
    bgImage: "url('https://images.pexels.com/photos/6995201/pexels-photo-6995201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
    title: "Have Extra Food to Share?",
    description: "Become a donor today. It's easy to list your surplus food and help fight hunger in your neighborhood.",
    buttonText: "Add Food Now",
    buttonLink: "/add-food"
  },
  {
    bgImage: "url('https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
    title: "Find Your Next Meal",
    description: "Browse a variety of fresh, free food shared by generous people in your community.",
    buttonText: "Get Started",
    buttonLink: "/available-foods"
  }
];

const HeroSlider = () => {
  return (
    <section className="my-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="h-[60vh] w-full rounded-lg shadow-lg"
      >
        {sliderContent.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="hero h-full bg-cover bg-center"
              style={{ backgroundImage: slide.bgImage }}
            >
              <div className="hero-overlay bg-opacity-60"></div>
              <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                  <motion.h1
                    className="mb-5 text-4xl md:text-5xl font-bold"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    className="mb-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {slide.description}
                  </motion.p>
                  <Link to={slide.buttonLink} className="btn btn-primary">
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;