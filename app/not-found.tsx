import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[75svh] items-center px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-medium tracking-[0.18em] text-violet-400 uppercase">404 · Page not found</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
          This route doesn&rsquo;t exist.
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-400">
          The page or case study you&rsquo;re looking for may have moved. Head back to the portfolio to explore selected work.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to portfolio
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
