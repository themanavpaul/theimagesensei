
import React from 'react';
import Header from '@/components/Header';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      <main className="container px-4 mx-auto mt-12">
        <section className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-light tracking-tight text-gradient mb-3">
            Welcome to ImageSensei
          </h2>
          <p className="text-white/70">
            Sign in to save your generated images and access your creation history.
          </p>
        </section>
        
        <AuthForm />
      </main>
    </div>
  );
};

export default Auth;
