import Image from "next/image";
import { UserRound } from "lucide-react";
import { team, isVerified } from "@/content/innovation";
import { Section, SectionHeading } from "./InnovationUI";

function initialsFrom(name: string) {
  if (!isVerified(name)) return null;
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TeamCapabilitySection() {
  return (
    <Section variant="surface">
      <SectionHeading eyebrow={team.eyebrow} title={team.headline} lead={team.note} />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.members.map((member) => {
          const named = isVerified(member.name);
          const initials = initialsFrom(member.name);

          return (
            <article key={member.role} className="inv-card h-full">
              <div className="flex items-center gap-3">
                <div
                  className="relative flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full"
                  style={{
                    background: "var(--inv-surface-2)",
                    color: "var(--inv-blue)",
                    border: "1px solid var(--inv-border)",
                  }}
                  aria-hidden={!member.photo}
                >
                  {/* Local photograph only. Never a generated or stock face. */}
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={named ? member.name : member.role}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : initials ? (
                    <span className="inv-num text-[15px]">{initials}</span>
                  ) : (
                    <UserRound size={20} aria-hidden />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="inv-marker">{member.role}</p>
                  {named ? (
                    <p className="text-[15px] font-semibold" style={{ color: "var(--inv-navy)" }}>
                      {member.name}
                    </p>
                  ) : (
                    <p className="inv-chip inv-chip--planned mt-1">{team.plannedRoleLabel}</p>
                  )}
                </div>
              </div>

              <p className="inv-body mt-3">{member.focus}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
