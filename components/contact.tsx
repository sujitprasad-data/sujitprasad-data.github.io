import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectForm } from "@/components/connect-form";
import { SectionHeader } from "@/components/section-header";
import { siteConfig } from "@/lib/portfolio-data";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-14 border-t border-zinc-800 px-5 py-24 sm:px-8 lg:px-12" aria-labelledby="contact-title">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div>
          <SectionHeader eyebrow="Contact" id="contact-title" title="Have a data platform challenge worth solving?">
            I&rsquo;m open to conversations about data engineering leadership, modern data platforms and high-impact analytics
            infrastructure. Share your name and email and I&rsquo;ll send you my resume.
          </SectionHeader>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline" size="lg">
              <a href={`mailto:${siteConfig.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={siteConfig.linkedin} target="_blank" rel="noreferrer">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={siteConfig.github} target="_blank" rel="noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
        <ConnectForm />
      </div>
    </section>
  );
}
