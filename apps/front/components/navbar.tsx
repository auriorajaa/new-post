"use client";

import React from "react";
import Link from "next/link";

import {
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Articles",
    href: "/articles",
  },
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "About",
    href: "/about",
  },
];

const Navbar = () => {
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
        {/* Desktop Subscribe */}
        <Button
          size="sm"
          className="hidden sm:inline-flex"
          render={<Link href="/auth/signup" />}
          nativeButton={false}
        >
          Sign up
        </Button>
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

            <nav className="mt-8 flex flex-col px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b py-4 text-base font-medium"
                >
                  {link.label}
                </Link>
              ))}

              <Button
                className="mt-6 w-full"
                render={<Link href="/auth/signup" />}
                nativeButton={false}
              >
                Sign up
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
