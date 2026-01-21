"use client";

import { AlertCircle, FileText, Microscope, ArrowRight, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type CoverageStatus = "covered" | "partial" | "not_covered" | "not_applicable";

export interface CoverageInfo {
  status?: CoverageStatus | null;
  title?: string | null;
  message?: string | null;
  supportingDetail?: string | null;
}

interface ResultProps {
  quizSubmitted?: boolean;
  submissionMessage?: string;
  submissionError?: string;
  coverage?: CoverageInfo | null;
  isPincodeAllowed?: boolean;
}

export default function Result({
  quizSubmitted = false,
  submissionMessage,
  submissionError,
  coverage,
  isPincodeAllowed = true,
}: ResultProps) {
  const isSuccess = quizSubmitted && !submissionError;
  const hasCoverage = isSuccess && !!coverage;

  const renderStatusBlock = () => {
    if (submissionError) {
      return (
        <>
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-base text-black/80 leading-relaxed max-w-lg">
            <span className="font-semibold text-red-600">Submission Failed</span> {submissionError}
          </p>
        </>
      );
    }

    if (hasCoverage) {
      const isCovered = coverage?.status === "covered";
      const isPartial = coverage?.status === "partial";
      const iconColor = isCovered ? "text-green-600" : isPartial ? "text-amber-500" : "text-black/60";
      const IconComponent = isCovered ? CheckCircle : AlertCircle;

      return (
        <>
          <IconComponent className={`w-6 h-6 ${iconColor}`} />
          <div className="space-y-3">
            {submissionMessage ? (
              <p className="text-base text-black/70 leading-relaxed max-w-2xl">{submissionMessage}</p>
            ) : null}

            <p className="text-base text-black/80 leading-relaxed max-w-2xl">
              {coverage?.title && (
                <span className={`font-semibold ${isCovered ? "text-green-600" : "text-black"}`}>
                  {coverage.title}
                </span>
              )}{" "}
              {coverage?.message}
            </p>
          </div>
          {coverage?.supportingDetail && (
            <p className="text-sm text-black/60 leading-relaxed max-w-2xl">
              {coverage.supportingDetail}
            </p>
          )}
        </>
      );
    }

    if (isSuccess) {
      return (
        <>
          <CheckCircle className="w-6 h-6 text-green-600" />
          <p className="text-base text-black/80 leading-relaxed max-w-2xl">
            {submissionMessage ?? null}
          </p>
        </>
      );
    }

    if (!isPincodeAllowed) {
      return (
        <>
          <AlertCircle className="w-6 h-6" />
          <p className="text-base text-black/80 leading-relaxed max-w-2xl">
            {submissionMessage ?? null}
          </p>
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#191919] flex flex-col items-center py-8 px-4">
      
      <div className="w-full max-w-6xl flex flex-col gap-8">
        
        <div className="flex flex-col items-center text-center space-y-2">
            {renderStatusBlock()}
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-[1.5rem] p-6">
          
          <div className="text-center mb-12 border-b border-[#F5F5F4] pb-10">
            <h2 className="font-serif text-xl md:text-2xl text-[#1F302B] mb-2">
              No Worries
            </h2>
            <p className="text-base md:text-lg text-black/70 mb-6 max-w-2xl mx-auto leading-relaxed">
              Our treatment’s first steps begins with the at home Advanced Blood Test—starting with just
            </p>
            <div className="inline-block relative">
                <span className="font-serif font-bold text-4xl text-[#1F302B] relative z-10 px-2">
                    Rs 2299
                </span>
                <div className="absolute inset-x-0 bottom-1 h-3 bg-[#F0F2E9] -z-0"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F2E9] border border-[#E3E3E3] flex items-center justify-center text-[#5B746F] mb-4">
                <Microscope className="w-7 h-7" />
              </div>
              <p className="text-sm text-[#57534E] leading-relaxed font-medium">
                This isn’t just a blood test. It’s the most complete health evaluation test to address your condition.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F2E9] border border-[#E3E3E3] flex items-center justify-center text-[#5B746F] mb-4">
                <FileText className="w-7 h-7" />
              </div>
              <p className="text-sm text-[#57534E] leading-relaxed font-medium">
                We don’t just hand you a report. We turn complex results into clear insights, guided by a 1:1 consult with Expert Doctor.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F2E9] border border-[#E3E3E3] flex items-center justify-center text-[#5B746F] mb-4">
                <Zap className="w-7 h-7" />
              </div>
              <p className="text-sm text-[#57534E] leading-relaxed font-medium">
                Turn your insights into action with the right GLP 1 plan for you.
              </p>
            </div>

          </div>

          <div className="mt-12 flex flex-col items-center">
            <Button 
              className="w-full md:w-[160px] h-12 bg-[#1F302B] hover:bg-[#2C3E3A] text-white rounded-xl text-base font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              Begin Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}