"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, Smartphone, ArrowRight, CheckCircle, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseAuth } from "@/lib/firebase/client-config";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext?: (context?: { mobileNumber: string }) => void;
  selectedProvider?: { id: string; name: string } | null;
}

interface ExistingUserNoticeProps {
  message: string;
}

const ExistingUserNotice = ({ message }: ExistingUserNoticeProps) => (
  <p className="text-xs text-[#6B7280] leading-relaxed">
    {message || "You are already registered. Please log in to continue."}{" "}
    <Link href="/login" className="underline font-medium text-[#4B5563]">
      Log in
    </Link>
    .
  </p>
);

export default function OTPModal({ isOpen, onClose, onNext, selectedProvider }: OTPModalProps) {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const [existingUserNotice, setExistingUserNotice] = useState<string | null>(null);

  const ensureRecaptchaVerifier = (auth: ReturnType<typeof getFirebaseAuth>) => {
    if (!auth || typeof window === "undefined") return null;

    const container = document.getElementById("recaptcha-container");
    if (!container) return null;

    if (recaptchaVerifierRef.current) return recaptchaVerifierRef.current;

    try {
      container.innerHTML = "";
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
      recaptchaVerifierRef.current = verifier;
      setRecaptchaVerifier(verifier);
      return verifier;
    } catch (error) {
      console.error("reCAPTCHA setup error:", error);
      return null;
    }
  };

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const auth = getFirebaseAuth();
      ensureRecaptchaVerifier(auth);
    }
    return () => {
      const verifier = recaptchaVerifierRef.current;
      if (verifier) {
        try {
          verifier.clear();
        } catch (error) {
          console.warn('reCAPTCHA cleanup error:', error);
        } finally {
          recaptchaVerifierRef.current = null;
          setRecaptchaVerifier(null);
        }
      }

      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setFullName("");
    setMobileNumber("");
    setOtp("");
    setOtpSent(false);
    setIsVerifying(false);
    setError("");
    setExistingUserNotice(null);
    setResendTimer(0);
    setConfirmationResult(null);
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (error) {
        console.warn('reCAPTCHA cleanup error:', error);
      } finally {
        recaptchaVerifierRef.current = null;
        setRecaptchaVerifier(null);
      }
    }
    if (typeof window !== 'undefined') {
      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setMobileNumber(value);
      if (existingUserNotice) setExistingUserNotice(null);
      if (error) setError("");
    }
  };

  const handleSendOTP = async () => {
    if (!fullName.trim()) {
      setError("Please enter your name");
      return;
    }
    
    if (fullName.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    
    if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
      setError("Name must contain only letters and spaces");
      return;
    }
    
    if (mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsVerifying(true);
    setError("");
    setExistingUserNotice(null);

    try {
      const preRegister = await fetch('/api/auth/pre-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName.trim(),
          mobileNumber,
        }),
      });

      if (!preRegister.ok) {
        const errorData = await preRegister.json().catch(() => null);
        console.error('Pre-register failed:', errorData?.error);
        setError(errorData?.error || 'Failed to start signup. Please try again.');
        setIsVerifying(false);
        return;
      }

      const registrationCheck = await fetch('/api/auth/check-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber }),
      });

      if (registrationCheck.ok) {
        const registrationData = await registrationCheck.json();
        if (registrationData?.exists && registrationData?.hasQuizSubmission) {
          setExistingUserNotice(
            registrationData.message ||
              'You are already registered and have submitted the quiz. You can still verify to update your quiz.'
          );
        }
      } else {
        const errorData = await registrationCheck.json();
        console.error('Registration check failed:', errorData?.error);
      }

      const auth = getFirebaseAuth();
      if (!auth) {
        setError("Firebase is not configured. Please contact support.");
        setIsVerifying(false);
        return;
      }

      const verifier = ensureRecaptchaVerifier(auth);
      if (!verifier) {
        setError("reCAPTCHA not initialized. Please refresh and try again.");
        setIsVerifying(false);
        return;
      }

      const phoneNumber = `+91${mobileNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setResendTimer(30);
      startResendTimer();
    } catch (error: any) {
      console.error('Firebase send OTP error:', error);
      if (error.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError(error.message || 'Failed to send OTP. Please try again.');
      }
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        setRecaptchaVerifier(null);
        const container = document.getElementById('recaptcha-container');
        if (container) {
          container.innerHTML = '';
        }
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
      setIsVerifying(false);
    }
  };

  const handleResendOtpDirectly = async () => {
    setError("");
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        setError("Please refresh and try again.");
        return;
      }

      const verifier = ensureRecaptchaVerifier(auth);
      if (!verifier) {
        setError("Please refresh and try again.");
        return;
      }

      const phoneNumber = `+91${mobileNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      
      setConfirmationResult(confirmation);
      setResendTimer(30);
      startResendTimer();
    } catch (error: any) {
      console.error('Firebase resend OTP error:', error);
      setError(error.message || 'Failed to resend OTP');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      setError("Session expired. Please request a new OTP.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const credential = await confirmationResult.confirm(otp);
      const firebaseIdToken = await credential.user.getIdToken();

      const verifyResponse = await fetch('/api/auth/verify-firebase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseIdToken,
          name: fullName.trim(),
        }),
      });

      if (!verifyResponse.ok) {
        const verifyError = await verifyResponse.json().catch(() => null);
        console.error('Backend verification failed:', verifyError?.error);
        setError(verifyError?.error || 'Verification failed. Please try again.');
        return;
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('quiz-firebase-id-token', firebaseIdToken);
        sessionStorage.setItem('quiz-full-name', fullName.trim());
      }

      resetState();
      if (onNext) {
        onNext({ mobileNumber });
        return;
      }

      window.location.href = '/quiz';
    } catch (error: any) {
      console.error('Firebase verify OTP error:', error);
      if (error.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check and try again.');
      } else if (error.code === 'auth/code-expired') {
        setError('OTP expired. Please request a new one.');
      } else {
        setError(error.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const startResendTimer = () => {
    let timer = 30;
    const interval = setInterval(() => {
      timer--;
      setResendTimer(timer);
      if (timer <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191919]/70 backdrop-blur-sm transition-all duration-300">
      
      <div 
        className="bg-white relative w-full max-w-md rounded-[1.7rem] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        
        <div className="bg-[#1F302B] px-6 py-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D6F0E6]/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                  <Smartphone className="w-5 h-5 text-[#D6F0E6]" />
              </div>
              <h2 className="font-serif text-xl text-white tracking-wide">
                Check Eligibility
              </h2>
            </div>
            {selectedProvider?.name && (
              <p className="text-xs uppercase tracking-widest text-white/70 ml-11">
                {selectedProvider.name}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="relative cursor-pointer z-10 p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div id="recaptcha-container" className="hidden" />
          {!otpSent ? (
            <>
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl text-[#191919] mb-2">
                  Let's get started
                </h3>
                <p className="text-sm text-[#6B7280]">
                  Enter your details to check your plan options.
                </p>
              </div>

              <div className="space-y-5 mb-6">
                {/* Name Input */}
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5B746F]">
                        <User className="w-5 h-5" />
                    </div>
                    <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="h-12 pl-12 rounded-xl border-[#E3E3E3] bg-[#F9F9F7] text-base placeholder:text-[#6B7280]/60 text-[#191919] transition-all focus:bg-white focus-visible:ring-1 focus-visible:ring-[#1F302B] focus-visible:border-[#1F302B] focus-visible:ring-offset-0"
                    />
                </div>

                {/* Mobile Input */}
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5B746F]">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    <Input
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        placeholder="Mobile Number (10 digits)"
                        inputMode="numeric"
                        className="h-12 pl-12 rounded-xl border-[#E3E3E3] bg-[#F9F9F7] text-base placeholder:text-[#6B7280]/60 text-[#191919] transition-all focus:bg-white focus-visible:ring-1 focus-visible:ring-[#1F302B] focus-visible:border-[#1F302B] focus-visible:ring-offset-0"
                    />
                </div>

              </div>

              {/* Error Message */}
              {(error || existingUserNotice) && (
                <div className="flex flex-col gap-3 mb-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                  {existingUserNotice && (
                    <ExistingUserNotice
                      message={existingUserNotice}
                    />
                  )}
                </div>
              )}

              <Button
                onClick={handleSendOTP}
                className="w-full h-12 cursor-pointer bg-[#1F302B] hover:bg-[#2C3E3A] text-white rounded-full text-base font-medium shadow-lg transition-all border border-[#1F302B] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !fullName.trim() || 
                  fullName.trim().length < 2 ||
                  !/^[a-zA-Z\s]+$/.test(fullName.trim()) ||
                  mobileNumber.length !== 10 ||
                  isVerifying
                }
              >
                {isVerifying ? "Sending OTP..." : "Send OTP"}
                <ArrowRight className="w-4 h-4 ml-2 opacity-80" />
              </Button>
              
            </>
          ) : (
            <>
              {/* OTP Sent State */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#F7F1EB] rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle className="w-8 h-8 text-[#1F302B]" />
                </div>
                <h3 className="font-serif text-2xl text-[#191919] mb-1">
                  Verify Number
                </h3>
                <p className="text-sm text-[#6B7280]">
                  Enter code sent to <span className="font-semibold text-[#191919]">{mobileNumber}</span>
                </p>
              </div>

              <div className="mb-6">
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="0 0 0 0 0 0"
                  maxLength={6}
                  className="h-14 rounded-2xl border-[#E3E3E3] bg-white text-2xl font-mono text-center tracking-[0.5em] shadow-sm text-[#191919] placeholder:text-gray-200 focus-visible:ring-1 focus-visible:ring-[#1F302B] focus-visible:border-[#1F302B] focus-visible:ring-offset-0"
                  autoFocus
                />
                
                {/* Resend OTP */}
                <div className="flex justify-center mt-3">
                  <button
                    onClick={handleResendOtpDirectly}
                    disabled={resendTimer > 0 || isVerifying}
                    className="text-xs cursor-pointer font-medium text-[#5B746F] hover:text-[#1F302B] underline decoration-1 underline-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : "Resend Code"}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {(error || existingUserNotice) && (
                <div className="flex flex-col gap-3 mb-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                  {existingUserNotice && (
                    <ExistingUserNotice message={existingUserNotice} />
                  )}
                </div>
              )}

              <Button
                onClick={handleVerifyOTP}
                className="w-full h-12 cursor-pointer bg-[#1F302B] hover:bg-[#2C3E3A] text-white rounded-full text-base font-medium shadow-lg transition-all disabled:opacity-50"
                disabled={otp.length !== 6 || isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify & Continue"}
              </Button>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setError("");
                  setOtp("");
                  setConfirmationResult(null);
                  setResendTimer(0);
                }}
                className="w-full mt-4 cursor-pointer text-xs text-[#6B7280] hover:text-[#1F302B] transition-colors"
              >
                Change Mobile Number
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}