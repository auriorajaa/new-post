import Link from "next/link";

import { Menu01Icon, Search01Icon } from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getSession } from "@/lib/session";
import SignInPanel from "./signInPanel";
import Profile from "./profile";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/articles" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
];

const Navbar = async () => {
  const session = await getSession();

  return (
    <div className="flex w-full items-center justify-between">
      {/* Logo */}
      <Link href="/" className="text-lg font-bold tracking-tight">
        The Journal.
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-8 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <Button variant="ghost" size="icon" aria-label="Search">
          <HugeiconsIcon icon={Search01Icon} className="size-5" />
        </Button>

        {/* Desktop User Auth */}
        <div className="hidden md:block">
          {session?.user ? <Profile user={session.user} /> : <SignInPanel />}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="md:hidden"
              />
            }
          >
            <HugeiconsIcon icon={Menu01Icon} className="size-5" />
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>The Journal.</SheetTitle>
            </SheetHeader>

            <div className="mt-8 flex flex-col gap-6 px-3">
              <nav className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-b py-4 text-base font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {session?.user ? (
                <Profile user={session.user} />
              ) : (
                <SignInPanel className="w-full flex-col items-stretch" />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
