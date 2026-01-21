"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import OTPModal from "./get-started/otp-modal";

export default function InsuranceCoverage() {
  const [selectedProvider, setSelectedProvider] = useState<{ id: string; name: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProviders() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/insurance-providers");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load providers");
        }

        const mapped = (data.providers ?? []).map((provider: any) => ({
          id: provider.id,
          name: provider.name,
        }));
        setProviders(mapped);
      } catch (err: any) {
        setError(err.message || "Unable to fetch providers");
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  const filteredProviders = useMemo(
    () =>
      providers.filter((provider) =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [providers, searchQuery]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="py-12 md:py-18 text-[#191919] bg-accent-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-5xl mx-auto"
        >
          <h2 className="forum text-4xl md:text-5xl font-serif leading-tight">
            Got Coverage? Check If your Insurance <span className="italic text-[#2D3319] opacity-70">covers your treatment!</span> 
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto bg-[#B8CCC5] rounded-[2.5rem] p-4 md:p-5 border border-[#2D3319]/5 relative">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            
            <div className="relative h-[300px] md:h-[450px] w-full rounded-[2rem] overflow-hidden ">
               <img 
                 src="/india-map.png" 
                 alt="Insurance Coverage"
                 className="w-full h-full object-cover"
               />
               
               <div className="absolute inset-0 bg-[#2D3319]/0 " />
            </div>

            <div className="space-y-6 md:p-4 relative z-20">
              <div>
                <label className="block font-sans text-[#191919] tracking-wide font-medium mb-4 text-xs text-center uppercase">
                  Select your Insurance Provider
                </label>
                
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                      w-full bg-white/90 border border-[#2D3319]/20 py-3 px-6 rounded-2xl flex items-center justify-between text-[#191919] 
                      transition-all duration-300 shadow-sm cursor-pointer
                      ${isOpen ? 'ring-2 ring-[#2D3319]/20 border-[#2D3319]' : ''}
                    `}
                  >
                    <span className={`font-sans text-base truncate pr-4 ${selectedProvider ? 'text-[#191919] font-medium' : 'text-[#191919]/50'}`}>
                      {selectedProvider?.name || "Search provider..."}
                    </span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 text-[#191919]/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#2D3319]/10 rounded-2xl overflow-hidden z-50"
                      >
                        <div className="p-2.5 border-b border-[#2D3319]/5 sticky top-0 bg-white z-10">
                          <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#191919]/40" />
                              <input 
                                  type="text"
                                  className="w-full pl-9 pr-4 py-2.5 bg-[#F5F7F5] rounded-xl text-sm  placeholder:text-[#191919]/40 text-[#191919]"
                                  placeholder="Type to search..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  autoFocus
                              />
                          </div>
                        </div>

                        <div className="max-h-48 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-[#2D3319]/20">
                          {filteredProviders.length > 0 ? (
                              filteredProviders.map((provider) => (
                              <button
                                  key={provider.id}
                                  onClick={() => {
                                    setSelectedProvider(provider);
                                    setIsOpen(false);
                                    setSearchQuery("");
                                  }}
                                  className={`w-full text-left px-4 py-3 rounded-xl font-sans text-sm transition-colors duration-200 ${
                                  selectedProvider?.id === provider.id 
                                      ? 'bg-[#2D3319] text-white font-medium' 
                                      : 'text-[#191919] hover:bg-[#F5F7F5]'
                                  }`}
                              >
                                  {provider.name}
                              </button>
                              ))
                          ) : (
                              <div className="px-4 py-3 text-sm text-[#191919]/40 text-center">
                                  No providers found
                              </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3 pt-2">
                {error && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-full px-4 py-1">
                    {error}
                  </p>
                )}
                <Button 
                  onClick={() => setShowOTPModal(true)}
                  className={`bg-[#2D3319] hover:bg-[#1a1f0f] text-white rounded-full w-48 px-8 h-12 cursor-pointer duration-300 ${(!selectedProvider || loading) && 'opacity-50 cursor-not-allowed'}`}
                  disabled={!selectedProvider || loading}
                >
                  {loading ? "Loading..." : "Check Your Eligibility"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <h3 className="font-serif text-2xl md:text-3xl text-[#191919] mb-3 font-normal">
            No coverage? No problem
          </h3>
          <p className="sub-heading text-[#191919]/70">
            We’ve got affordable options for every journey
          </p>
          <Link
            href="/pricing"
            className="inline-flex mt-2 text-sm items-center justify-center gap-2 text-[#2D3319] hover:text-[#2D3319]/70 transition-colors duration-300 font-sans border-b border-[#2D3319]/20 pb-0.5 hover:border-[#2D3319]"
          >
            Explore our pricing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        selectedProvider={selectedProvider}
        onNext={() => {
          setShowOTPModal(false);
          if (!selectedProvider) {
            router.push("/quiz");
            return;
          }
          const params = new URLSearchParams();
          params.set("insuranceProviderId", selectedProvider.id);
          params.set("insuranceProviderName", selectedProvider.name);
          router.push(`/quiz?${params.toString()}`);
        }}
      />
    </section>
  );
}