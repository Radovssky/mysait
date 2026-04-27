export type Testimonial = {
  image: string;
  alt: string;
  caseSlug?: string;
  caseTitle?: string;
};

export const testimonials: Testimonial[] = [
  {
    image: "/testimonials/testimonial-3.jpg",
    alt: "Отзыв клиента про Avito-агента",
    caseSlug: "avito-agent",
    caseTitle: "Avito-агент",
  },
  {
    image: "/testimonials/testimonial-2.jpg",
    alt: "Отзыв эксперта-таролога про бот по подписке",
    caseSlug: "tarot-subscription-bot",
    caseTitle: "Telegram-бот с раскладами Таро",
  },
  {
    image: "/testimonials/testimonial-1.jpg",
    alt: "Отзыв автора Telegram-канала про прогрев комментариев",
    caseSlug: "tg-comments-warmup-bot",
    caseTitle: "Бот для прогрева комментариев",
  },
];
