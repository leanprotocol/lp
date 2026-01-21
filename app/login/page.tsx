"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Smartphone, AlertCircle, ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setMobileNumber(value);
      if (error) setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/quiz');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        
        {/* 1. Background Image Layer */}
        <div className="absolute inset-0 z-0">
           <img 
             src="/medications-hero.png" /* Replace with your image path */
             alt="Background" 
             className="w-full h-full object-cover opacity-80"
           />
        </div>

        {/* 2. Gradient Overlay Layer (Opacity applied here) */}
        <div className="absolute inset-0 z-0 bg-dark opacity-95" />

        {/* 4. Content Layer */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="max-w-xl">
            <h1 className="font-serif text-[3.5rem] leading-17 mb-8">
             <span className="text-[#d4e5c4]">Welcome back</span> to your health journey
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-md">
              Access your personalized GLP-1 treatment plan and continue your progress toward better health.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-12 justify-between max-w-md">
              <div className="text-">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-white/70 mt-1">Active Users</div>
              </div>
              <div className="text-">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm text-white/70 mt-1">Success Rate</div>
              </div>
              <div className="text-">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/70 mt-1">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#FAFAF9]">
        <div className="w-full max-w-md space-y-12">
          <div className="text-center">
            <h2 className="font-serif text-4xl text-dark mb-3">Log In</h2>
            <p className="text-base text-[#6B7280]">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mobile Number Input */}
            <div className="space-y-2">
              <label htmlFor="mobile" className="text-sm font-medium text-dark">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5B746F]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <Input
                  id="mobile"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="Enter 10-digit mobile number"
                  inputMode="numeric"
                  className="h-12 pl-12 rounded-xl border-dark/10 bg-white/80 text-base placeholder:text-[#6B7280]/60 text-dark transition-all focus:bg-white focus-visible:ring-1 focus-visible:ring-[#1F302B] focus-visible:border-[#1F302B] focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-dark">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5B746F]">
                  <span className="font-semibold text-sm"><KeyRound className="w-5 h-5" /></span>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your password"
                  className="h-12 pl-12 pr-12 rounded-xl border-dark/10 bg-white/80 text-base placeholder:text-[#6B7280]/60 text-dark transition-all focus:bg-white focus-visible:ring-1 focus-visible:ring-[#1F302B] focus-visible:border-[#1F302B] focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B746F] hover:text-[#1F302B] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-[#1F302B] hover:text-[#2C3E3A] font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || mobileNumber.length !== 10 || !password}
              className="w-full h-12 cursor-pointer bg-[#1F302B] hover:bg-[#2C3E3A] text-white rounded-full text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log In"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center pt-6 border-t border-[#E5E5E5]">
            <p className="text-sm text-[#6B7280]">
              Don&apos;t have an account?{" "}
              <Link
                href="/get-started"
                className="text-[#1F302B] hover:text-[#2C3E3A] font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
