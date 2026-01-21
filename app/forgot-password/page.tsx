"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Smartphone, AlertCircle, ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseAuth } from "@/lib/firebase/client-config";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";

type Step = "mobile" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [firebaseIdToken, setFirebaseIdToken] = useState<string | null>(null);

  const isPasswordValid = (value: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = getFirebaseAuth();
      if (auth && !recaptchaVerifier) {
        try {
          const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {},
          });
          setRecaptchaVerifier(verifier);
        } catch (error) {
          console.error('reCAPTCHA setup error:', error);
        }
      }
    }
    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, []);

  const startResendTimer = () => {
    let timer = 30;
    setResendTimer(timer);
    const interval = setInterval(() => {
      timer--;
      setResendTimer(timer);
      if (timer <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setMobileNumber(value);
      if (error) setError("");
    }
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // First, verify user exists
      const checkResponse = await fetch('/api/auth/forgot-password/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber }),
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        setError(checkData.error || 'User not found');
        setIsLoading(false);
        return;
      }

      // If user exists, send OTP via Firebase
      const auth = getFirebaseAuth();
      if (!auth || !recaptchaVerifier) {
        setError("Firebase is not configured. Please refresh and try again.");
        setIsLoading(false);
        return;
      }

      const phoneNumber = `+91${mobileNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      
      setConfirmationResult(confirmation);
      setCurrentStep("otp");
      startResendTimer();
    } catch (error: any) {
      console.error('Send OTP error:', error);
      if (error.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError(error.message || 'Failed to send OTP. Please try again.');
      }
      
      // Reinitialize reCAPTCHA on error
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        const auth = getFirebaseAuth();
        if (auth) {
          const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {},
          });
          setRecaptchaVerifier(verifier);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    try {
      const auth = getFirebaseAuth();
      if (!auth || !recaptchaVerifier) {
        setError("Please refresh and try again.");
        return;
      }

      const phoneNumber = `+91${mobileNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      
      setConfirmationResult(confirmation);
      startResendTimer();
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      setError(error.message || 'Failed to resend OTP');
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      setError("Session expired. Please request a new OTP.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      // Verify OTP with backend
      const response = await fetch('/api/auth/forgot-password/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseIdToken: idToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFirebaseIdToken(idToken);
        setCurrentStep("reset");
      } else {
        setError(data.error || "OTP verification failed");
      }
    } catch (error: any) {
      console.error('OTP verify error:', error);
      if (error.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check and try again.');
      } else if (error.code === 'auth/code-expired') {
        setError('OTP expired. Please request a new one.');
      } else {
        setError(error.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid(newPassword)) {
      setError("Password must be 8+ characters with upper, lower, and number");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!firebaseIdToken) {
      setError("Session expired. Please start over.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseIdToken,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/quiz');
      } else {
        setError(data.error || "Password reset failed");
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMobileStep = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="font-serif text-4xl text-[#191919] mb-3">Reset Password</h2>
        <p className="text-base text-[#6B7280]">
          Enter your mobile number to receive a verification code
        </p>
      </div>

      <form onSubmit={handleMobileSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="mobile" className="text-sm font-medium text-[#191919]">
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
              className="h-12 pl-12 rounded-xl border-[#E3E3E3] bg-white text-base placeholder:text-[#6B7280]/60 text-[#191919] transition-all focus:bg-white focus-visible:ring-1 focus-visible:ring-[#1F302B] focus-visible:border-[#1F302B] focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div id="recaptcha-container"></div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || mobileNumber.length !== 10}
          className="w-full h-12 cursor-pointer bg-[#1F302B] hover:bg-[#2C3E3A] text-white rounded-full text-base font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending OTP..." : "Send OTP"}
          {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>

        <div className="text-center pt-4">
          <Link
            href="/login"
            className="text-sm text-[#1F302B] hover:text-[#2C3E3A] font-medium transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to login
          </Link>
        </div>
      </form>
    </>
  );

  const renderOTPStep = () => (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#F7F1EB] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#1F302B]" />
        </div>
        <h2 className="font-serif text-4xl text-[#191919] mb-3">Enter OTP</h2>
        <p className="text-base text-[#6B7280]">
          Code sent to <span className="font-semibold text-[#191919]">{mobileNumber}</span>
        </p>
      </div>

      <form onSubmit={handleOTPSubmit} className="space-y-5">
        <div className="space-y-2">
          <Input
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/[^0-9]/g, ''));
              if (error) setError("");
            }}
            placeholder="0 0 0 0 0 0"
            maxLength={6}
            className="h-14 rounded-2xl border-[#E3E3E3] bg-white text-2xl font-mono text-center tracking-[0.5em] shadow-sm text-[#191919] placeholder:text-gray-200 focus-visible:ring-1 focus-visible:ring-[#1F302B] focus-visible:border-[#1F302B] focus-visible:ring-offset-0"
            autoFocus
          />
          
          <div className="flex justify-center mt-3">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || isLoading}
              className="text-xs cursor-pointer font-medium text-[#5B746F] hover:text-[#1F302B] underline decoration-1 underline-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : "Resend Code"}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={otp.length !== 6 || isLoading}
          className="w-full h-12 cursor-pointer bg-[#1F302B] hover:bg-[#2C3E3A] text-white rounded-full text-base font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>

        <button
          type="button"
          onClick={() => {
            setCurrentStep("mobile");
            setOtp("");
            setError("");
          }}
          className="w-full text-xs text-[#6B7280] hover:text-[#1F302B] transition-colors"
        >
          Change Mobile Number
        </button>
      </form>
    </>
  );

  const renderResetStep = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="font-serif text-4xl text-[#191919] mb-3">Create New Password</h2>
        <p className="text-base text-[#6B7280]">
          Enter a strong password for your account
        </p>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="newPassword" className="text-sm font-medium text-[#191919]">
            New Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5B746F]">
              <span className="font-semibold text-sm">PW</span>
            </div>
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter new password"
              className="h-12 pl-12 pr-12 rounded-xl border-[#E3E3E3] bg-white text-base placeholder:text-[#6B7280]/60 text-[#191919] transition-all focus:bg-white focus-visible:ring-1 focus-visible:ring-[#1F302B] focus-visible:border-[#1F302B] focus-visible:ring-offset-0"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(prev => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B746F] hover:text-[#1F302B] transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-[#191919]">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5B746F]">
              <span className="font-semibold text-sm">PW</span>
            </div>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Confirm new password"
              className="h-12 pl-12 pr-12 rounded-xl border-[#E3E3E3] bg-white text-base placeholder:text-[#6B7280]/60 text-[#191919] transition-all focus:bg-white focus-visible:ring-1 focus-visible:ring-[#1F302B] focus-visible:border-[#1F302B] focus-visible:ring-offset-0"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B746F] hover:text-[#1F302B] transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {newPassword && confirmPassword && newPassword !== confirmPassword && (
          <p className="text-xs text-red-600">Passwords do not match</p>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !isPasswordValid(newPassword) || newPassword !== confirmPassword}
          className="w-full h-12 cursor-pointer bg-[#1F302B] hover:bg-[#2C3E3A] text-white rounded-full text-base font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Resetting Password..." : "Reset Password"}
          {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </form>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1F302B] via-[#2C3E3A] to-[#1A2825]">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="max-w-md space-y-6">
            <h1 className="font-serif text-5xl leading-tight">
              Reset your password securely
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              We&apos;ll send you a verification code to confirm your identity and help you create a new password.
            </p>
            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <p className="text-sm text-white/90">Secure OTP verification</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <p className="text-sm text-white/90">Instant password reset</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <p className="text-sm text-white/90">Account protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#FAFAF9]">
        <div className="w-full max-w-md space-y-8">
          {currentStep === "mobile" && renderMobileStep()}
          {currentStep === "otp" && renderOTPStep()}
          {currentStep === "reset" && renderResetStep()}
        </div>
      </div>
    </div>
  );
}
