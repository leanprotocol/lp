import {
  UserPlus,
  CalendarCheck,
  Stethoscope,
  ShieldCheck,
  FlaskConical,
  Truck,
  Languages,
  BarChart3,
} from "lucide-react"
import { FEATURES } from "@/content/psp"

/**
 * The capability grid.
 *
 * Eight things the programme does, at a glance. Sits between the narrative
 * sections and the care areas, for the reader who is scanning rather than
 * reading.
 *
 * Icons are mapped here rather than in content/psp.ts so that file stays
 * free of imports and a copy edit never touches a component.
 */
const ICONS = {
  enrol: UserPlus,
  adherence: CalendarCheck,
  clinical: Stethoscope,
  safety: ShieldCheck,
  labs: FlaskConical,
  delivery: Truck,
  language: Languages,
  data: BarChart3,
} as const

export function PspFeatures() {
  return (
    <section className="sec sec-ivory" id="features">
      <div className="wrap">
        <div className="psp-feat-head">
          <p className="label">{FEATURES.label}</p>
          <h2>{FEATURES.h2}</h2>
          <p className="psp-feat-intro">{FEATURES.intro}</p>
        </div>

        <div className="psp-feat-grid">
          {FEATURES.items.map((f) => {
            const Icon = ICONS[f.icon as keyof typeof ICONS]
            return (
              <div className="psp-feat" key={f.title}>
                <span className="psp-feat-icon" aria-hidden>
                  <Icon size={38} strokeWidth={1.6} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.copy}</p>
              </div>
            )
          })}
        </div>

        <p className="psp-feat-note">{FEATURES.note}</p>
      </div>
    </section>
  )
}
