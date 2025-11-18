import Hero from '@/app/components/home/hero';
import FeaturedProjects from '@/app/components/home/featuredProjects';
import Experiments from '@/app/components/home/experiments';
import TechStack from '@/app/components/home/techStack';
import Timeline from '@/app/components/home/timeline';
import ContactCta from '@/app/components/home/contactCta';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0F1115] text-[#F3F4F6]">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <Hero />

        <FeaturedProjects />

        <Experiments />

        <TechStack />

        <Timeline />

        <ContactCta />
      </div>
    </main>
  );
}
