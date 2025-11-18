export default function Hero() {
  return (
    <section id="contact" className="rounded-2xl bg-[#161A20] px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Let&apos;s talk.</h2>
          <p className="text-sm text-[#9CA3AF]">
            If you&apos;re hiring or just want to chat about engineering work, I&apos;d be happy to
            connect.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:youremail@example.com"
            className="inline-flex items-center justify-center rounded-full bg-[#3B82F6] px-5 py-2 text-sm font-medium text-white hover:bg-[#2563EB]"
          >
            Email me
          </a>
          <a
            href="https://www.linkedin.com/in/kdilts13"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-[#4B5563] px-5 py-2 text-sm font-medium text-[#E5E7EB] hover:border-[#6B7280] hover:bg-[#111827]"
          >
            View LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
