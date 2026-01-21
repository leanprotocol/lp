"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { JSX } from "react/jsx-runtime" // Declare JSX variable

/**
 * Medication disclaimers section with tabbed interface
 * Displays box warnings, side effects, and drug interactions
 */

interface DisclaimerContent {
  id: string
  label: string
  content: JSX.Element
}

const medications = [
  { id: "zepbound", name: "Zepbound®" },
  { id: "wegovy", name: "Wegovy®" },
  { id: "ozempic", name: "Ozempic®" },
  { id: "mounjaro", name: "Mounjaro®" },
  { id: "saxenda", name: "Saxenda®" },
]

const zepboundDisclaimers: DisclaimerContent[] = [
  {
    id: "box-warning",
    label: "BOX WARNING",
    content: (
      <>
        <h3 className="font-serif text-xl mb-4">BLACK BOX WARNING:</h3>
        <p className="mb-4">
          Tirzepatide, the active ingredient in Zepbound, is contraindicated in individuals with a history of medullary
          thyroid carcinoma, a family history of such, or in patients with multiple endocrine neoplasia syndrome Type 2.
          Do not take it if you have ever had thyroid cancer. In studies with rodents, tirzepatide caused thyroid
          tumors, including thyroid cancer; it is not known if it will cause thyroid tumors or cancer in humans. Please
          notify your doctor ASAP if you develop trouble swallowing, hoarseness, a lump or swelling in your neck, or
          shortness of breath.
        </p>
        <p className="font-bold mb-4">
          If you experience a medical emergency, call 911 or go to the nearest emergency room.
        </p>
        <p className="mb-4">Tell your health care provider about your medical history prior to taking Zepbound.</p>
        <p className="mb-4">
          Avoid alcohol while taking this medication. If you're taking diabetes medications, please discuss this with
          your prescribing doctor before starting Zepbound, as your diabetes medications may need to be adjusted as you
          lose weight.
        </p>
        <p className="mb-4">
          People of childbearing age should use reliable birth control while taking this medication. Use a non-oral
          contraceptive method (instead of an oral contraceptive). If you use oral contraception, add a barrier method
          of contraception during the first four weeks after initiation and for four weeks after dose escalation.
        </p>
        <p className="mb-4">
          This medication may cause fetal harm. Do not take this medication if pregnant, trying to get pregnant, or
          breastfeeding. If you plan to become pregnant, this medication needs to be stopped at least two months before
          trying. Notify your doctor if you have kidney, liver, or pancreas problems.
        </p>
        <p className="mb-4">
          Stop using Zepbound and call your health care provider immediately if you have severe stomach or abdomen pain
          that will not go away, with or without vomiting.
        </p>
        <p className="mb-4">
          Stop using Zepbound and get medical help right away if you have any symptoms of a serious allergic reaction,
          including swelling of your face, lips, tongue, or throat; problems breathing or swallowing; severe rash or
          itching; fainting or feeling dizzy; or a very rapid heartbeat.
        </p>
        <p>
          Severe hypersensitivity reactions (e.g., anaphylaxis and angioedema) have been reported. Discontinue Zepbound
          if suspected and promptly seek medical advice.
        </p>
      </>
    ),
  },
  {
    id: "warning",
    label: "WARNING",
    content: (
      <p className="text-base leading-relaxed">
        Common side effects include nausea, vomiting, diarrhea, constipation, and abdominal pain. Please consult your
        healthcare provider for a complete list of side effects and warnings.
      </p>
    ),
  },
  {
    id: "side-effects",
    label: "SIDE EFFECTS",
    content: (
      <p className="text-base leading-relaxed">
        Most common side effects include nausea, diarrhea, decreased appetite, vomiting, constipation, indigestion, and
        stomach pain. Report any severe or persistent side effects to your healthcare provider.
      </p>
    ),
  },
  {
    id: "drug-interactions",
    label: "DRUG INTERACTIONS",
    content: (
      <p className="text-base leading-relaxed">
        Zepbound may interact with insulin and other diabetes medications. It may also affect the absorption of oral
        medications. Discuss all medications you're taking with your healthcare provider before starting Zepbound.
      </p>
    ),
  },
]

export function MedicationDisclaimers() {
  const [selectedMedication, setSelectedMedication] = useState("zepbound")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("box-warning")

  const currentMedication = medications.find((m) => m.id === selectedMedication)
  const activeContent = zepboundDisclaimers.find((d) => d.id === activeTab)

  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#E8E4B8" }}>
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12">
            {/* Left side - Title and dropdown */}
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-balance">Medication disclaimers</h2>

              {/* Medication selector dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-[#2C3E3C] text-white px-6 py-4 rounded-full flex items-center justify-between hover:bg-[#3d5250] transition-colors"
                >
                  <span className="font-medium">{currentMedication?.name}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-10">
                    {medications.map((med) => (
                      <button
                        key={med.id}
                        onClick={() => {
                          setSelectedMedication(med.id)
                          setIsDropdownOpen(false)
                        }}
                        className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100"
                      >
                        {med.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Tabs and content */}
            <div>
              {/* Tab navigation */}
              <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                {zepboundDisclaimers.map((disclaimer) => (
                  <button
                    key={disclaimer.id}
                    onClick={() => setActiveTab(disclaimer.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                      activeTab === disclaimer.id ? "text-[#2C3E3C]" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {disclaimer.label}
                    {activeTab === disclaimer.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2C3E3C]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Content area */}
              <div className="prose prose-base max-w-none text-gray-700">{activeContent?.content}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
