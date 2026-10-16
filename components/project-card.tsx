import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/portfolio-data";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 transition-colors hover:border-violet-600/60">
      <Image
        src={`/diagrams/${project.diagram}`}
        alt={`Simplified architecture diagram for ${project.title}`}
        width={900}
        height={480}
        loading="lazy"
        className="aspect-[15/8] w-full border-b border-zinc-800 object-cover"
      />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium tracking-[0.14em] text-violet-400 uppercase">{project.domain}</p>
          {project.status ? (
            <span className="shrink-0 rounded-full border border-amber-500/40 px-2 py-0.5 text-[11px] text-amber-300">
              {project.status}
            </span>
          ) : null}
        </div>
        <p className="mt-4 font-display text-3xl font-semibold text-zinc-50">{project.metric}</p>
        <p className="text-sm text-zinc-400">{project.metricLabel}</p>
        <h3 className="mt-4 font-display text-lg font-medium text-zinc-100">{project.title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech} className="rounded border border-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
              {tech}
            </span>
          ))}
        </div>
        <Link
          className="mt-auto inline-flex items-center pt-6 text-sm text-zinc-300 hover:text-violet-400"
          href={`/projects/${project.slug}`}
        >
          Read case study <ArrowUpRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
