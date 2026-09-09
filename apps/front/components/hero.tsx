import { Button } from "@/components/ui/button";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="w-full">
      <div className="mx-auto grid min-h-150 max-w-7xl items-center gap-10 px-6 py-16 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-20">
        {/* Content */}
        <div className="order-2 lg:order-1 lg:col-span-6">
          <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Ideas, stories worth reading.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Discover thoughtful articles about technology, creativity, culture,
            and the things shaping the world around us.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">
              Explore stories
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                className="ml-1 h-4 w-4"
              />
            </Button>

            <Button variant="ghost" size="lg">
              About the blog
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="order-1 lg:order-2 lg:col-span-6">
          <div className="relative mx-auto aspect-4/3 w-full max-w-md overflow-hidden rounded-2xl sm:aspect-16/10 sm:max-w-none lg:aspect-4/3">
            <Image
              src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              fill
              alt="Person working on a creative project"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
