"use client";
import { motion } from "framer-motion";
import { projects } from "@/lib/portfolio-data";
import { ProjectCard } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-14 border-t border-zinc-800 px-5 py-24 sm:px-8 lg:px-12" aria-labelledby="projects-title">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Selected work" id="projects-title" title="Data platforms built for dependable decisions.">
          Case studies use generalized architecture and anonymized context to honor confidentiality commitments.
        </SectionHeader>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div key={project.slug} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
