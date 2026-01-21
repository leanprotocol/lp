'use client';

import { useState, useEffect } from 'react';

const navItems = [
  { id: 'basics', label: 'Basics' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'how-to-use', label: 'How to use it' },
];

export default function MedicationNav() {
  const [activeSection, setActiveSection] = useState('basics');

useEffect(() => {
    const handleScroll = () => {
      // Use a consistent offset (e.g. 150px from top of screen)
      const offset = 150; 

      for (let i = navItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(navItems[i].id);
        if (section) {
          const rect = section.getBoundingClientRect();
          
          if (rect.top <= offset) {
            setActiveSection(navItems[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="pt-20  sticky -top-40 z-40 bg-background transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-14 text-center">
        <h2 className="text-[48px] md:text-5xl font-serif text-black leading-tight mb-10 tracking-tight">
          Everything you need to know <br /> 
          about Mounjaro<sup>®</sup>
        </h2>

        {/* Navigation Links */}
        <nav className="border-b border-[#3D4F4A]/10">
          <div className="flex items-center justify-center gap-8 md:gap-10 py-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-sans text-base md:text-lg transition-all relative pb-2 tracking-tight ${
                  activeSection === item.id
                    ? 'text-[#3D4F4A] font-medium'
                    : 'text-[#3D4F4A]/60 hover:text-[#3D4F4A]'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#3D4F4A]" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}