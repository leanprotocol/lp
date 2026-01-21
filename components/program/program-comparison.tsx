import { Check, X } from 'lucide-react';

const features = [
  'Program designed by industry leading experts in weight loss medicine',
  'Treats the root cause of your weight challenges',
  'Provides an integrative weight loss plan'
];

export default function ProgramComparison() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-14">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="heading">
            The Lean Protocol difference
          </h2>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-200">
                <th className="mb-6 text-left w-1/2"></th>
                <th className="mb-6 text-center w-1/6 rounded-2xl">
                  <span className="font-serif text-lg text-dark font-semibold ">Lean</span>
                </th>
                <th className="pb-6 text-center w-1/6">
                  <span className="font-sans text-lg text-black leading-1 font-light">
                    Traditional weight<br />loss apps
                  </span>
                </th>
                <th className="pb-6 text-center w-1/6">
                  <span className="font-sans text-lg text-black leading-1 font-light">
                    Brick + mortar<br />primary care
                  </span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-gray-200">
                  {/* Feature Name */}
                  <td className="py-4 pr-4">
                    <span className="font-sans text-base text-black font-normal">
                      {feature}
                    </span>
                  </td>

                  {/* Lean Protocol Column - Checkmark with BG */}
                  <td className="py-4 text-center">
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  </td>

                  {/* Traditional Apps Column - X */}
                  <td className="py-4 text-center">
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <X className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  </td>

                  {/* Brick + Mortar Column - X */}
                  <td className="py-4 text-center">
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <X className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
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
