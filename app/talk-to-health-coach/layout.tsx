import { MetaPixel } from "@/components/meta-pixel";

/* Meta pixel for the coach funnel. Without it the events in coach-funnel.tsx went nowhere. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MetaPixel />
      {children}
    </>
  );
}
