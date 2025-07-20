import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { 
  Smartphone, 
  Lock, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  User,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const getInitialStep = () => {
  return sessionStorage.getItem('studentLoginStep') || 'phone';
};

const StudentLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resendOTP, sendStudentLoginOTP } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [step, setStepState] = useState(getInitialStep()); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [studentId, setStudentId] = useState('');

  // Debug: log the current step
  console.log('Current step:', step);

  // Helper to update step and persist in sessionStorage
  const setStep = (newStep) => {
    setStepState(newStep);
    sessionStorage.setItem('studentLoginStep', newStep);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm();

  const onSubmitPhone = async (data) => {
    setIsSubmitting(true);
    try {
      await sendStudentLoginOTP(data.studentId, data.phoneNumber);
      setPhoneNumber(data.phoneNumber);
      setStudentId(data.studentId);
      sessionStorage.setItem('studentLoginId', data.studentId);
      sessionStorage.setItem('studentLoginPhone', data.phoneNumber);
      setStep('otp');
      setValue('otp', '');
    } catch (error) {
      console.error('Phone verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitOTP = async (data) => {
    setIsSubmitting(true);
    try {
      // Always get studentId and phoneNumber from sessionStorage if not in state
      const id = studentId || sessionStorage.getItem('studentLoginId') || '';
      const phone = phoneNumber || sessionStorage.getItem('studentLoginPhone') || '';
      await login({
        studentId: id,
        phoneNumber: phone,
        otp: data.otp
      }, 'student');
      // Redirect to equipment catalog after successful login
      navigate('/equipment-catalog');
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResendingOTP(true);
    try {
      await resendOTP(studentId, phoneNumber);
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setIsResendingOTP(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setPhoneNumber('');
    setStudentId('');
  };

  return (
    <>
      <Helmet>
        <title>Student Login - Sports Equipment Management System</title>
        <meta name="description" content="Login to access sports equipment borrowing system" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Student Login
            </h1>
            <p className="text-gray-600">
              {step === 'phone' 
                ? 'Enter your details to receive OTP'
                : 'Enter the OTP sent to your registered phone number'
              }
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            {step === 'phone' ? (
              <form onSubmit={e => { e.preventDefault(); handleSubmit(onSubmitPhone)(e); }} className="p-6 space-y-6">
                {/* Phone Number Step */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    {...register('studentId', { 
                      required: 'Student ID is required',
                      minLength: { value: 3, message: 'Student ID must be at least 3 characters' }
                    })}
                    className="input"
                    placeholder="Enter your student ID"
                  />
                  {errors.studentId && (
                    <p className="text-error-600 text-sm mt-1">{errors.studentId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phoneNumber', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[\+]?[1-9][\d]{0,15}$/,
                        message: 'Invalid phone number'
                      }
                    })}
                    className="input"
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && (
                    <p className="text-error-600 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-5 h-5 mr-2" />
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            ) : (
              // OTP Step (separate page/step, not the same form)
              <form onSubmit={e => { e.preventDefault(); handleSubmit(onSubmitOTP)(e); }} className="p-6 space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    OTP Sent Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Enter the OTP sent to your registered phone number.<br />
                    <span className="text-xs text-primary-600">(Check your backend terminal for the OTP - for testing only)</span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP *
                  </label>
                  <input
                    type="text"
                    {...register('otp', { 
                      required: 'OTP is required',
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'OTP must be 6 digits'
                      }
                    })}
                    className="input text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                  {errors.otp && (
                    <p className="text-error-600 text-sm mt-1">{errors.otp.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Verify
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Registration Link and Info Box remain unchanged */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Register here
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 card"
          >
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Login Information
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use your registered student ID and phone number</li>
                <li>• OTP will be sent to your registered phone number</li>
                <li>• OTP expires in 5 minutes</li>
                <li>• Contact admin if you face any issues</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default StudentLogin; 