"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, User, LogOut, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import Image from "next/image";

interface MeResponse {
  success: boolean;
  user?: {
    id: string;
    name?: string;
    mobileNumber: string;
    displayName: string;
    initials: string;
  };
}

export function Header() {
  const [me, setMe] = useState<MeResponse["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/user/me?optional=1");
        if (res.ok) {
          const data: MeResponse = await res.json();
          if (data.success && data.user) {
            setMe(data.user);
          } else {
            setMe(null);
          }
        }
      } catch {
        setMe(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 md:top-3 z-50 mx-auto w-full md:w-[98%] md:max-w-[97%] md:rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_12px_30px_rgba(15,23,42,0.12)] ring-1 ring-black/5 transition-all duration-300">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-cropped.png"
            alt="Lean Healthtech"
            width={70}
            height={30}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/"
            className="text-base text-foreground hover:text-foreground/70 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/our-why"
            className="text-base text-foreground hover:text-foreground/70 transition-colors"
          >
            Our Why
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-base text-foreground hover:text-foreground/70 transition-colors flex items-center gap-1 outline-none">
              Medication
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/medications" className="cursor-pointer">
                  All medication
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/medications/zepbound" className="cursor-pointer">
                  Zepbound®
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/medications/mounjaro" className="cursor-pointer">
                  Mounjaro®
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/medications/saxenda" className="cursor-pointer">
                  Saxenda®
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/medications/victoza" className="cursor-pointer">
                  Victoza®
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/medications/wegovy" className="cursor-pointer">
                  Wegovy®
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/medications/ozempic" className="cursor-pointer">
                  Ozempic
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/medications/rybelsus" className="cursor-pointer">
                  Rybelsus
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/blog"
            className="text-base text-foreground hover:text-foreground/70 transition-colors"
          >
            Knowledge Hub
          </Link>
        </nav>

        <div className="flex items-center gap-1 min-w-[120px] justify-end">
          {/* Auth Button */}
          {loading ? (
            <div className="h-10 w-[110px] rounded-full border border-foreground/10 bg-gray-200/70 animate-pulse" />
          ) : me ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm hover:bg-emerald-200 transition-colors outline-none">
                {me.initials}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{me.displayName}</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="rounded-full border-foreground px-6 bg-transparent hover:bg-dark"
              asChild
            >
              <Link href="/login">Log in</Link>
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-foreground hover:bg-black/5 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/20 px-4 pb-6 pt-2 animate-in slide-in-from-top-2 fade-in-0">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-base font-medium text-foreground py-2 hover:text-foreground/70 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/our-why"
              className="text-base font-medium text-foreground py-2 hover:text-foreground/70 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Our Why
            </Link>
            
            {/* Mobile Medication Dropdown */}
            <div className="py-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-base font-medium text-foreground hover:text-foreground/70 transition-colors flex items-center justify-between w-full outline-none">
                  Medication
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[calc(100vw-4rem)]">
                  <DropdownMenuItem asChild>
                    <Link href="/medications" className="cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                      All medication
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/medications/zepbound" className="cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                      Zepbound®
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/medications/mounjaro" className="cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                      Mounjaro®
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/medications/saxenda" className="cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                      Saxenda®
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/medications/victoza" className="cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                      Victoza®
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/medications/wegovy" className="cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                      Wegovy®
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/medications/ozempic" className="cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                      Ozempic
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/medications/rybelsus" className="cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                      Rybelsus
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link
              href="/blog"
              className="text-base font-medium text-foreground py-2 hover:text-foreground/70 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Knowledge Hub
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}


// "use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { ChevronDown, User, LogOut } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useEffect, useState } from "react";
// import Image from "next/image";

// interface MeResponse {
//   success: boolean;
//   user?: {
//     id: string;
//     name?: string;
//     mobileNumber: string;
//     displayName: string;
//     initials: string;
//   };
// }

// export function Header() {
//   const [me, setMe] = useState<MeResponse["user"] | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await fetch("/api/user/me?optional=1");
//         if (res.ok) {
//           const data: MeResponse = await res.json();
//           if (data.success && data.user) {
//             setMe(data.user);
//           } else {
//             setMe(null);
//           }
//         }
//       } catch {
//         setMe(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMe();
//   }, []);

//   const handleLogout = async () => {
//     await fetch("/api/auth/logout", { method: "POST" });
//     setMe(null);
//     window.location.href = "/";
//   };

//   return (
//     <header className="sticky top-3 z-50 mx-auto w-[98%] max-w-[97%] rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_12px_30px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
//       <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
//         <Link href="/" className="flex items-center">
//   <Image
//     src="/logo-cropped.png" 
//     alt="Lean Healthtech" 
//     width={70}   
//     height={30}  
//     className="object-contain"
//     priority  
//   />
// </Link>

//         <nav className="hidden lg:flex items-center gap-8">
//           <Link
//             href="/"
//             className="text-base text-foreground hover:text-foreground/70 transition-colors"
//           >
//             Home
//           </Link>
//           <Link
//             href="/our-why"
//             className="text-base text-foreground hover:text-foreground/70 transition-colors"
//           >
//             Our Why
//           </Link>
//           <DropdownMenu>
//             <DropdownMenuTrigger className="text-base text-foreground hover:text-foreground/70 transition-colors flex items-center gap-1 outline-none">
//               Medication
//               <ChevronDown className="w-4 h-4" />
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="start" className="w-56">
//               <DropdownMenuItem asChild>
//                 <Link href="/medications" className="cursor-pointer">
//                   All medication
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/medications/zepbound" className="cursor-pointer">
//                   Zepbound®
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/medications/mounjaro" className="cursor-pointer">
//                   Mounjaro®
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/medications/saxenda" className="cursor-pointer">
//                   Saxenda®
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/medications/victoza" className="cursor-pointer">
//                   Victoza®
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/medications/wegovy" className="cursor-pointer">
//                   Wegovy®
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/medications/ozempic" className="cursor-pointer">
//                   Ozempic
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/medications/rybelsus" className="cursor-pointer">
//                   Rybelsus
//                 </Link>
//               </DropdownMenuItem>  
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <Link
//             href="/blog"
//             className="text-base text-foreground hover:text-foreground/70 transition-colors"
//           >
//             Knowledge Hub
//           </Link>
//           {/* <DropdownMenu>
//             <DropdownMenuTrigger className="text-sm text-foreground hover:text-foreground/70 transition-colors flex items-center gap-1 outline-none">
//               For organizations
//               <ChevronDown className="w-4 h-4" />
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="start">
//               <DropdownMenuItem>Enterprise</DropdownMenuItem>
//               <DropdownMenuItem>Healthcare Providers</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu> */}
//         </nav>

//         {loading ? (
//           <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
//         ) : me ? (
//           <DropdownMenu>
//             <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm hover:bg-emerald-200 transition-colors outline-none">
//               {me.initials}
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               <DropdownMenuItem className="flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 <span className="text-sm">{me.displayName}</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild>
//                 <Link href="/dashboard" className="cursor-pointer flex items-center gap-2">
//                   Dashboard
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center gap-2">
//                 <LogOut className="w-4 h-4" />
//                 <span className="text-sm">Log out</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         ) : (
//           <Button
//             variant="outline"
//             className="rounded-full border-foreground px-6 bg-transparent hover:bg-dark"
//             asChild
//           >
//             <Link href="/login">Log in</Link>
//           </Button>
//         )}
//       </div>
//     </header>
//   );
// }
