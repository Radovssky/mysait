export type Tool = {
  name: string;
  description: string;
};

export type Integration = {
  label: string;
  items: string;
};

export const tools: Tool[] = [
  { name: "n8n", description: "основная платформа автоматизации" },
  {
    name: "Claude Code",
    description: "разработка на коде, когда no-code не хватает",
  },
  { name: "Cursor", description: "IDE для веб-приложений" },
  { name: "Docker", description: "упаковка и деплой" },
  { name: "VPS", description: "self-hosted развёртывание" },
  { name: "PostgreSQL", description: "базы под проекты" },
  { name: "Supabase", description: "быстрый бэкенд для прототипов" },
];

export const integrations: Integration[] = [
  {
    label: "LLM-модели",
    items: "OpenAI, Claude, DeepSeek и любые через OpenRouter",
  },
  { label: "Голос", items: "ElevenLabs" },
  { label: "CRM", items: "amoCRM, Bitrix24, YClients" },
  {
    label: "Мессенджеры",
    items: "Telegram, WhatsApp, Avito, MAX, VK, Instagram",
  },
  { label: "Хранилища", items: "Google Sheets, Airtable, Notion" },
];
