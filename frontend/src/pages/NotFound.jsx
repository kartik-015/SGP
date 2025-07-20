import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Sports Equipment Management System</title>
        <meta name="description" content="Page not found" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-white" />
            </div>
            
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <Link
              to="/"
              className="btn btn-primary btn-lg w-full"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
            
            <Link
              to="/equipment"
              className="btn btn-outline btn-lg w-full"
            >
              Browse Equipment
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 card"
          >
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Quick Links
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <Link
                  to="/login/student"
                  className="text-primary-600 hover:text-primary-700 block"
                >
                  Student Login
                </Link>
                <Link
                  to="/login/admin"
                  className="text-primary-600 hover:text-primary-700 block"
                >
                  Admin Login
                </Link>
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-700 block"
                >
                  Student Registration
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound; 