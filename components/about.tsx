import { SectionHeader } from "@/components/section-header";

export function About() {
  return (
    <section id="about" className="scroll-mt-14 border-t border-zinc-800 px-5 py-24 sm:px-8 lg:px-12" aria-labelledby="about-title">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeader eyebrow="About" id="about-title" title="Built for scale. Grounded in quality." />
        <div className="max-w-2xl text-base leading-8 text-zinc-300">
          <p>
            I&rsquo;m a Lead Data Engineer with 9+ years of experience designing cloud-native lakehouse platforms on AWS and Azure,
            including GxP-regulated pharmaceutical environments where lineage and accuracy are non-negotiable.
          </p>
          <p className="mt-5">
            I modernize legacy ETL into Spark-native architectures, build metadata-driven and API ingestion frameworks, and
            reduce infrastructure spend without trading away reliability. I also mentor engineers and set delivery standards.
          </p>
        </div>
      </div>
    </section>
  );
}
