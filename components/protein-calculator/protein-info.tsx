/**
 * The explanation under the protein calculator on /protein-calculator.
 *
 * The figures here are clinical copy. They match the calculator above
 * (content/tools.ts - protein): change both together, and have a doctor or
 * dietitian confirm any change.
 */

/* grams of protein per kg of body weight per day */
const RANGES = [
  { goal: "Staying at your weight", range: "0.83 \u2013 1.0 g per kg" },
  { goal: "Losing weight", range: "1.2 \u2013 1.6 g per kg" },
  { goal: "Building muscle", range: "1.4 \u2013 2.0 g per kg" },
];

/* Rounded from the Indian Food Composition Tables 2017 (National Institute of
   Nutrition), which give protein per 100 g of uncooked food. */
const FOODS = [
  { food: "Chicken", portion: "100 g, uncooked", protein: "22 g" },
  { food: "Fish (rohu)", portion: "100 g, uncooked", protein: "20 g" },
  { food: "Paneer", portion: "100 g", protein: "19 g" },
  { food: "Soya bean", portion: "30 g, dry", protein: "11 g" },
  { food: "Milk", portion: "1 glass, 250 ml", protein: "8 g" },
  { food: "Dal (tur or moong)", portion: "1 katori, from 30 g dry dal", protein: "7 g" },
  { food: "Peanuts", portion: "30 g, a small handful", protein: "7 g" },
  { food: "Egg", portion: "1 whole", protein: "6 g" },
  { food: "Rajma", portion: "1 katori, from 30 g dry rajma", protein: "6 g" },
  { food: "Rice", portion: "1 katori, from 50 g dry rice", protein: "4 g" },
  { food: "Roti", portion: "1 medium, 30 g atta", protein: "3 g" },
];

const HOW = [
  "It multiplies your body weight in kg by a number of grams of protein per kg. The number depends on your goal.",
  "To stay at your weight: 0.83 to 1.0 g per kg. 0.83 g is the daily allowance for Indian adults set by ICMR-NIN in 2020. The higher figure allows for meals built mostly on cereals, where the body uses the protein less well.",
  "To lose weight: 1.2 to 1.6 g per kg. This is the range studied in weight-loss diets for holding on to muscle while fat is lost.",
  "To build muscle: 1.4 to 2.0 g per kg, the range sports-nutrition experts give for people who train regularly.",
  "If your BMI is above 23, the calculator uses the weight you would have at BMI 23 for your height. Protein needs follow your muscles and organs, not body fat, so your full weight would give too high a figure.",
];

const SPREAD = [
  "Aim for about 25 to 30 g of protein at each main meal, not most of it at dinner.",
  "If a meal is mostly roti, rice, poha or upma, add a protein food to it: eggs, paneer, dal, sprouts, curd, milk, chicken or fish.",
  "Do strength exercise at least twice a week. Protein and strength training work together to keep muscle while you lose weight.",
];

const EXCEPTIONS = [
  { who: "Kidney disease.", text: "People with reduced kidney function are often told to limit protein. Do not raise yours without your doctor." },
  { who: "Pregnancy and breastfeeding.", text: "Needs are higher and are worked out differently. This calculator does not cover them." },
  { who: "Under 18.", text: "Children and teenagers are still growing. This calculator is for adults." },
  { who: "Over 65.", text: "Experts advise at least 1.0 to 1.2 g per kg a day, even when you are not trying to lose weight." },
  { who: "On a weight-loss medicine or after weight-loss surgery.", text: "Appetite is low, so your doctor or dietitian should set the target." },
];

export default function ProteinInfo() {
  return (
    <section className="w-full bg-white py-20 px-4 md:px-8 border-t border-[#1F302B]/10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-12 max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1F302B] mb-6">
            How much protein do you need in a day?
          </h2>
          <p className="text-[#57534E] text-lg leading-relaxed">
            The answer depends mostly on your body weight and on what you want to do: hold your weight, lose fat or build muscle. The calculator above gives you a range in grams per day. This is how it gets there, and how to reach it with everyday Indian food.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-[#1F302B]/10 pt-12">

          {/* left */}
          <div className="lg:col-span-7 space-y-12">

            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#1F302B]">
                How the calculator works
              </h3>
              <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                {HOW.map((t) => (
                  <li key={t} className="pl-2">{t}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#1F302B]">
                Spread it across the day
              </h3>
              <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                {SPREAD.map((t) => (
                  <li key={t} className="pl-2">{t}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#1F302B]">
                When these figures do not fit
              </h3>
              <ul className="space-y-3 text-[#57534E] list-disc pl-5 marker:text-[#1F302B]/30">
                {EXCEPTIONS.map((e) => (
                  <li key={e.who} className="pl-2">
                    <strong className="text-[#1F302B]">{e.who}</strong> {e.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* formula */}
            <div className="w-full bg-background rounded-2xl p-6">
              <h3 className="font-bold text-[#1F302B] text-base mb-6">
                Formula:
              </h3>
              <p className="font-serif text-base text-[#1F302B] mb-8">
                <span className="font-bold tracking-tight">Protein per day</span> = body weight (kg) {"\u00D7"} grams per kg
              </p>
              <div className="text-[#1F302B] text-base font-light border-t border-[#1F302B]/10 pt-8">
                <span className="font-medium mr-2">Example:</span>
                For 66 kg and losing weight,
                <p className="font-serif">
                  66 {"\u00D7"} 1.2 = <strong>79 g</strong> to 66 {"\u00D7"} 1.6 = <strong>106 g</strong> a day
                </p>
              </div>
            </div>

          </div>

          {/* right */}
          <div className="lg:col-span-5">

            <div className="border border-[#1F302B]/10 rounded-2xl bg-white">
              <div className="bg-[#1F302B] p-6 text-white rounded-t-2xl">
                <h3 className="font-serif text-xl">
                  Protein per kg of body weight, per day
                </h3>
              </div>
              <div className="divide-y divide-[#1F302B]/10">
                {RANGES.map((r) => (
                  <div key={r.goal} className="flex flex-col sm:flex-row justify-between sm:items-center p-4">
                    <span className="font-bold text-[#1F302B] text-sm mb-1 sm:mb-0">
                      {r.goal}
                    </span>
                    <span className="font-mono text-[#5B746F] text-sm bg-[#1F302B]/5 px-2 py-1 rounded">
                      {r.range}
                    </span>
                  </div>
                ))}
                <p className="p-4 text-sm text-[#57534E]">
                  If your BMI is above 23, use the weight you would have at BMI 23 for your height.
                </p>
              </div>
            </div>

            <div className="border border-[#1F302B]/10 rounded-2xl bg-white mt-8">
              <div className="bg-[#1F302B] p-6 text-white rounded-t-2xl">
                <h3 className="font-serif text-xl">
                  Protein in everyday Indian foods
                </h3>
              </div>
              <div className="divide-y divide-[#1F302B]/10">
                {FOODS.map((f) => (
                  <div key={f.food} className="flex justify-between items-center gap-4 p-4">
                    <span className="text-sm">
                      <span className="font-bold text-[#1F302B]">{f.food}</span>
                      <span className="block text-[#57534E]">{f.portion}</span>
                    </span>
                    <span className="flex-none font-mono text-[#5B746F] text-sm bg-[#1F302B]/5 px-2 py-1 rounded">
                      {f.protein}
                    </span>
                  </div>
                ))}
                <p className="p-4 text-sm text-[#57534E]">
                  Rounded from the Indian Food Composition Tables 2017 (National Institute of Nutrition). The tables list uncooked food, so cooked portions are estimates.
                </p>
              </div>
            </div>

          </div>

        </div>

        <p className="mt-12 border-t border-[#1F302B]/10 pt-8 text-sm leading-relaxed text-[#57534E]">
          Sources: ICMR-NIN, Nutrient Requirements for Indians (2020). Leidy and others, The role of protein in weight loss and maintenance, American Journal of Clinical Nutrition (2015). International Society of Sports Nutrition position stand on protein and exercise (2017). PROT-AGE Study Group, protein intake in older people (2013). Indian Food Composition Tables (2017). This page is general information and is not medical advice.
        </p>

      </div>
    </section>
  );
}
