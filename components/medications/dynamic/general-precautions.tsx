"use client";

import { 
  AlertCircle, 
  AlertTriangle, 
  Ban, 
  Activity, 
  Stethoscope 
} from "lucide-react";

export default function GeneralPrecautions() {
  return (
    <section className="w-full bg-background py-10 md:py-18">
      <div className="max-w-7xl mx-auto px-4 md:px-14 space-y-12">
        
        {/* --- Main Title --- */}
        <div className="border-b border-[#1F302B] pb-6">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1F302B] leading-tight">
            General Precautions and Side Effects for All Medications
          </h2>
        </div>

        {/* --- Section 1 --- */}
        <div className="space-y-4">
          <div className="flex items-start md:items-center gap-3">
            <AlertCircle className="w-6 h-6 text-[#1F302B] shrink-0 mt-1 md:mt-0" />
            <h3 className="font-bold text-[#1F302B] text-xl uppercase tracking-wide">
              Common Side Effects (Temporary and Usually Manageable)
            </h3>
          </div>
          <p className="text-[#57534E] leading-relaxed pl-9">
            Most side effects from these medications are mild to moderate and tend to improve within the first few weeks as your body adjusts. The most common side effects across all these medications include nausea (especially when starting or increasing doses), constipation or diarrhea, loss of appetite (beyond the intended effect), and mild headaches. Some people experience taste changes or mild fatigue. These symptoms are typically manageable and don't require stopping the medication.
          </p>
          <ul className="list-disc pl-14 space-y-2 text-[#57534E] marker:text-[#1F302B]">
            <li>Nausea or mild vomiting (most common in first 2-4 weeks)</li>
            <li>Constipation or diarrhea (often improves with adequate water intake)</li>
            <li>Loss of appetite or food aversions</li>
            <li>Mild headaches or dizziness</li>
            <li>Abdominal pain or discomfort</li>
            <li>Fatigue or low energy (temporary)</li>
            <li>Stomach bloating or gas</li>
            <li>Changes in taste perception</li>
          </ul>
          <p className="text-[#1F302B] font-medium pt-2 pl-9">
            Management tips: Stay well-hydrated, eat slowly, avoid greasy foods, and inform your doctor if side effects persist beyond 3-4 weeks.
          </p>
        </div>

        {/* --- Section 2 --- */}
        <div className="space-y-4 border-t border-[#1F302B]/10 pt-8">
          <div className="flex items-start md:items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-[#1F302B] shrink-0 mt-1 md:mt-0" />
            <h3 className="font-bold text-[#1F302B] text-xl uppercase tracking-wide">
              Serious Warning Signs (Seek Medical Attention Immediately)
            </h3>
          </div>
          <p className="text-[#57534E] leading-relaxed pl-9">
            While rare, some serious side effects require immediate medical attention. These include persistent severe pain in the upper abdomen (possible pancreatitis), vomiting that doesn't stop, signs of thyroid cancer (lump in neck, difficulty swallowing), rapid heartbeat, severe dizziness or fainting, or allergic reactions like difficulty breathing or swelling of face and tongue. These medications are not suitable for anyone with a personal or family history of medullary thyroid cancer or Multiple Endocrine Neoplasia Syndrome Type 2.
          </p>
          <ul className="list-disc pl-14 space-y-2 text-[#57534E] marker:text-[#1F302B]">
            <li>Sudden severe abdominal or back pain</li>
            <li>Persistent vomiting or inability to keep food down</li>
            <li>Lump or swelling in the neck area</li>
            <li>Difficulty swallowing or hoarseness in voice</li>
            <li>Rapid heartbeat or chest pain</li>
            <li>Severe dizziness, fainting, or confusion</li>
            <li>Allergic reactions: difficulty breathing, swelling of face/throat/lips</li>
            <li>Signs of low blood sugar: shakiness, sweating, severe fatigue</li>
          </ul>
        </div>

        {/* --- Section 3 --- */}
        <div className="space-y-4 border-t border-[#1F302B]/10 pt-8">
          <div className="flex items-start md:items-center gap-3">
            <Ban className="w-6 h-6 text-[#1F302B] shrink-0 mt-1 md:mt-0" />
            <h3 className="font-bold text-[#1F302B] text-xl uppercase tracking-wide">
              Important Restrictions and Precautions
            </h3>
          </div>
          <p className="text-[#57534E] leading-relaxed pl-9">
            These medications are absolutely contraindicated (not recommended at all) in pregnancy and breastfeeding, as they can harm the fetus or newborn. If you're planning to conceive, discuss stopping the medication at least two months before trying to get pregnant. They're also not suitable for anyone with insulin-dependent Type 1 diabetes or a history of thyroid cancer. Those with a family history of thyroid cancer should discuss risks with their doctor before starting. Additionally, if you're taking insulin or certain other diabetes medications, your doses may need adjustment.
          </p>
          <ul className="list-disc pl-14 space-y-2 text-[#57534E] marker:text-[#1F302B]">
            <li>Pregnancy and breastfeeding: Absolutely not safe; discuss family planning with your doctor</li>
            <li>Thyroid cancer: Not safe if you have personal or family history</li>
            <li>Type 1 diabetes: Not suitable; insulin-dependent diabetes requires different management</li>
            <li>Insulin use: May require insulin dose reduction; must be monitored by doctor</li>
            <li>Pancreatitis history: Discuss with doctor; may not be suitable</li>
            <li>Gallbladder disease: Report to your doctor; may need extra monitoring</li>
            <li>Severe kidney or liver disease: May require dose adjustments or different medication</li>
          </ul>
        </div>

        {/* --- Section 4 --- */}
        <div className="space-y-4 border-t border-[#1F302B]/10 pt-8">
          <div className="flex items-start md:items-center gap-3">
            <Activity className="w-6 h-6 text-[#1F302B] shrink-0 mt-1 md:mt-0" />
            <h3 className="font-bold text-[#1F302B] text-xl uppercase tracking-wide">
              Drug Interactions and Lifestyle Considerations
            </h3>
          </div>
          <p className="text-[#57534E] leading-relaxed pl-9">
            These medications can interact with other medicines you're taking, particularly other diabetes medications, blood pressure medications, and certain psychiatric medications. Alcohol consumption should be minimized as it can cause dangerous blood sugar drops when combined with these medications. These medications are most effective when combined with lifestyle changes including balanced diet, regular exercise, and stress management. Sudden discontinuation can lead to rapid weight regain, so any changes should be discussed with your doctor first.
          </p>
          <ul className="list-disc pl-14 space-y-2 text-[#57534E] marker:text-[#1F302B]">
            <li>Inform your doctor of all other medications and supplements you're taking</li>
            <li>Limit alcohol consumption to prevent blood sugar complications</li>
            <li>Continue healthy eating habits; medication works best with proper nutrition</li>
            <li>Maintain regular physical activity for optimal results</li>
            <li>Manage stress, as stress hormones can interfere with the medication</li>
            <li>Stay well-hydrated throughout the day</li>
            <li>Get adequate sleep, as poor sleep affects weight and appetite hormones</li>
            <li>Regular follow-up appointments are essential for dose adjustment and monitoring</li>
          </ul>
        </div>

        {/* --- Section 5 --- */}
        <div className="space-y-4 border-t border-[#1F302B]/10 pt-8">
          <div className="flex items-start md:items-center gap-3">
            <Stethoscope className="w-6 h-6 text-[#1F302B] shrink-0 mt-1 md:mt-0" />
            <h3 className="font-bold text-[#1F302B] text-xl uppercase tracking-wide">
              When to Contact Your Doctor
            </h3>
          </div>
          <p className="text-[#57534E] leading-relaxed pl-9">
            Regular check-ins with your healthcare provider are crucial for safe and effective use of these medications. You should schedule follow-up appointments every 4-6 weeks initially to monitor how your body is responding and adjust doses if needed. Contact your doctor immediately if you experience any of the warning signs mentioned above, or if side effects become unbearable and don't improve after the first few weeks. Additionally, if your weight loss plateaus or if you develop new health concerns, discuss these with your doctor before making any changes to your medication.
          </p>
          <ul className="list-disc pl-14 space-y-2 text-[#57534E] marker:text-[#1F302B]">
            <li>First follow-up: 2-4 weeks after starting</li>
            <li>Ongoing: Every 4-6 weeks for dose adjustments and monitoring</li>
            <li>Discuss any persistent side effects lasting more than 4 weeks</li>
            <li>Report any new health concerns or medication interactions</li>
            <li>Annual: Comprehensive health check including blood work</li>
            <li>Before conception: At least 2 months before trying to get pregnant</li>
            <li>Immediately: Any serious symptoms listed in the warning signs section</li>
          </ul>
        </div>

      </div>
    </section>
  );
}