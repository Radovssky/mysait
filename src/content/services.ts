export type Service = {
  slug: string;
  title: string;
  price: string;
  description: string;
  bullets: string[];
};

export const services: Service[] = [
  {
    slug: "chatbots",
    title: "Чат-боты",
    price: "от 50 000 ₽",
    description: "Telegram, WhatsApp, Avito, MAX, VK, Instagram.",
    bullets: [
      "Сценарные боты по ветвям диалога",
      "AI-боты с подключением LLM",
      "Боты с RAG-памятью на базе знаний клиента",
    ],
  },
  {
    slug: "voice",
    title: "Голосовые агенты",
    price: "от 150 000 ₽",
    description:
      "Холодный обзвон, квалификация лидов, запись на встречу.",
    bullets: [
      "Скрипт + отработка возражений",
      "ElevenLabs + LLM",
      "Передача результата в CRM",
    ],
  },
  {
    slug: "content",
    title: "Контент-агенты",
    price: "от 75 000 ₽",
    description:
      "Автогенерация статей, изображений, видео и публикация в каналы.",
    bullets: [
      "Рерайт по тематике",
      "Генерация изображений и видео",
      "Расписание публикаций",
    ],
  },
  {
    slug: "custom",
    title: "Кастомные решения",
    price: "по запросу",
    description:
      "Сложные интеграции, парсинг, нестандартная логика воронок.",
    bullets: [
      "Внутренние процессы команды",
      "Парсинг и обогащение данных",
      "Интеграции с любыми API",
    ],
  },
];
