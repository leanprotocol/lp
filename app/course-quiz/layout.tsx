import { MetaPixel } from "@/components/meta-pixel";

/* Meta pixel for the quiz funnel. Without it the events in quiz-funnel.tsx went nowhere. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MetaPixel />
      {children}
    </>
  );
}
