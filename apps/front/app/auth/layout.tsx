import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";

const BRAND_IMG =
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&auto=format&fit=crop";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="grid min-h-svh md:grid-cols-[2fr_3fr] lg:grid-cols-2">
      {/* Brand panel — visible from tablet up, as a narrower column */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-10 text-white md:flex lg:p-12 xl:p-16">
        <Image
          src={`${BRAND_IMG}&w=1600`}
          alt="background img"
          fill
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          sizes="(min-width: 1024px) 50vw, 40vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30" />

        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <span className="text-lg font-semibold tracking-tight">
            The Journal
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="text-2xl leading-tight font-semibold tracking-tight lg:text-3xl xl:text-4xl">
            Ideas worth sharing, written by people worth reading.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Join a community of writers exploring technology, creativity, and
            the things shaping the world around us.
          </p>

          <figure className="mt-10 border-l-2 border-white/30 pl-5">
            <blockquote className="text-sm leading-relaxed text-white/80">
              “The Journal is where I publish first. The readers here actually
              engage — every essay turns into a real conversation.”
            </blockquote>
            <figcaption className="mt-3 text-xs font-medium text-white/60">
              Maya Chen — Writer
            </figcaption>
          </figure>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-white/50">
          <span>© {new Date().getFullYear()} The Journal</span>
          <div className="flex gap-5">
            <Link href="/about" className="transition hover:text-white/80">
              About
            </Link>
            <Link href="/privacy" className="transition hover:text-white/80">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white/80">
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <main className="flex min-h-svh flex-col px-4 py-6 sm:px-6 md:min-h-0 lg:p-0">
        {/* Mobile header */}
        <header className="flex items-center justify-between md:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-base font-semibold tracking-tight">
              The Journal
            </span>
          </Link>
          <Link
            href="/help"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Need help?
          </Link>
        </header>

        {/* Mobile hero card */}
        <div className="relative mt-6 overflow-hidden rounded-2xl md:hidden">
          <Image
            src={`${BRAND_IMG}&w=1200`}
            alt="A writer's desk with a fountain pen and paper"
            fill
            priority
            className="absolute inset-0 h-full w-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-black/10" />
          <div className="relative z-10 px-5 pt-14 pb-5">
            <p className="text-xl leading-snug font-semibold text-white">
              Ideas worth sharing, written by people worth reading.
            </p>
            <p className="mt-1.5 text-sm text-white/70">
              Join 20,000+ writers and readers.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        {/* Mobile footer */}
        <footer className="border-t pt-4 md:hidden">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} The Journal</span>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="transition hover:text-foreground"
              >
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AuthLayout;
