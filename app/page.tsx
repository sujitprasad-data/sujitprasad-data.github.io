import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
export default function Home() { return <main><Hero /><Projects /><About /><Contact /><footer className="border-t border-zinc-800 px-5 py-7 text-center text-sm text-zinc-500">© {new Date().getFullYear()} Sujit Prasad. Built with care for data that matters.</footer></main>; }
