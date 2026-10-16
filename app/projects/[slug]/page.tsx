import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/portfolio-data";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} | Sujit Prasad`,
      description: project.summary,
      images: [`/diagrams/${project.diagram}`],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prevProject = index > 0 ? projects[index - 1] : null;
  const nextProject = index < projects.length - 1 ? projects[index + 1] : null;

  return (
    <main id="main" className="min-h-screen px-5 py-10 sm:px-8 lg:px-12">
      <article className="mx-auto max-w-4xl">
        <Link href="/#projects" className="inline-flex items-center text-sm text-zinc-400 hover:text-violet-400">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to portfolio
        </Link>
        <p className="mt-14 text-sm font-medium tracking-[0.18em] text-violet-400 uppercase">
          {project.domain}
          {project.status ? ` · ${project.status}` : ""}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">{project.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">{project.summary}</p>
        <div className="mt-8 inline-flex items-baseline gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-5 py-4">
          <span className="font-display text-3xl font-semibold text-zinc-50">{project.metric}</span>
          <span className="text-sm text-zinc-400">{project.metricLabel}</span>
        </div>
        <Image
          src={`/diagrams/${project.diagram}`}
          alt={`Simplified architecture diagram for ${project.title}`}
          width={900}
          height={480}
          priority
          className="mt-10 w-full rounded-lg border border-zinc-800"
        />
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {[
            ["Challenge", project.challenge],
            ["Approach", project.approach],
            ["Impact", project.impact],
          ].map(([heading, text]) => (
            <section key={heading}>
              <h2 className="font-display text-lg font-medium">{heading}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
            </section>
          ))}
        </div>
        <section className="mt-12 border-t border-zinc-800 pt-8">
          <h2 className="font-display text-lg font-medium">Key design decisions</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-300 marker:text-violet-500">
            {project.decisions.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
        {project.snippet ? (
          <section className="mt-12">
            <h2 className="font-display text-lg font-medium">Code highlight</h2>
            <p className="mt-1 text-sm text-zinc-400">{project.snippet.title} (illustrative, generalized code)</p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs leading-6 text-zinc-300">
              <code>{project.snippet.body}</code>
            </pre>
          </section>
        ) : null}
        <section className="mt-12 border-t border-zinc-800 pt-8">
          <h2 className="font-display text-lg font-medium">Technology</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="rounded border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300">
                {tech}
              </span>
            ))}
          </div>
        </section>
        <nav
          aria-label="Case study navigation"
          className="mt-16 grid gap-4 border-t border-zinc-800 pt-8 sm:grid-cols-2"
        >
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition-colors hover:border-violet-600/60"
            >
              <span className="inline-flex items-center text-xs text-zinc-500">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Previous case study
              </span>
              <p className="mt-1 font-display text-base font-medium text-zinc-200 group-hover:text-violet-400">
                {prevProject.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-right transition-colors hover:border-violet-600/60"
            >
              <span className="inline-flex items-center justify-end text-xs text-zinc-500">
                Next case study
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </span>
              <p className="mt-1 font-display text-base font-medium text-zinc-200 group-hover:text-violet-400">
                {nextProject.title}
              </p>
            </Link>
          ) : null}
        </nav>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-6">
          <div>
            <p className="font-display text-lg font-medium text-zinc-100">Tackling a similar data platform challenge?</p>
            <p className="mt-1 text-sm text-zinc-400">Let&rsquo;s talk through architecture, trade-offs or request my resume.</p>
          </div>
          <Button asChild>
            <Link href="/#contact">
              <Mail className="mr-2 h-4 w-4" />
              Connect &amp; get my resume
            </Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
