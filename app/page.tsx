import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Projects />
      <About />
      <Experience />
      <Skills />
      <Contact />
      <footer className="border-t border-zinc-800 px-5 py-7 text-center text-sm text-zinc-400">
        © {new Date().getFullYear()} Sujit Prasad. Built with care for data that matters.
      </footer>
    </main>
  );
}
