
import React from 'react';
import { Sparkles, Github, Linkedin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/UserMenu';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="w-full py-6 px-6 glass-morphism sticky top-0 z-50 mb-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-medium tracking-tight text-gradient-purple">ImageSensei</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 text-xs rounded-full glass-morphism hero-glow">
            <span className="animate-pulse-subtle text-purple-300">AI-Powered Image Generation</span>
          </div>
          
          {user && (
            <UserMenu />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
