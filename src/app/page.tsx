import { auth } from '@/auth';

const EXAMPLE_PROMPTS = [
  { icon: '💡', text: 'Explain quantum computing in simple terms' },
  { icon: '🔧', text: 'Write a Python function to merge two sorted lists' },
  { icon: '📝', text: 'Help me draft a professional email' },
  { icon: '🎨', text: 'Suggest a color palette for a tech startup website' },
  { icon: '🧠', text: 'What are the key differences between SQL and NoSQL?' },
  { icon: '🚀', text: 'Create a React component for a todo list' },
];

const FEATURES = [
  { icon: '⚡', title: 'Streaming Responses', desc: 'Real-time token-by-token output' },
  { icon: '🔄', title: 'Multi-Provider', desc: 'Groq, Google Gemini, OpenRouter' },
  { icon: '📝', title: 'Markdown Support', desc: 'Code highlighting, tables, and more' },
  { icon: '🎯', title: 'System Prompts', desc: 'Customize AI behavior per chat' },
];

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold">W3B AI Chat</h1>
        <p className="mt-3 text-lg text-[var(--studio-text-secondary)]">
          W3B AI Chat - A modern AI chat experience with streaming, multi-provider support, and more.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-[var(--studio-border)] bg-[var(--studio-sidebar)] p-4 text-center"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-2 text-sm font-medium">{f.title}</h3>
              <p className="mt-1 text-xs text-[var(--studio-text-secondary)]">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-[var(--studio-text-secondary)]">
          Sign in with GitHub to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold">
        Welcome back, {session.user?.name?.split(' ')[0] ?? 'there'}!
      </h1>
      <p className="mt-2 text-[var(--studio-text-secondary)]">
        What would you like to explore today?
      </p>

      <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <form key={prompt.text} className="flex" action={async (formData: FormData) => {
            'use server';
            const { createNewChat } = await import('@/app/actions');
            const promptText = formData.get('prompt') as string;
            await createNewChat(promptText);
          }}>
            <input type="hidden" name="prompt" value={prompt.text} />
            <button
              type="submit"
              className="flex w-full items-center rounded-lg border border-[var(--studio-border)] bg-[var(--studio-sidebar)] p-4 text-left text-sm transition-colors hover:border-[var(--studio-accent)]/50 hover:bg-white/5"
            >
              <span className="mr-2">{prompt.icon}</span>
              {prompt.text}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
