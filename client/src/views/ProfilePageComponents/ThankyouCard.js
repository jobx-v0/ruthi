"use client"

import { motion } from "framer-motion"
import { FaCheckCircle } from "react-icons/fa"

export default function ThankyouCard() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6"
        >
          <FaCheckCircle className="w-full h-full text-orange-500" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
        
        <p className="text-gray-600 mb-6">
          We've successfully created your profile. We're excited to help you find the perfect job opportunities that match your skills and aspirations.
        </p>
        
        <p className="text-gray-600">
          We'll be in touch soon with curated job matches and personalized career advice. Keep an eye on your inbox for updates!
        </p>
      </motion.div>
    </div>
  )
}