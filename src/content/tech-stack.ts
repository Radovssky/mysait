export type StackCategory = {
  title: string;
  items: string[];
};

export const techStack: StackCategory[] = [
  {
    title: "Ядро",
    items: ["n8n", "Docker", "VPS"],
  },
  {
    title: "AI / LLM",
    items: ["OpenRouter", "OpenAI", "Claude", "DeepSeek", "ElevenLabs"],
  },
  {
    title: "CRM",
    items: ["amoCRM", "Bitrix24", "YClients"],
  },
  {
    title: "Мессенджеры",
    items: ["Telegram", "WhatsApp", "Avito", "MAX", "VK", "Instagram"],
  },
  {
    title: "БД и хранилища",
    items: ["Supabase", "PostgreSQL", "Google Sheets", "Airtable", "Notion"],
  },
];
