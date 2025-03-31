
import React from 'react';
import SignupForm from '@/components/auth/SignupForm';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks';

const Signup: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Create an account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <a href="/login" className="font-medium text-primary hover:text-primary/80">
              sign in to your existing account
            </a>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
