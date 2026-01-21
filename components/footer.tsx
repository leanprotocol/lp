'use client';

import Link from 'next/link';
import { Instagram, Twitter, Facebook, ArrowRight, Mail } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface LinkItem {
  name: string;
  path: string;
}

interface Links {
  medications: LinkItem[];
  tools: LinkItem[];
  legal: LinkItem[];
}

function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const links: Links = {
    medications: [
      { name: 'Rybelsus', path: '/medications/rybelsus' },
      { name: 'Ozempic', path: '/medications/ozempic' },
      { name: 'Wegovy', path: '/medications/wegovy' },
      { name: 'Saxenda', path: '/medications/saxenda' },
      { name: 'Mounjaro', path: '/medications/mounjaro' },
      { name: 'Zepbound', path: '/medications/zepbound' },
      { name: 'Victoza', path: '/medications/victoza' },
    ],
    tools: [
      { name: 'BMI Calculator', path: '/bmi-calculator' },
      { name: 'BMR Calculator', path: '/bmr-calculator' },
      { name: 'Waist to Hip Calculator', path: '/waist-to-hip-calculator' },
    ],
    legal: [
      { name: 'Terms & Condition', path: '/terms-conditions' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Guaranteed Refund Policy', path: '/refund-policy' },
    ]
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'Successfully subscribed!' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-black text-accent2 pt-14 pb-8 px-4 md:px-14 border-t border-acc2text-accent2/10">
      <div className="max-w-344 mx-auto">
        
        {/* TOP SECTION: Newsletter & Brand */}
        <div className="grid lg:grid-cols-2 gap-12 mb-10">
          
          {/* Brand & Slogan */}
          <div className="space-y-5">
            {/* <Link href="/" className="font-serif text-4xl tracking-tight text-accent block">
              Lean Healthtech<span className="opacity-50">.</span>
            </Link> */}
            <Link href="/" className="inline-block mb-6">
  <Image
    src="/logo-cropped.png" 
    alt="Lean Healthtech" 
    width={140}   
    height={50} 
    className="object-contain" 
  />
</Link>
            <p className="inter text-accent2/60 text-lg max-w-md font-light leading-relaxed">
              Modern weight loss medication, prescribed online and delivered to your door. Science-backed paths to a healthier you.
            </p>
            
            {/* Socials */}
            <div className="flex gap-4 pt-2">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-accent2 text-accent2 flex items-center justify-center hover:bg-acc2text-accent2 hover:text-dark transition-all duration-300 group">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Input */}
          <div className="lg:pl-12">
            <h3 className="forum text-2xl mb-4">Stay updated with health tips</h3>
            <form onSubmit={handleSubscribe} className="relative max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-white/5 border border-accent2/40 rounded-2xl py-4 pl-6 pr-14 text-accent placeholder:text-accent2/30 focus:outline-none focus:border-accent2/30 transition-colors font-light inter disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 w-12 bg-white/10 text-accent2 rounded-xl flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            {message && (
              <p className={`inter text-xs mt-3 ${
                message.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {message.text}
              </p>
            )}
            <p className="inter text-xs text-accent2/40 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>

        {/* MIDDLE SECTION: Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 border-t border-accent2/20 pt-12 mb-14">
          
          {/* Column 1: Medications */}
          <div>
            <h4 className="inter text-sm font-semibold uppercase tracking-widest text-accent2/40 mb-6">Medications</h4>
            <ul className="space-y-4">
              {links.medications.map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="inter text-accent2/80 hover:text-white hover:translate-x-1 inline-block transition-all duration-300 font-light">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Tools */}
          <div>
            <h4 className="inter text-sm font-semibold uppercase tracking-widest text-accent2/40 mb-6">Tools</h4>
            <ul className="space-y-4">
              {links.tools.map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="inter text-accent2/80 hover:text-white hover:translate-x-1 inline-block transition-all duration-300 font-light">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="inter text-sm font-semibold uppercase tracking-widest text-accent2/40 mb-6">Legal</h4>
            <ul className="space-y-4">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="inter text-accent2/80 hover:text-white hover:translate-x-1 inline-block transition-all duration-300 font-light">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="inter text-sm font-semibold uppercase tracking-widest text-accent2/40 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 inter text-accent2/80 font-light">
                <Mail className="w-5 h-5 shrink-0 text-accent2/50" />
                <span>support@leanprotocol.in</span>
              </li>
              <li className="inter text-accent2/80 font-light pt-2">
                1-800-555-0123
                <br />
                <span className="text-xs text-accent2/50">Mon-Fri, 9am - 6pm EST</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM SECTION: Disclaimer & Copyright */}
        <div className="border-t border-accent2/20 pt-8">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="inter text-sm text-accent2/60">
              © {new Date().getFullYear()} Lean Protocol Pvt Ltd
. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;