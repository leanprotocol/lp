import { Check, X } from 'lucide-react';

const comparisonData = [
  {
    feature: 'Doctor Consultation & GLP-1 Prescription',
    leanProtocol: true,
    others: true
  },
  {
    feature: 'Lower Appetite',
    leanProtocol: true,
    others: true
  },
  {
    feature: 'Regular Side-effects Monitoring & Management by Doctors',
    leanProtocol: true,
    others: false
  },
  {
    feature: 'Psychologist sessions',
    leanProtocol: true,
    others: false
  },
  {
    feature: 'Nutritionist Guidance for Eating & Habit Change',
    leanProtocol: true,
    others: false
  },
  {
    feature: 'Workout Programme for Fat Loss, Mobility and Strength',
    leanProtocol: true,
    others: false
  },
  {
    feature: 'Dedicated Accountability Buddy',
    leanProtocol: true,
    others: false
  },
  {
    feature: 'Local community access with bi-weekly activities',
    leanProtocol: true,
    others: false
  },
  {
    feature: 'Foundational Metabolic Diagnosis',
    leanProtocol: true,
    others: false
  },
  {
    feature: 'Money Back Guarantee',
    leanProtocol: true,
    others: false
  },
];

export default function PricingSection() {
  return (
    <section className="py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-14">

        <div className="text-center mb-10 md:mb-12 max-w-4xl mx-auto">
          <h2 className="heading ">
            Medication is just one piece of the puzzel but we solve it differently
          </h2>
          <p className='sub-heading text-black/70 mt-4 md:mt-2 text-sm md:text-base'>
            Lean Protocol vs. Others </p>
        </div>

        {/* Comparison Container */}
        <div className="bg-white/50 rounded-3xl md:rounded-4xl p-1 md:p-8">
          
          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-4">
             {/* Header Row for Mobile */}
             <div className="grid grid-cols-4 gap-2 pb-2 mb-2 border-b border-gray-200 text-xs font-semibold text-center">
                <div className="col-span-2 text-left pl-2">Feature</div>
                <div className="col-span-1 text-dark">Lean Protocol</div>
                <div className="col-span-1 text-black/60">Others</div>
             </div>

            {comparisonData.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 items-center py-1 md:py-3 border-b border-gray-100 last:border-0">
                <div className="col-span-2 pr-2">
                   <span className="font-sans text-xs font-medium text-black leading-tight block">
                     {item.feature}
                   </span>
                </div>
                
                {/* Lean Protocol Status */}
                <div className="col-span-1 flex justify-center">
                    <div className="w-5 h-5 rounded-full bg-dark flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                </div>

                {/* Others Status */}
                <div className="col-span-1 flex justify-center">
                   {item.others ? (
                      <div className="w-5 h-5 rounded-full bg-dark flex items-center justify-center">
                         <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                         <X className="w-3 h-3 text-red-300" strokeWidth={3} />
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <table className="hidden md:table w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="mb-6 text-left w-1/2"></th>
                <th className="pb-4 text-center w-1/6 rounded-2xl">
                  <span className="font-serif text-lg text-dark font-semibold">
                    Lean Protocol
                  </span>
                </th>
                <th className="pb-4 text-center w-1/6">
                  <span className="font-sans text-lg text-black leading-1 font-light">
                    Regular GLP-1 Platforms
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 pr-4">
                    <span className="font-sans text-[15px] text-black font-normal">
                      {item.feature}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 rounded-full bg-dark flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex justify-center">
                      {item.others ? (
                        <div className="w-6 h-6 rounded-full bg-dark flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="w-4 h-4 text-red-300" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </section>
  );
}