"use client";

import { SignInButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import cambridgeImage from "@/images/cambridge.png";
import imperialImage from "@/images/imperial.png";
import heroImage from "@/images/two-humans.svg";
import heroImageDark from "@/images/two-humans-dark.svg";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <div className="text-center lg:text-left">
      <div className="h-screen container flex justify-center items-center mx-auto max-w-7xl py-16">
        <div className="grid gap-8 md:gap-16 lg:grid-cols-5 justify-center items-center">
          <div className="col-span-3">
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl dark:text-slate-100">
              Where{" "}
              <span className="relative whitespace-nowrap text-blue-600 dark:text-blue-400">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70 dark:fill-blue-500/70"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative">better, faster</span>
              </span>{" "}
              work happens.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700 dark:text-slate-300">
              Technical note-taking has never been this easy. Math, graphs, and
              code at your fingertips. Because smart people deserve smart tools.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              {isLoading && (
                <div className="w-full flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              )}
              {isAuthenticated && !isLoading && (
                <Button asChild className="rounded-full">
                  <Link href="/documents">
                    Enter EurekaPad
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              )}
              {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                  <Button className="rounded-full">
                    Get EurekaPad free
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
          <div className="hidden lg:block col-span-2">
            <Image
              src={heroImage}
              alt="Two humans working together"
              className="dark:hidden"
            />
            <Image
              src={heroImageDark}
              alt="Two humans working together"
              className="hidden dark:block"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 flex justify-center w-full">
        {!scrolled && (
          <ChevronDown className="h-8 w-8 transform animate-bounce" />
        )}
      </div>
      <div className="pb-16 container text-center">
        <p className="font-display text-base text-slate-900 dark:text-slate-100">
          Built by students from Cambridge, and trusted by students from
        </p>
        <ul
          role="list"
          className="mt-8 flex items-center justify-center gap-x-8 flex-col gap-x-0 gap-y-10 md:flex-row md:gap-x-12 md:gap-y-0"
        >
          {[
            { name: "University of Cambridge", logo: cambridgeImage },
            { name: "Imperial College London", logo: imperialImage },
          ].map((school) => (
            <li
              key={school.name}
              className="dark:bg-white p-4 rounded-lg shadow-lg dark:shadow-blue-500/50"
            >
              <Image
                src={school.logo}
                alt={school.name}
                width={200}
                height={200}
              />
            </li>
          ))}
        </ul>
        <div className="lg:hidden w-[90%] mx-auto my-8">
          <Image
            src={heroImage}
            alt="Two humans working together"
            className="dark:hidden"
          />
          <Image
            src={heroImageDark}
            alt="Two humans working together"
            className="hidden dark:block"
          />
        </div>
      </div>
    </div>
  );
};
