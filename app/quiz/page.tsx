// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { ArrowLeft, ArrowRight, Check, MapPin, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Result from "@/components/quiz/result";

// const indianStates = [
//   "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
//   "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
//   "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
//   "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
//   "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
//   "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
//   "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
//   "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
// ];

// export default function QuizPage() {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, any>>({});
//   const [showResult, setShowResult] = useState(false);
//   const [stateSearch, setStateSearch] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const questions = [
//     { id: "dob", question: "What is your date of birth?", type: "date" },
//     { id: "state", question: "What state do you live in?", type: "searchable-select", options: indianStates },
//     { 
//       id: "gender", 
//       question: "What is your gender identity?", 
//       type: "radio", 
//       options: ["Man", "Woman", "Transgender man", "Transgender woman", "Non-binary", "Other", "Decline to answer"] 
//     },
//     { id: "pregnant", question: "Are you pregnant, nursing, or trying to get pregnant?", type: "radio", options: ["Yes", "No"] },
//     { id: "height", question: "What is your height?", type: "height" },
//     { id: "currentWeight", question: "What is your current weight?", type: "weight", subtitle: "This helps us calculate your BMI.", unit: "kg" },
//     { id: "goalWeight", question: "What is your goal weight?", type: "weight", unit: "kg" },
//     { 
//       id: "medicalConditions", 
//       question: "Have you ever been treated for any of these conditions?", 
//       type: "checkbox", 
//       options: ["Undergoing dialysis", "Heart failure", "Anorexia or bulimia", "Organ transplant", "Liver failure", "None"] 
//     },
//     { id: "cancerHistory", question: "Do you have a personal history of cancer?", type: "radio", options: ["Yes", "No"] },
//     { 
//       id: "weightLossMed", 
//       question: "Have you ever taken medication for weight loss?", 
//       type: "radio", 
//       options: ["Currently taking", "Previously taken", "Never taken"] 
//     },
//     { id: "glp1Meds", question: "Have you taken any GLP-1 meds before?", type: "radio", options: ["Yes", "No"] }
//   ];

//   const currentQ = questions[currentQuestion];
//   const totalQuestions = questions.length;
//   const progress = ((currentQuestion + 1) / totalQuestions) * 100;

//   // Sync search input with answer when navigating back
//   useEffect(() => {
//     if (currentQ.type === "searchable-select" && answers[currentQ.id]) {
//       setStateSearch(answers[currentQ.id]);
//     }
//   }, [currentQuestion, currentQ.type, answers, currentQ.id]);

//   const filteredStates = indianStates.filter(state =>
//     state.toLowerCase().includes(stateSearch.toLowerCase())
//   );

//   const handleNext = () => {
//     if (currentQuestion < totalQuestions - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     } else {
//       setShowResult(true);
//     }
//   };

//   const handleAnswer = (id: string, value: any) => {
//     setAnswers(prev => ({ ...prev, [id]: value }));
//   };

//   const handleCheckbox = (id: string, option: string) => {
//     const current = (answers[id] as string[]) || [];
//     if (current.includes(option)) {
//       handleAnswer(id, current.filter(i => i !== option));
//     } else {
//       if (option === "None") handleAnswer(id, ["None"]);
//       else handleAnswer(id, [...current.filter(i => i !== "None"), option]);
//     }
//   };

//   const isNextDisabled = useMemo(() => {
//     const val = answers[currentQ.id];
//     switch(currentQ.type) {
//         case "height": return !val?.feet || !val?.inches;
//         case "checkbox": return !val || val.length === 0;
//         default: return !val || val === "";
//     }
//   }, [answers, currentQ]);

//   if (showResult) return <Result />;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#F7F1EB] via-white to-[#E8F0ED] text-[#191919] flex flex-col items-center py-10 px-4">
      
//       {/*  Progress */}
//       <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-4xl mb-12 px-1 sm:px-0">
//         <div className="flex justify-between text-xs font-semibold text-[#5B746F] uppercase tracking-wider mb-3">
//             <span>Question {currentQuestion + 1} / {totalQuestions}</span>
//             <span>{Math.round(progress)}%</span>
//         </div>
//         <div className="h-1.5 bg-[#E5E5E5] w-full">
//           <div 
//             className="h-full bg-[#1F302B] transition-all duration-300 ease-out"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>

//       <div className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl flex-1 flex flex-col">
//         <div className="text-center mb-5">
//           <h1 className="font-serif text-3xl text-[#111] mb-3 leading-tight">
//             {currentQ.question}
//           </h1>
//           {currentQ.subtitle && (
//             <p className="text-sm text-[#555] max-w-md mx-auto leading-relaxed">
//               {currentQ.subtitle}
//             </p>
//                 )}
//         </div>

//         {/* Inputs Area */}
//         <div className="flex-1 w-full">
          
//           {/* DATE INPUT */}
//           {currentQ.type === "date" && (
//             <div className="max-w-xs mx-auto">
//               <Input
//                 type="date"
//                 value={answers[currentQ.id] || ""}
//                 onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
//                 className="h-12 rounded-lg border-[#D4D4D4] bg-white text-base text-center focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B] transition-colors cursor-pointer"
//               />
//             </div>
//           )}

//           {/* STATE SEARCH INPUT */}
//           {currentQ.type === "searchable-select" && (
//             <div className="max-w-md mx-auto relative">
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-[#888]" />
//                 <Input
//                   value={stateSearch}
//                   onFocus={() => setIsDropdownOpen(true)}
//                   onChange={(e) => {
//                     setStateSearch(e.target.value);
//                     setIsDropdownOpen(true);
//                     if(answers[currentQ.id] !== e.target.value) handleAnswer(currentQ.id, "");
//                   }}
//                   placeholder="Select state..."
//                   className="h-12 pl-10 rounded-lg border-[#D4D4D4] bg-white text-base focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B] transition-colors"
//                 />
//               </div>
              
//               {isDropdownOpen && stateSearch && (
//                 <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#E5E5E5] max-h-60 overflow-y-auto z-50">
//                   {filteredStates.length > 0 ? (
//                     filteredStates.map((state) => (
//                       <button
//                         key={state}
//                         onClick={() => {
//                           handleAnswer(currentQ.id, state);
//                           setStateSearch(state);
//                           setIsDropdownOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-3 text-sm hover:bg-[#F5F5F4] transition-colors text-[#191919] cursor-pointer border-b border-[#F5F5F4] last:border-0"
//                       >
//                         {state}
//                       </button>
//                     ))
//                   ) : (
//                     <div className="p-4 text-center text-sm text-gray-500">No states found</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* RADIO & CHECKBOX OPTIONS */}
//           {(currentQ.type === "radio" || currentQ.type === "checkbox") && currentQ.options && (
//             <div className="space-y-2 max-w-lg mx-auto">
//               {currentQ.options.map((option, idx) => {
//                 const isSelected = currentQ.type === "radio" 
//                   ? answers[currentQ.id] === option 
//                   : (answers[currentQ.id] || []).includes(option);
                
//                 return (
//                   <div
//                     key={idx}
//                     onClick={() => currentQ.type === "radio" 
//                         ? handleAnswer(currentQ.id, option) 
//                         : handleCheckbox(currentQ.id, option)
//                     }
//                     className={`relative w-full text-left p-3 pl-12 rounded-lg border cursor-pointer transition-colors duration-200 group ${
//                       isSelected
//                         ? "bg-[#1F302B] border-[#1F302B] text-white"
//                         : "bg-white border-[#D4D4D4] text-[#191919] hover:bg-[#F5F5F4] hover:border-[#A3A3A3]"
//                     }`}
//                   >
//                     <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
//                         isSelected ? "border-white bg-transparent" : "border-[#D4D4D4] group-hover:border-[#888]"
//                     }`}>
//                         {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
//                     </div>
//                     <span className=" text-sm leading-snug block">
//                         {option}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* HEIGHT INPUT */}
//           {currentQ.type === "height" && (
//             <div className="max-w-xs mx-auto flex gap-4">
//               <div className="flex-1 relative">
//                 <Input 
//                   type="number"
//                   value={answers[currentQ.id]?.feet || ""}
//                   onChange={(e) => handleAnswer(currentQ.id, { ...answers[currentQ.id], feet: e.target.value })}
//                   className="h-11 text-center text-lg rounded-lg border-[#D4D4D4] bg-white focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
//                   placeholder="0"
//                 />
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#888] font-medium pointer-events-none">ft</span>
//               </div>
//               <div className="flex-1 relative">
//                 <Input 
//                   type="number"
//                   value={answers[currentQ.id]?.inches || ""}
//                   onChange={(e) => handleAnswer(currentQ.id, { ...answers[currentQ.id], inches: e.target.value })}
//                   className="h-11 text-center text-lg rounded-lg border-[#D4D4D4] bg-white focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
//                   placeholder="0"
//                 />
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#888] font-medium pointer-events-none">in</span>
//               </div>
//             </div>
//           )}

//           {/* WEIGHT INPUT */}
//           {currentQ.type === "weight" && (
//             <div className="max-w-xs mx-auto relative">
//                <Input
//                  type="number"
//                  placeholder="0.0"
//                  value={answers[currentQ.id] || ""}
//                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
//                  className="h-11 pl-6 pr-14 text-center text-lg font-medium rounded-lg border-[#D4D4D4] bg-white focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                />
//                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-[#888] font-medium border-l border-[#E5E5E5] pl-3">
//                   {currentQ.unit}
//                </span>
//             </div>
//           )}

//         </div>

//         {/* Footer */}
//         <div className="mt-10 flex items-center gap-4 pt-6 border-t border-[#E5E5E5]">
//           {currentQuestion > 0 && (
//             <Button
//               variant="ghost"
//               onClick={() => setCurrentQuestion(currentQuestion - 1)}
//               className="h-11 px-6 rounded-lg text-[#6B7280] hover:text-[#1F302B] hover:bg-transparent -ml-4 cursor-pointer"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back
//             </Button>
//           )}
          
//           <Button
//             onClick={handleNext}
//             disabled={isNextDisabled}
//             className={`ml-auto h-11 px-8 w-32 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
//               isNextDisabled
//                 ? "bg-[#E5E5E5] text-[#A3A3A3] cursor-not-allowed hover:bg-[#E5E5E5]"
//                 : "bg-[#1F302B] hover:bg-[#2C3E3A] text-white"
//             }`}
//           >
//             {currentQuestion === totalQuestions - 1 ? "Calculate" : "Continue"}
//             {!isNextDisabled && <ChevronRight className="w-4 h-4 ml-2" />}
//           </Button>
//         </div>

//       </div>
//     </div>
//   );
// }

"use client";

import { Suspense, useRef, useState, useMemo, useEffect, useCallback } from "react";
import { ArrowLeft, Check, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Result, { CoverageInfo } from "@/components/quiz/result";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";

const allowedPincodes = ["110001", "400001", "560001", "122002", "201301"];

const prevMedications = [
  "Compounded Semaglutide", "Compounded Tirzepatide", "Wegovy®", "Ozempic®",
  "Zepbound®", "Mounjaro®", "Contrave®", "Bupropion", "Zonisamide",
  "Topiramate", "Naltrexone", "Metformin", "Phentermine", "Another medication not listed"
];

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F1EB] flex items-center justify-center text-[#4A3C2F]">
          <p className="text-sm tracking-[0.4em] uppercase text-[#7A6A58]">
            Preparing your assessment…
          </p>
        </div>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}

function QuizPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isReady: razorpayReady, isLoading: razorpayLoading, openCheckout } = useRazorpayCheckout();
  const selectedPlanIdFromQuery = searchParams.get('planId');
  const flowFromQuery = searchParams.get('flow');
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isPincodeAllowed, setIsPincodeAllowed] = useState(true);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | undefined>();
  const [submissionError, setSubmissionError] = useState<string | undefined>();
  const [coverage, setCoverage] = useState<CoverageInfo | null>(null);
  const [insuranceProviders, setInsuranceProviders] = useState<
    { id: string; name: string; coveragePercentage: number }[]
  >([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [providerDisplayName, setProviderDisplayName] = useState<string | null>(null);

  const [defaultPlanId, setDefaultPlanId] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState(false);


  const steps = [
    { id: "step1", type: "mixed-profile" },
    { id: "step2", type: "goal-weight" },
    { 
      id: "medical_conditions", 
      question: "Have you ever had any of the following medical conditions or received treatment for them?", 
      type: "checkbox",
      options: ["Heart Blockage/ Stroke", "Undergoing Dialysis", "Anorexia or Bulimia", "Organ transplant", "Liver Failure", "None"]
    },
    { 
      id: "cancer_history", 
      question: "Do you have any History of Cancer?", 
      type: "radio-conditional",
      options: ["Yes", "No"],
      conditionalQ: "We need to know more about the condition.",
      conditionalType: "text"
    },
    { 
      id: "medication_history", 
      question: "Have you ever taken, or are you currently taking, any medication for weight loss?", 
      type: "radio-branch",
      options: [
        "I am on weight loss medications or treatment right now",
        "I have previously taken a weight loss medication treatment",
        "No, I have never taken medication for weight loss."
      ]
    },
    { 
      id: "pancreatitis", 
      question: "Do you have a history of pancreatitis?", 
      type: "radio", 
      options: ["Yes", "No"] 
    },
    { 
      id: "gastroparesis", 
      question: "Do you have a history of gastroparesis?", 
      type: "radio", 
      options: ["Yes", "No"] 
    },
    { 
      id: "gallbladder", 
      question: "Have you ever experienced any gallbladder-related pain or conditions (gallstones, infection, sludge)?", 
      type: "radio-conditional",
      options: ["Yes", "No"],
      conditionalQ: "Has your gallbladder been removed?",
      conditionalType: "radio",
      conditionalOptions: ["Yes", "No"]
    },
    { 
      id: "thyroid_cancer", 
      question: "Do you or your family have a history of Thyroid cancer?", 
      type: "radio", 
      options: ["Yes", "No"] 
    },
    { 
      id: "swallowing_pills", 
      question: "Do you have problem in swallowing pills?", 
      type: "radio", 
      options: ["Yes, I don’t like swallowing pills", "No, I have no problems"] 
    },
    { 
      id: "needle_fear", 
      question: "How do you feel about a subcutaneous needle?", 
      type: "radio", 
      options: ["I fear and cannot consider it", "I am fine with once a week needle if it does the job", "I am not sure"] 
    },
    { 
      id: "sleep_trouble", 
      question: "Do you have trouble sleeping (falling asleep, staying asleep, or waking up feeling unrested)?", 
      type: "radio", 
      options: ["Yes, I struggle with sleep", "Sometimes, I struggle with sleep", "No, I never have trouble sleeping"] 
    },
    { 
      id: "fatigue", 
      question: "How often do you feel fatigued/ tired?", 
      type: "radio", 
      options: ["Most of the time", "Sometimes I feel fatigued", "I never feel fatigued"] 
    },
    { 
      id: "strength_training", 
      question: "How many times a week are you engaging in strength training or resistance training?", 
      type: "radio", 
      options: ["Rarely/ Never", "1-2x a week", "2-4x a week", ">4x a week"] 
    }
  ];

  const syncProviderParams = useCallback(
    (providerId?: string | null, providerName?: string | null) => {
      const normalizedId = providerId ?? null;
      const normalizedName = providerName ?? null;
      const currentId = searchParams.get('insuranceProviderId');
      const currentName = searchParams.get('insuranceProviderName');

      if ((normalizedId ?? null) === (currentId ?? null) && (normalizedName ?? null) === (currentName ?? null)) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      if (normalizedId) params.set('insuranceProviderId', normalizedId);
      else params.delete('insuranceProviderId');

      if (normalizedName) params.set('insuranceProviderName', normalizedName);
      else params.delete('insuranceProviderName');

      const query = params.toString();
      router.replace(`/quiz${query ? `?${query}` : ''}`, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    fetch('/api/quiz/session').catch(() => undefined);
    checkUserAuthentication();
  }, []);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchDefaultPlan = async () => {
      setPlanLoading(true);
      try {
        const res = await fetch("/api/plans", { signal: controller.signal });
        const data = await res.json();

        if (!mounted) return;
        if (!res.ok) {
          setDefaultPlanId(null);
          return;
        }

        const plans = (data?.plans ?? []) as Array<{ id: string; price: number; isDefault?: boolean }>;
        const matched = plans.find((p) => p.isDefault) ?? plans[0];
        setDefaultPlanId(matched?.id ?? null);
      } catch {
        if (!mounted) return;
        setDefaultPlanId(null);
      } finally {
        if (!mounted) return;
        setPlanLoading(false);
      }
    };

    fetchDefaultPlan();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const otpName = sessionStorage.getItem('quiz-full-name');
    if (!otpName) return;

    setAnswers((prev) => ({
      ...prev,
      name: prev.name || otpName,
    }));
    setIsNameLocked(true);
  }, []);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  useEffect(() => {
    const providerIdParam = searchParams.get('insuranceProviderId');
    const providerNameParam = searchParams.get('insuranceProviderName');

    setSelectedProviderId(providerIdParam ?? null);
    setProviderDisplayName(providerNameParam ?? null);
  }, [searchParams]);

  const checkUserAuthentication = async () => {
    try {
      const response = await fetch('/api/user/me?optional=1');
      if (response.ok) {
        const userData = await response.json();
        if (userData.user) {
          // Pre-fill user data in answers
          setAnswers(prev => ({ 
            ...prev, 
            mobileNumber: userData.user.mobileNumber,
            name: userData.user.name || prev.name
          }));
          if (userData.user.name) {
            setIsNameLocked(true);
          }
        }
      }
    } catch (error) {
      // ignore
    }
  };

  const currentQ = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleAnswer = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const activeInsuranceName = providerDisplayName;

  const handleCheckbox = (id: string, option: string) => {
    const current = (answers[id] as string[]) || [];
    if (current.includes(option)) {
      handleAnswer(id, current.filter(i => i !== option));
    } else {
      if (option === "None") handleAnswer(id, ["None"]);
      else handleAnswer(id, [...current.filter(i => i !== "None"), option]);
    }
  };

  const handleNext = async () => {
    if (isSubmitting) return;
    // Pincode Check on Step 1
    if (currentStep === 0) {
      if (!allowedPincodes.includes(answers.pincode)) {
        setIsPincodeAllowed(false);
      }
    }

    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit quiz to backend
      await handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep === 0) return;
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (isSubmitting || quizSubmitted) return;
    setIsSubmitting(true);

    try {
      setSubmissionError(undefined);
      // Convert answers object to array of question-answer pairs
      const questionMap: Record<string, string> = {
        name: "What is your name?",
        age: "What is your age?",
        gender: "What is your gender?",
        height: "What is your height (in inches)?",
        currentWeight: "What is your current weight (kg)?",
        email: "What is your email?",
        pincode: "What is your pincode?",
        goalWeight: "What is your goal weight (kg)?",
        medical_conditions: "Have you ever had any of the following medical conditions or received treatment for them?",
        cancer_history: "Do you have any History of Cancer?",
        cancer_history_details: "Please provide details about your cancer history",
        medication_history: "Have you ever taken, or are you currently taking, any medication for weight loss?",
        current_meds_list: "Please list your current medications",
        prev_meds_list: "Please list medications you've previously taken",
        pancreatitis: "Do you have a history of pancreatitis?",
        gastroparesis: "Do you have a history of gastroparesis?",
        gallbladder: "Have you ever experienced any gallbladder-related pain or conditions?",
        gallbladder_details: "Has your gallbladder been removed?",
        thyroid_cancer: "Do you or your family have a history of Thyroid cancer?",
        swallowing_pills: "Do you have problem in swallowing pills?",
        needle_fear: "How do you feel about a subcutaneous needle?",
        sleep_trouble: "Do you have trouble sleeping?",
        fatigue: "How often do you feel fatigued/tired?",
        strength_training: "How many times a week are you engaging in strength training or resistance training?",
      };

      const formattedAnswers = Object.entries(answers)
        .filter(([key]) => questionMap[key])
        .map(([key, value]) => ({
          question: questionMap[key],
          answer: Array.isArray(value) ? value.join(', ') : String(value),
        }));

      const firebaseIdToken = typeof window !== 'undefined'
        ? sessionStorage.getItem('quiz-firebase-id-token')
        : null;
      const otpName = typeof window !== 'undefined'
        ? sessionStorage.getItem('quiz-full-name')
        : null;

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: formattedAnswers,
          insuranceProviderId: selectedProviderId || undefined,
          firebaseIdToken: firebaseIdToken || undefined,
          name: otpName || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('quiz-firebase-id-token');
          sessionStorage.removeItem('quiz-full-name');
        }
        const coverageResponse = data.coverage as CoverageInfo | null;
        setCoverage(coverageResponse ?? null);
        setSubmissionMessage(data.message);
        toast({
          title: coverageResponse?.title ?? 'Quiz submitted',
          description: coverageResponse?.message ?? 'Thanks for completing the quiz. Our care team will follow up shortly.',
        });
        if (coverageResponse?.supportingDetail) {
          toast({
            title: 'More details',
            description: coverageResponse.supportingDetail,
          });
        }
        toast({
          title: 'Submission received',
          description: data.message ?? 'Your submission is queued for review within 24 hours.',
        });
        setQuizSubmitted(true);
        setShowResult(true);
      } else {
        console.error('Quiz submission failed:', data.error);
        setCoverage(null);
        setSubmissionMessage(undefined);

        toast({
          title: 'Submission failed',
          description: data.error || 'Failed to submit quiz. Please try again.',
        });
        setSubmissionError(data.error || 'Failed to submit quiz. Please try again.');
        setShowResult(true);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setCoverage(null);
      setSubmissionMessage(undefined);
      toast({
        title: 'Submission error',
        description: 'An error occurred while submitting the quiz. Please try again.',
      });
      setSubmissionError('An error occurred while submitting the quiz. Please try again.');
      setShowResult(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Validation ---
  const isNextDisabled = useMemo(() => {
    if (currentStep === 0) {
      return !answers.name || !answers.age || !answers.gender || !answers.height || !answers.currentWeight || !answers.email || !answers.pincode;
    }
    
    if (currentStep === 1) {
      return !answers.goalWeight;
    }

    const val = answers[currentQ.id];
    
    if (currentQ.type === "checkbox") return !val || val.length === 0;
    if (currentQ.type === "radio-conditional") {
       if (val === "Yes") return !answers[`${currentQ.id}_details`];
       return !val;
    }
    if (currentQ.type === "radio-branch") {
        if (val === steps[4].options![0]) return !answers.current_meds_list; 
        if (val === steps[4].options![1]) return !answers.prev_meds_list || answers.prev_meds_list.length === 0; 
        return !val;
    }

    return !val;
  }, [answers, currentStep, currentQ]);

  const heightOptions = Array.from({ length: 37 }, (_, i) => i + 48);

  const questionVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      filter: "blur(4px)",
      transition: {
        duration: 0.35,
        ease: [0.7, 0, 0.84, 0] as const,
      },
    }),
  };

  if (showResult) {
    return (
      <Result
        quizSubmitted={quizSubmitted}
        submissionMessage={submissionMessage}
        submissionError={submissionError}
        coverage={coverage}
        isPincodeAllowed={isPincodeAllowed}
        planId={selectedPlanIdFromQuery}
        flow={flowFromQuery}
      />
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden overflow-x-hidden bg-gradient-to-br from-[#F7F1EB] via-white to-[#E8F0ED] text-[#191919] flex flex-col items-center px-4 pt-6 pb-4 z-50">

      {/* Progress */}
      {activeInsuranceName && (
        <div className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl mb-6 bg-white/70 border border-[#D4E2DA] rounded-2xl px-5 py-4 shadow-sm backdrop-blur-sm text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#5B746F] mb-1">Insurance Priority</p>
          <p className="text-sm text-[#1F302B] font-medium">
            Complete this quiz to confirm coverage with <span className="font-semibold">{activeInsuranceName}</span>
          </p>
        </div>
      )}
      <div className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl mb-12 px-1 sm:px-0">
        <div className="flex justify-between text-xs font-semibold text-[#5B746F] uppercase tracking-wider mb-3">
            <span>Step {currentStep + 1} / {steps.length}</span>
            <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-[#E5E5E5] w-full rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#1F302B] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl flex-1 flex flex-col overflow-hidden min-h-0">
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pb-6">
          <div className="relative overflow-x-hidden">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={currentQ.id}
                custom={direction}
                variants={questionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col min-w-0"
              >
              {/* --- STEP 1: MIXED PROFILE FORM --- */}
              {currentQ.type === "mixed-profile" && (
            <div className="space-y-5 animate-in fade-in duration-500">
                <h1 className="font-serif text-3xl text-[#111] mb-6 text-center">Tell us about yourself</h1>
                
                <Input 
                    placeholder="Name" 
                    value={answers.name || ""} 
                    onChange={e => handleAnswer("name", e.target.value)}
                    className="h-12 rounded-lg border-[#D4D4D4] bg-white text-base focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B]"
                    disabled={isNameLocked}
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        type="number" 
                        placeholder="Age" 
                        value={answers.age || ""} 
                        onChange={e => handleAnswer("age", e.target.value)}
                        className="h-12 rounded-lg border-[#D4D4D4] bg-white text-base focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <select 
                        value={answers.gender || ""} 
                        onChange={e => handleAnswer("gender", e.target.value)}
                        className="h-12 px-3 rounded-lg border border-[#D4D4D4] bg-white text-base focus:outline-none focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B] text-[#191919]"
                    >
                        <option value="" disabled>Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Height Dropdown */}
                <div className="relative">
                    <select
                        value={answers.height || ""}
                        onChange={e => handleAnswer("height", e.target.value)}
                        className="w-full h-12 px-3 rounded-lg border border-[#D4D4D4] bg-white text-base focus:outline-none focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B] text-[#191919] appearance-none"
                    >
                        <option value="" disabled>Height (Inches)</option>
                        {heightOptions.map(h => (
                            <option key={h} value={h}>{h} inches ({Math.floor(h/12)}'{h%12}")</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronRight className="w-4 h-4 rotate-90 text-gray-400" />
                    </div>
                </div>

                {/* Weight Input*/}
                <div className="relative">
                    <Input 
                        type="text" 
                        inputMode="decimal"
                        placeholder="Current Weight" 
                        value={answers.currentWeight || ""} 
                        onChange={e => {
                            if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
                                handleAnswer("currentWeight", e.target.value);
                            }
                        }}
                        className="h-12 rounded-lg border-[#D4D4D4] bg-white text-base focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#888] font-medium border-l border-[#E5E5E5] pl-3">
                        kg
                    </span>
                </div>

                <Input 
                    type="email" 
                    placeholder="Email" 
                    value={answers.email || ""} 
                    onChange={e => handleAnswer("email", e.target.value)}
                    className="h-12 rounded-lg border-[#D4D4D4] bg-white text-base focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B]"
                />

                <Input 
                    type="number" 
                    placeholder="Pincode" 
                    value={answers.pincode || ""} 
                    onChange={e => handleAnswer("pincode", e.target.value)}
                    className="h-12 rounded-lg border-[#D4D4D4] bg-white text-base focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

            </div>
        )}

        {/* --- STEP 2: GOAL WEIGHT --- */}
        {currentQ.type === "goal-weight" && (
            <div className="space-y-6 text-center animate-in fade-in duration-500 mt-2">
                <h1 className="font-serif text-3xl text-[#111] mb-4">What is your <span className="border-0 bg-accent2/30 border-dark p-1 px-5 rounded-4xl">goal</span> weight?</h1>
                <p className="text-[#5B746F] font-medium mb-6">Current Weight: {answers.currentWeight} kg</p>
                
                <div className="max-w-xs mx-auto relative">
                    <Input 
                        type="text" 
                        inputMode="decimal"
                        placeholder="0.0" 
                        value={answers.goalWeight || ""} 
                        onChange={e => {
                             if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
                                handleAnswer("goalWeight", e.target.value);
                            }
                        }}
                        className="h-14 pl-6 pr-14 text-center text-xl font-medium rounded-lg border-[#D4D4D4] bg-white focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B]"
                    />
                     <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-[#888] font-medium border-l border-[#E5E5E5] pl-3">
                        kg
                    </span>
                </div>
            </div>
        )}

              {["checkbox", "radio", "radio-conditional", "radio-branch"].includes(currentQ.type) && (
            <div className="text-center animate-in fade-in duration-500">
                <h1 className="font-serif text-3xl text-[#111] mb-8 leading-tight">{currentQ.question}</h1>
                
                <div className="space-y-3 w-full max-w-lg sm:max-w-2xl mx-auto">
                    {currentQ.options?.map((option, idx) => {
                        const isSelected = 
                            (currentQ.type === "checkbox" && (answers[currentQ.id] || []).includes(option)) ||
                            (answers[currentQ.id] === option);

                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    if(currentQ.type === "checkbox") handleCheckbox(currentQ.id, option);
                                    else handleAnswer(currentQ.id, option);
                                }}
                                className={`relative w-full text-left p-4 pl-12 rounded-lg border cursor-pointer transition-colors duration-200 group ${
                                    isSelected
                                    ? "bg-[#1F302B] border-[#1F302B] text-white"
                                    : "bg-white border-[#D4D4D4] text-[#191919] hover:bg-[#F5F5F4] hover:border-[#A3A3A3]"
                                }`}
                            >
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                    isSelected ? "border-white bg-transparent" : "border-[#D4D4D4] group-hover:border-[#888]"
                                }`}>
                                    {isSelected && (
                                        currentQ.type === "checkbox" 
                                            ? <Check className="w-3 h-3 text-white" />
                                            : <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                    )}
                                </div>
                                <span className="text-sm font-medium leading-snug block">{option}</span>
                            </div>
                        );
                    })}
                </div>

                {/* CONDITIONAL: Cancer History */}
                {currentQ.type === "radio-conditional" && answers[currentQ.id] === "Yes" && currentQ.conditionalType === "text" && (
                    <div className="mt-6 w-full max-w-lg sm:max-w-2xl mx-auto text-left animate-in slide-in-from-top-2">
                        <label className="text-sm font-medium text-[#191919] mb-2 block">{currentQ.conditionalQ}</label>
                        <Textarea
                            value={answers[`${currentQ.id}_details`] || ""}
                            onChange={(e) => handleAnswer(`${currentQ.id}_details`, e.target.value)}
                            className="min-h-[120px] rounded-lg border-[#D4D4D4] bg-white focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B] resize-y"
                            placeholder="Please provide details..."
                        />
                    </div>
                )}

                 {/* CONDITIONAL: Gallbladder  */}
                 {currentQ.type === "radio-conditional" && answers[currentQ.id] === "Yes" && currentQ.conditionalType === "radio" && (
                    <div className="mt-8 w-full max-w-lg sm:max-w-2xl mx-auto text-left animate-in slide-in-from-top-2 p-6 bg-white rounded-xl border border-[#D4D4D4]">
                        <label className="text-base font-medium text-[#191919] mb-4 block text-center">{currentQ.conditionalQ}</label>
                        <div className="space-y-3">
                            {currentQ.conditionalOptions?.map((opt) => (
                                <div
                                    key={opt}
                                    onClick={() => handleAnswer(`${currentQ.id}_details`, opt)}
                                    className={`relative w-full text-left p-3 pl-10 rounded-lg border cursor-pointer ${
                                        answers[`${currentQ.id}_details`] === opt
                                        ? "bg-[#1F302B] border-[#1F302B] text-white"
                                        : "bg-[#FAFAF9] border-[#E5E5E5] text-[#191919]"
                                    }`}
                                >
                                     <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border flex items-center justify-center ${
                                        answers[`${currentQ.id}_details`] === opt ? "border-white" : "border-[#D4D4D4]"
                                     }`}>
                                         {answers[`${currentQ.id}_details`] === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                                     </div>
                                    <span className="text-sm">{opt}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CONDITIONAL: Medication Branching */}
                {currentQ.type === "radio-branch" && (
                    <div className="mt-6 w-full max-w-lg sm:max-w-2xl mx-auto animate-in slide-in-from-top-2">
                        {answers[currentQ.id] === currentQ.options![0] && (
                            <div>
                                <label className="text-sm font-medium text-[#191919] mb-2 block">Which weight loss medications are you currently taking?</label>
                                <Textarea
                                    placeholder="Enter medication names..."
                                    value={answers.current_meds_list || ""}
                                    onChange={(e) => handleAnswer("current_meds_list", e.target.value)}
                                    className="min-h-[100px] rounded-lg border-[#D4D4D4] bg-white focus:border-[#1F302B] focus:ring-1 focus:ring-[#1F302B]"
                                />
                            </div>
                        )}
                        {/* Option 2: Previously Taken -> Checkbox List */}
                        {answers[currentQ.id] === currentQ.options![1] && (
                             <div className="bg-white p-4 rounded-xl border border-[#D4D4D4] max-h-60 overflow-y-auto text-left">
                                <label className="text-sm font-bold text-[#191919] mb-3 block sticky top-0 bg-white pb-2 border-b">Select previous medications:</label>
                                <div className="space-y-2">
                                    {prevMedications.map(med => (
                                        <div 
                                            key={med} 
                                            onClick={() => {
                                                const list = answers.prev_meds_list || [];
                                                if(list.includes(med)) handleAnswer("prev_meds_list", list.filter((i:string) => i !== med));
                                                else handleAnswer("prev_meds_list", [...list, med]);
                                            }}
                                            className="flex items-center gap-3 p-2 hover:bg-[#FAFAF9] rounded cursor-pointer"
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${(answers.prev_meds_list || []).includes(med) ? "bg-[#1F302B] border-[#1F302B]" : "border-[#D4D4D4]"}`}>
                                                 {(answers.prev_meds_list || []).includes(med) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-sm text-[#191919]">{med}</span>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        )}
                    </div>
                )}
            </div>
              )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="shrink-0 mt-4 flex flex-wrap items-center gap-4 pt-4 border-t border-[#E5E5E5]  backdrop-blur-sm">
          {currentStep > 0 && (
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-lg text-[#6B7280] hover:text-[#1F302B] hover:bg-transparent -ml-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={isNextDisabled || isSubmitting}
            className={`ml-auto w-32 h-11 px-8 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
              isNextDisabled || isSubmitting
                ? "bg-[#E5E5E5] text-[#A3A3A3] cursor-not-allowed hover:bg-[#E5E5E5]"
                : "bg-[#1F302B] hover:bg-[#2C3E3A] text-white"
            }`}
          >
            {isSubmitting ? (
              <>
                Submitting
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              </>
            ) : (
              <>
                {currentStep === steps.length - 1 ? "Finish" : "Continue"}
                {!isNextDisabled && <ChevronRight className="w-4 h-4 ml-2" />}
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}