import AiToolsClient from '@/app/ai-tools/aiToolsClient';

export default function AiToolsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <AiToolsClient />
      </div>
    </main>
  );
}
