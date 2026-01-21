// "use client";

// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { FeaturedRailCard } from "@/components/blog/blog-cards";
// import type { BlogListItem } from "@/sanity/lib/posts.types";

// type Props = {
//   posts: BlogListItem[];
// };

// export default function BlogFeaturedRail({ posts }: Props) {
//   const scrollerRef = useRef<HTMLDivElement | null>(null);
//   const [isInteracting, setIsInteracting] = useState(false);
//   const [reduceMotion, setReduceMotion] = useState(false);

//   const loopPosts = useMemo(() => {
//     if (posts.length <= 1) return posts;
//     return [...posts, ...posts];
//   }, [posts]);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     const update = () => setReduceMotion(mq.matches);
//     update();

//     if (typeof mq.addEventListener === "function") {
//       mq.addEventListener("change", update);
//       return () => mq.removeEventListener("change", update);
//     }

//     mq.addListener(update);
//     return () => mq.removeListener(update);
//   }, []);

//   const scrollByAmount = useCallback((dir: -1 | 1) => {
//     const el = scrollerRef.current;
//     if (!el) return;
//     const amount = Math.max(280, Math.min(420, el.clientWidth * 0.6));
//     el.scrollBy({ left: dir * amount, behavior: "smooth" });
//   }, []);

//   useEffect(() => {
//     if (reduceMotion) return;
//     if (isInteracting) return;
//     const el = scrollerRef.current;
//     if (!el) return;

//     let raf = 0;
//     const speed = 0.35;

//     const tick = () => {
//       const node = scrollerRef.current;
//       if (node) {
//         node.scrollLeft += speed;

//         if (posts.length > 1) {
//           const resetAt = node.scrollWidth / 2;
//           if (node.scrollLeft >= resetAt) {
//             node.scrollLeft = 0;
//           }
//         }
//       }
//       raf = requestAnimationFrame(tick);
//     };

//     raf = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(raf);
//   }, [isInteracting, posts.length, reduceMotion]);

//   if (posts.length === 0) return null;

//   return (
//     <div className="relative">
//       <div
//         ref={scrollerRef}
//         className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
//         onMouseEnter={() => setIsInteracting(true)}
//         onMouseLeave={() => setIsInteracting(false)}
//         onFocusCapture={() => setIsInteracting(true)}
//         onBlurCapture={() => setIsInteracting(false)}
//       >
//         {loopPosts.map((post, idx) => (
//           <FeaturedRailCard key={`${post._id}-${idx}`} post={post} />
//         ))}
//       </div>

//       {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#F8F9FA] to-transparent" />
//       <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-[#F8F9FA] to-transparent" /> */}

//       {posts.length > 1 ? (
//         <>
//           <div className="absolute left-2 top-1/2 -translate-y-1/2">
//             <Button
//               type="button"
//               variant="outline"
//               size="icon"
//               className="rounded-full bg-background/80 backdrop-blur border-primary/20"
//               onClick={() => scrollByAmount(-1)}
//               onMouseEnter={() => setIsInteracting(true)}
//               onMouseLeave={() => setIsInteracting(false)}
//               aria-label="Scroll featured posts left"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//           </div>
//           <div className="absolute right-2 top-1/2 -translate-y-1/2">
//             <Button
//               type="button"
//               variant="outline"
//               size="icon"
//               className="rounded-full bg-background/80 backdrop-blur border-primary/20"
//               onClick={() => scrollByAmount(1)}
//               onMouseEnter={() => setIsInteracting(true)}
//               onMouseLeave={() => setIsInteracting(false)}
//               aria-label="Scroll featured posts right"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </>
//       ) : null}
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FeaturedRailCard } from "@/components/blog/blog-cards";
import type { BlogListItem } from "@/sanity/lib/posts.types";

type Props = {
  posts: BlogListItem[];
};

export default function BlogFeaturedRail({ posts }: { posts: BlogListItem[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const loopPosts = useMemo(() => {
    if (posts.length <= 1) return posts;
    return [...posts, ...posts];
  }, [posts]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }

    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  const scrollByAmount = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(280, Math.min(420, el.clientWidth * 0.6));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    if (isInteracting) return;
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    const speed = 0.35;

    const tick = () => {
      const node = scrollerRef.current;
      if (node) {
        node.scrollLeft += speed;

        if (posts.length > 1) {
          const resetAt = node.scrollWidth / 2;
          if (node.scrollLeft >= resetAt) {
            node.scrollLeft = 0;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInteracting, posts.length, reduceMotion]);

  if (posts.length === 0) return null;

  return (
    <div className="group/rail">
      <div className="mb-8 flex items-end justify-between gap-6">
        <h3 className="text-2xl md:text-3xl text-dark font-serif">
          More highlights
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-xs font-medium text-dark/40 uppercase tracking-widest">
            Scroll for more
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 cursor-pointer rounded-full border border-dark/10 bg-transparent text-dark hover:bg-dark hover:text-white hover:border-dark transition-colors"
              onClick={() => scrollByAmount(-1)}
              onMouseEnter={() => setIsInteracting(true)}
              onMouseLeave={() => setIsInteracting(false)}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 cursor-pointer rounded-full border border-dark/10 bg-transparent text-dark hover:bg-dark hover:text-white hover:border-dark transition-colors"
              onClick={() => scrollByAmount(1)}
              onMouseEnter={() => setIsInteracting(true)}
              onMouseLeave={() => setIsInteracting(false)}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onFocusCapture={() => setIsInteracting(true)}
          onBlurCapture={() => setIsInteracting(false)}
        >
          {loopPosts.map((post, idx) => (
            <FeaturedRailCard key={`${post._id}-${idx}`} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}