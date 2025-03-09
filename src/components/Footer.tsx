
import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-6 glass-morphism mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-white/70 text-sm">
          Created by Manav Paul
        </div>
        
        <div className="text-white/70 text-sm">
          &copy;2025 ImageSensei
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-white/10 hover:bg-white/20"
            asChild
          >
            <a 
              href="https://github.com/themanavpaul" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-white/10 hover:bg-white/20"
            asChild
          >
            <a 
              href="https://www.linkedin.com/in/manav-paul/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
