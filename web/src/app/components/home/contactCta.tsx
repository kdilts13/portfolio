export default function Hero() {
  return (
    <section id="contact" className="rounded-lg bg-card px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Let&apos;s talk.</h2>
          <p className="text-sm text-muted">
            If you&apos;re hiring or just want to chat about engineering work, I&apos;d be happy to
            connect.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:youremail@example.com"
            className="pill-button bg-primary-green text-background hover:bg-primary-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
          >
            Email me
          </a>
          <a
            href="https://www.linkedin.com/in/kdilts13"
            target="_blank"
            rel="noopener noreferrer"
            className="pill-button border border-accent text-muted hover:border-primary-blue hover:text-foreground"
          >
            View LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
