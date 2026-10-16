import { achievements, certifications, education, skillGroups } from "@/lib/portfolio-data";
import { SectionHeader } from "@/components/section-header";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-14 border-t border-zinc-800 px-5 py-24 sm:px-8 lg:px-12" aria-labelledby="skills-title">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Skills" id="skills-title" title="Tools I use to ship data platforms." />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.name}>
              <h3 className="font-display text-base font-medium text-zinc-100">{group.name}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded border border-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-10 border-t border-zinc-800 pt-10 md:grid-cols-3">
          <div>
            <h3 className="font-display text-base font-medium text-zinc-100">Certifications</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-base font-medium text-zinc-100">Recognition</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {achievements.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-base font-medium text-zinc-100">Education</h3>
            <p className="mt-3 text-sm text-zinc-400">{education}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
