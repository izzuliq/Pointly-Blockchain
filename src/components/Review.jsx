import React, { useState, useEffect } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'; // Importing icons

function ReviewsCarousel() {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      name: "Haikal Saifullah",
      role: "Regular User",
      review: "Pointly has completely revolutionized the way I manage my rewards. Before I used to keep track of my loyalty points manually across different apps, but now with Pointly, I can easily see and manage all my rewards in one place. The convenience is unmatched, and I highly recommend this app to anyone looking to make the most of their loyalty rewards.",
      image: "./Haikal.png",
    },
    {
      name: "Sarimah Jalil",
      role: "Frequent Shopper",
      review: "As someone who shops frequently, managing rewards used to be a hassle. Pointly has completely transformed my experience. Not only can I easily track all my rewards, but I can also redeem them seamlessly. It's been a game-changer, saving me time and helping me take full advantage of the rewards I earn. Pointly is a must-have app for anyone serious about maximizing their rewards.",
      image: "./Sarimah.png",
    },
    {
      name: "Alex Chin Wei Mei",
      role: "Occasional User",
      review: "I was initially skeptical about using Pointly, but it quickly proved to be invaluable. The app allows me to track rewards from various brands I use, and the redemption process is incredibly simple. I've already redeemed several discounts through the app, and it has saved me a significant amount. I now recommend Pointly to all my friends and family for its ease of use and effectiveness.",
      image: "./Alex.png",
    },
  ];

  // Automatic review change every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prevReview) => (prevReview + 1) % reviews.length);
    }, 5000); // 3000ms = 3 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [reviews.length]);

  const nextReview = () => {
    setCurrentReview((prevReview) => (prevReview + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview(
      (prevReview) => (prevReview - 1 + reviews.length) % reviews.length
    );
  };

  return (
    <div className="mt-12 w-full max-w-[800px] mx-auto text-center">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-center">
        {/* Review Image */}
        <img
            src={reviews[currentReview].image}
            alt={reviews[currentReview].name}
            className="w-[15vw] h-[15vw] max-w-[200px] max-h-[200px] rounded-full mx-auto mb-4"
        />
        </div>

        {/* Review Content */}
        <p className="text-xl text-gray-800 italic">"{reviews[currentReview].review}"</p>
        <h4 className="mt-4 text-2xl font-semibold text-purple">{reviews[currentReview].name}</h4>
        <p className="text-gray-600">{reviews[currentReview].role}</p>
      </div>
      
      {/* Button Section */}
      <div className="flex justify-between mt-6 items-center">
        {/* Prev Button */}
        <button
          onClick={prevReview}
          className="px-6 py-3 bg-purple text-white rounded-full hover:bg-purple-dark transition-colors"
        >
          <HiChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextReview}
          className="px-6 py-3 bg-purple text-white rounded-full hover:bg-purple-dark transition-colors"
        >
          <HiChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default ReviewsCarousel;
