"use client";
import { motion } from "framer-motion";
import { ArrowDown, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroMetrics, siteConfig } from "@/lib/portfolio-data";

export function Hero() {
  return (
    <section className="flex min-h-[82svh] items-center px-5 py-20 sm:px-8 lg:px-12" aria-labelledby="hero-title">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto w-full max-w-6xl"
      >
        <p className="mb-5 text-sm font-medium tracking-[0.18em] text-violet-400 uppercase">
          {siteConfig.role} · {siteConfig.location}
        </p>
        <h1
          id="hero-title"
          className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl"
        >
          {siteConfig.name}
        </h1>
        <p className="mt-5 max-w-3xl font-display text-2xl leading-tight text-zinc-300 sm:text-3xl">
          I build lakehouse platforms, scalable pipelines and API ingestion that make data dependable and cheap to run.
        </p>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400">
          PySpark · Databricks · AWS · Azure · Airflow · NiFi
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href={`mailto:${siteConfig.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Start a conversation
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#projects">
              View selected work <ArrowDown className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <a href="#contact">
              <FileText className="mr-2 h-4 w-4" />
              Get my resume
            </a>
          </Button>
        </div>
        <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-zinc-800 pt-8 lg:grid-cols-4">
          {heroMetrics.map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd className="font-display text-2xl font-semibold text-zinc-50 sm:text-3xl">{m.value}</dd>
              <p className="mt-1 text-sm text-zinc-400" aria-hidden="true">
                {m.label}
              </p>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
