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
                <a href="mailto:support@leanprotocol.in" className="hover:text-accent2 transition-colors">
                  support@leanprotocol.in
                </a>
              </li>
              <li className="inter text-accent2/80 font-light pt-2">
                9650491267
                <br />
                <span className="text-xs text-accent2/50">Mon-Fri, 9am - 6pm EST</span>
              </li>
              <li className="pt-2">
                <a
                  href="https://wa.link/3s1upf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-medium rounded-full px-4 py-2 transition-colors duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.857L.054 23.077a.75.75 0 0 0 .918.932l5.375-1.51A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.695 9.695 0 0 1-4.99-1.383l-.358-.214-3.712 1.043 1.002-3.63-.234-.374A9.696 9.696 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
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