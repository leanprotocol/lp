"use client";

import { Lock, Calendar, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <section className="bg-[#F6F1EE] min-h-screen py-10 md:py-14 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Document Header --- */}
        <div className="bg-[#1F302B] text-white rounded-t-2xl rounded-t-[2rem] p-8 md:p-12 border-b border-white/10">
          <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-2 text-[#D6F0E6]/80 font-mono text-sm">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: 15 January 2026</span>
          </div>
        </div>

        {/* --- Document Body --- */}
        <div className="bg-white rounded-b-2xl rounded-b-[2rem] border border-[#1F302B]/5 overflow-hidden">
          
          <div className="p-4 md:p-12 space-y-10">

            {/* Introduction */}
            <div className="prose max-w-none">
              <p className="text-[#57534E] leading-relaxed mb-4">
                Lean Protocol Private Limited (“Lean Protocol”, “we”, “us”, “our”) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, share, and protect information when you access or use the Lean Protocol website, mobile application, services, and community channels (collectively, the “Platform”).
              </p>
              <p className="text-[#57534E] leading-relaxed">
                By creating an account, using the Platform, purchasing a package, or sharing information with us, you consent to the practices described in this Privacy Policy. If you do not agree, please do not use the Platform.
              </p>
            </div>

            <div className="w-full h-px bg-[#E5E5E5]"></div>

            {/* Applicability */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Applicability and Scope</h2>
              <p className="text-[#57534E] leading-relaxed">
                This Privacy Policy applies to information collected from users in India who interact with Lean Protocol through the Platform, consultations, customer support, forms, messages/calls/emails, home lab collection coordination, medicine fulfillment coordination, and community participation. This policy is intended to align with applicable Indian laws, including the Digital Personal Data Protection Act, 2023 (“DPDP Act”) and rules/updates issued under it.
              </p>
            </section>

            {/* Definitions */}
            <section className="">
              <h2 className="font-serif text-2xl text-[#1F302B] mb-6">Definitions</h2>
             
                <p className="text-[#57534E] leading-relaxed">
                    <b>"Personal Data" </b>
                    means any data about an individual who is identifiable by or in relation to such data.
                </p>
                <p className="text-[#57534E] leading-relaxed">
                    <b>"Processing" </b>
                    means collection, storage, use, sharing, disclosure, transfer, deletion, or any other operation performed on Personal Data.
                </p>
                <p className="text-[#57534E] leading-relaxed">
                    <b>"Partners" </b>
                    means laboratories, pharmacies, payment processors, logistics partners, technology vendors, and other entities assisting Lean Protocol in delivering services.
                </p>
                <p className="text-[#57534E] leading-relaxed">
                    <b>"Care Team" </b>
                    means doctors, dieticians, trainers, psychologists, and other qualified experts engaged through the Platform.
                </p>
             
            </section>

            {/* Consent */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Consent and Your Choices</h2>
              <p className="text-[#57534E] mb-4 leading-relaxed">
                You provide consent through clear affirmative actions, such as onboarding, submitting information, using the Platform, or purchasing packages. You may choose not to provide certain information; however, this may limit or prevent us from providing services safely and effectively.
              </p>
              <p className="text-[#57534E] leading-relaxed">
                You may withdraw consent by writing to <a href="mailto:support@leanprotocol.in" className="text-dark/80 hover:underline font-bold">support@leanprotocol.in</a>. Withdrawal may result in our inability to continue services, especially where medical safety, prescriptions, or continuity of care require the information.
              </p>
            </section>

            {/* Info We Collect */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-6">Information We Collect</h2>
              <p className="text-[#57534E] mb-4">We may collect the following categories of Personal Data depending on how you use Lean Protocol:</p>
              
                <ul className="space-y-1 mb-4 text-[#57534E] list-disc pl-2">
                <li className="ml-3">
                    Identity and contact information such as name, age/date of birth, gender, phone number, email address, and address/location details needed for services.
                </li>
                <li className="ml-3">
                 Account information such as login credentials and profile details. Passwords are not stored in plain text.
                </li>
                <li className="ml-3">
                    Health and lifestyle information such as height, weight, BMI, goals, medical history, allergies, medications, comorbidities, symptoms, side effects, diet preferences, activity level, sleep, stress, and other inputs you share.
                </li>
                <li className="ml-3">
                    Consultation and care records such as doctor/nutritionist/trainer/psychologist notes, assessments, plans, follow-ups, prescriptions, and progress tracking.
                </li>
                <li className="ml-3">
                    Diagnostics information such as lab test orders and reports received from partner labs, including home collection details where applicable.
                </li>
                <li className="ml-3">
                    Smart scale data automatically synced through the Platform, including weight measurements and related logs captured through device integration.
                </li>
                <li className="ml-3">
                    Payment and transaction information such as payment status, transaction references, and package details. Card/bank credentials are typically processed by our payment gateway and are not stored by Lean Protocol.
                </li>
                <li className="ml-3">
                    Device and usage information such as IP address, device identifiers, app version, browser type, pages/screens used, time spent, feature usage, crash reports, and diagnostic logs.
                </li>
                <li className="ml-3">
                    Communications such as messages, emails, chats, calls, feedback, and support tickets.
                </li>
                 <li className="ml-3">
                    Community information such as posts/comments you make in community spaces, subject to moderation and safety rules.
                </li>
              </ul>
            </section>

            {/* <div className="w-full h-px bg-[#E5E5E5]"></div> */}

            {/* Collection Methods */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">How We Collect Information</h2> 
              <p className="text-[#57534E] mb-4">We collect information in the following ways:</p>
             
              <ul className="space-y-1 mb-4 text-[#57534E] list-disc pl-2">
                {[
                    "Directly from you when you sign up, fill onboarding forms, complete questionnaires, purchase packages, chat with the team, or participate in consultations.",
                    "Automatically through technology when you use the Platform, including cookies and similar tools (primarily for functionality and analytics).",
                    "From your Care Team when they create notes, plans, or medical records during service delivery.",
                    "From partner labs when test results are shared for inclusion in your health record.",
                    "From partner pharmacies and logistics partners for medicine fulfillment and delivery coordination where included in your package.",
                    "From payment partners when they confirm payment success/failure and related transaction references.",
                    "From integrated devices (including smart scales) when you connect them and enable syncing through the Platform."
                ].map((item, i) => (
                    <li key={i} className="ml-3">
                        {item}
                    </li>
                ))}
              </ul>
            </section>

            {/* Usage */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">How We Use Your Information</h2>
              <p className="text-[#57534E] mb-4">We use your Personal Data for purposes including:</p>
              <ul className="space-y-1 mb-4 text-[#57534E] list-disc pl-2">
                 <li className="ml-3">Providing services such as onboarding, consultations, creating plans, monitoring progress, and coordinating care across experts.</li>
                 <li className="ml-3">Clinical safety and suitability checks, including determining eligibility and ensuring appropriate medical oversight.</li>
                 <li className="ml-3">Coordinating lab tests and receiving reports from partner labs.</li>
                 <li className="ml-3">Facilitating prescription-based medicine fulfillment through partner pharmacies where part of your package and clinically prescribed.</li>
                 <li className="ml-3">Operating and improving the Platform, including feature development, troubleshooting, analytics, and user experience improvements.</li>
                 <li className="ml-3">Customer support, including resolving issues, appointment coordination, scheduling, reminders, and service communications.</li>
                 <li className="ml-3">Payments, billing, invoices/receipts, refunds (where applicable), fraud prevention, and transaction verification.</li>
                 <li className="ml-3">Compliance with applicable laws, lawful requests, and enforcement of our Terms & Conditions.</li>
                 <li className="ml-3">Internal quality checks and training, including maintaining care continuity and service standards.</li>
                 <li className="ml-3">Marketing communications, where permitted by law and your preferences, including updates, offers, and educational content. You may opt out of promotional communications by following the unsubscribe option (where available) or writing to support.</li>
              </ul>
            </section>

            {/* Recording of Consultations & Community Visibility and Safe Sharing */}
            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Recording of Consultations</h2>
              <p className="text-[#57534E] leading-relaxed">
              From time to time, Lean Protocol may record certain consultations or chats for quality, training, compliance, and continuity of records. Where recording occurs, it will be made known to you. If you do not wish to be recorded, you may inform us before the consultation begins; where feasible, we will provide an alternative.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Community Visibility and Safe Sharing</h2>
              <p className="text-[#57534E] leading-relaxed">
             Community features are designed for support and accountability. Posts, comments, and messages you share in community spaces may be visible to other members or moderators. You should avoid posting sensitive medical details, personal identifiers, or confidential information in community spaces. Lean Protocol is not responsible for information you voluntarily choose to disclose to others in community areas. </p>
            </section>

            {/* Sharing */}
            <section className="">
              <h2 className="font-serif text-2xl text-[#1F302B] mb-4">Sharing of Information</h2>
              <p className="text-[#57534E] leading-relaxed mb-4"><b>We do not sell your Personal Data.</b> We may share Personal Data only as necessary for delivering services and for lawful purposes, including:</p>
                 <ul className="space-y-1 mb-4 text-[#57534E] list-disc pl-2">
                <li className="ml-3">
                    With the Care Team so they can provide consultations, monitor progress, and coordinate your plan.
                </li>
                <li className="ml-3">
                    With partner labs to schedule collections/tests and deliver reports.
                </li>
                <li className="ml-3">
                    With partner pharmacies to dispense and deliver prescribed medicines, including necessary delivery details.
                </li>
                <li className="ml-3">
                    With payment partners such as <b>Razorpay</b> to process payments and verify transactions.
                </li>
                <li className="ml-3">
                    With logistics and delivery partners to deliver medicines or kits where applicable.
                </li>
                <li className="ml-3">
                    With technology vendors and service providers that help us host, secure, analyze, and operate the Platform, under appropriate contractual safeguards.
                </li>
                <li className="ml-3">
                    With legal/regulatory authorities where required by law, court order, or to protect rights, safety, and prevent fraud or misuse.
                </li>
                <li className="ml-3">
                    In a business transfer scenario such as merger, acquisition, financing, or restructuring, where user information may be shared as part of due diligence and transfer, subject to confidentiality and lawful safeguards.
                </li>
              </ul>
            </section>

             <div className="w-full h-px bg-[#E5E5E5]"></div>

            {/* Final Legal Blocks */}
            <div className="space-y-6">
                  <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Cross-Border Transfers</h3>
                    <p className="text-[#57534E]">Your data may be processed using cloud and technology infrastructure that could involve storage or processing in locations outside India, depending on service providers. Where cross-border processing occurs, we take reasonable steps to ensure contractual and security safeguards consistent with this Privacy Policy and applicable law.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Cookies and Similar Technologies</h3>
                    <p className="text-[#57534E]">We may use cookies and similar technologies to enable essential Platform functions, remember preferences, and understand usage patterns for analytics and improvement. You can manage cookies through your browser/device settings. Disabling cookies may affect certain features.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Data Security</h3>
                    <p className="text-[#57534E]">We use reasonable security practices designed to protect your Personal Data, such as access controls, role-based permissions, secure authentication, and encryption practices where appropriate. Access to health information is restricted to authorized personnel and Care Team members on a need-to-know basis.
No system is completely secure. While we take reasonable measures, we cannot guarantee absolute security of information transmitted or stored electronically.
</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Data Accuracy</h3>
                    <p className="text-[#57534E]">You are responsible for ensuring information you provide is accurate and up to date. Incorrect or incomplete health information may impact safety and care quality.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Under-18 Users</h3>
                    <p className="text-[#57534E]">Lean Protocol is intended for individuals aged 18 years and above. We do not knowingly collect Personal Data from individuals under 18. If you believe a minor has provided data to us, please write to <a href="mailto:support@leanprotocol.in" className="text-dark/80 hover:underline font-bold">support@leanprotocol.in</a> and we will take reasonable steps to delete such data.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Your Rights and Requests</h3>
                    <p className="text-[#57534E]">Subject to applicable law, you may request access to or correction of your Personal Data and withdraw consent. To make a request, write to <a href="mailto:support@leanprotocol.in" className="text-dark/80 hover:underline font-bold">support@leanprotocol.in</a>. For safety and security, we may verify identity before acting on requests.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Third-Party Links</h3>
                    <p className="text-[#57534E]">The Platform may contain links to third-party websites or services. Their privacy practices are governed by their own policies. Lean Protocol is not responsible for third-party privacy practices.</p>
                </section>
                <section>
                    <h3 className="font-bold text-[#1F302B] mb-2">Changes to This Privacy Policy</h3>
                    <p className="text-[#57534E]">We may update this Privacy Policy from time to time. We will update the “Last Updated” date and may provide in-app or other notices where appropriate. Continued use after updates indicates acceptance of the revised Privacy Policy.</p>
                </section>
            </div>

            {/* Contact Footer */}
            <div className="bg-[#1F302B] rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-serif text-2xl mb-2">Contact</h3>
                    <p className="opacity-70 text-sm">For questions, requests, or concerns relating to privacy, contact</p>
                </div>
                <Link href="mailto:support@leanprotocol.in">
                    <button className="flex items-center gap-2 cursor-pointer bg-white text-[#1F302B] px-6 py-3 rounded-lg font-medium hover:bg-[#F6F1EE] transition-colors">
                        <Mail className="w-4 h-4" />
                        support@leanprotocol.in
                    </button>
                </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

