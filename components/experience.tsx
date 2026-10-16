import { experience } from "@/lib/portfolio-data";
import { SectionHeader } from "@/components/section-header";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-14 border-t border-zinc-800 px-5 py-24 sm:px-8 lg:px-12" aria-labelledby="experience-title">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Experience" id="experience-title" title="Nine years, from analytics to platform leadership." />
        <ol className="mt-12 space-y-10 border-l border-zinc-800 pl-6 sm:pl-8">
          {experience.map((role) => (
            <li key={role.title + role.period} className="relative">
              <span className="absolute -left-[31px] top-2 h-2.5 w-2.5 rounded-full bg-violet-500 sm:-left-[39px]" aria-hidden="true" />
              <p className="text-sm text-zinc-500">{role.period}</p>
              <h3 className="mt-1 font-display text-xl font-medium text-zinc-100">{role.title}</h3>
              <p className="text-sm text-violet-400">{role.company}</p>
              {role.context ? <p className="mt-2 text-sm text-zinc-400">{role.context}</p> : null}
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300 marker:text-zinc-600">
                {role.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
