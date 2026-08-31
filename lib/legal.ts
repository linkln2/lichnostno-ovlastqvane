// Legal page copy, extracted from the route component so that the server
// page can build metadata and generateStaticParams from the same source.

export type LegalContent = {
  title: { bg: string; en: string };
  sections: { heading: { bg: string; en: string }; body: { bg: string; en: string } }[];
};

export const legalPages: Record<string, LegalContent> = {
  terms: {
    title: {
      bg: "Общи условия",
      en: "Terms of Service",
    },
    sections: [
      {
        heading: { bg: "1. Приемане на условията", en: "1. Acceptance of Terms" },
        body: {
          bg: "Използвайки този уебсайт или закупувайки нашите продукти и услуги, вие приемате тези общи условия в пълния им обем. Ако не сте съгласни с някое от условията, моля не използвайте сайта.",
          en: "By using this website or purchasing our products and services, you agree to these terms in their entirety. If you do not agree with any of the terms, please do not use the site.",
        },
      },
      {
        heading: { bg: "2. Продукти и услуги", en: "2. Products and Services" },
        body: {
          bg: "Ние предлагаме цифрови продукти, курсове, семинари и абонаменти за членство. Всички цени са посочени в евро (€) и се таксуват чрез Stripe, нашият обработчик на плащания.",
          en: "We offer digital products, courses, seminars, and membership subscriptions. All prices are listed in euros (€) and are charged through Stripe, our payment processor.",
        },
      },
      {
        heading: { bg: "3. Абонаменти", en: "3. Subscriptions" },
        body: {
          bg: "Абонаментите се подновяват автоматично всеки месец или година, в зависимост от избрания план. Можете да отмените абонамента си по всяко време чрез портала на Stripe. Отказът влиза в сила в края на текущия период на таксуване.",
          en: "Subscriptions renew automatically each month or year, depending on the plan you choose. You can cancel your subscription at any time through the Stripe portal. Cancellation takes effect at the end of the current billing period.",
        },
      },
      {
        heading: { bg: "4. Интелектуална собственост", en: "4. Intellectual Property" },
        body: {
          bg: "Цялото съдържание на този сайт — текстове, видео, изображения и курсове — е защитено от авторско право. Разпространението или възпроизвеждането без изрично писмено съгласие е забранено.",
          en: "All content on this site — text, video, images, and courses — is protected by copyright. Distribution or reproduction without explicit written consent is prohibited.",
        },
      },
      {
        heading: { bg: "5. Отговорност", en: "5. Liability" },
        body: {
          bg: "Услугите се предоставят „както са“. Ние не носим отговорност за преки, косвени или случайни щети, произтичащи от използването на нашите продукти или услуги.",
          en: "Services are provided \"as is.\" We are not liable for direct, indirect, or incidental damages arising from the use of our products or services.",
        },
      },
    ],
  },
  privacy: {
    title: {
      bg: "Политика за поверителност",
      en: "Privacy Policy",
    },
    sections: [
      {
        heading: { bg: "1. Данни, които събираме", en: "1. Data We Collect" },
        body: {
          bg: "Събираме имейл, име, телефон и данни за плащане (обработвани от Stripe, ние не съхраняваме номера на карти). Също така събираме данни за използването на сайта чрез бисквитки.",
          en: "We collect email, name, phone, and payment data (processed by Stripe — we do not store card numbers). We also collect site usage data through cookies.",
        },
      },
      {
        heading: { bg: "2. Използване на данните", en: "2. How We Use Your Data" },
        body: {
          bg: "Използваме данните за: обработка на поръчки и абонаменти, изпращане на потвърждения и известия, подобряване на услугите и маркетинг (с ваше съгласие).",
          en: "We use data for: processing orders and subscriptions, sending confirmations and notifications, improving services, and marketing (with your consent).",
        },
      },
      {
        heading: { bg: "3. Бисквитки", en: "3. Cookies" },
        body: {
          bg: "Използваме essential бисквитки за работата на сайта и analytics бисквитки за разбиране на използването. Можете да изберете кои бисквитки да разрешите чрез банера за съгласие.",
          en: "We use essential cookies for the site to function and analytics cookies to understand usage. You can choose which cookies to allow via the consent banner.",
        },
      },
      {
        heading: { bg: "4. Споделяне с трети страни", en: "4. Sharing with Third Parties" },
        body: {
          bg: "Споделяме данни само с Stripe (обработка на плащания) и Resend (изпращане на имейли). Не продаваме и не отдаваме под наем вашите данни.",
          en: "We share data only with Stripe (payment processing) and Resend (email sending). We do not sell or rent your data.",
        },
      },
      {
        heading: { bg: "5. Вашите права", en: "5. Your Rights" },
        body: {
          bg: "Имате право да поискате достъп, корекция или изтриване на вашите данни. Свържете се с нас на elegiaood@gmail.com за всяко искане по GDPR.",
          en: "You have the right to request access, correction, or deletion of your data. Contact us at elegiaood@gmail.com for any GDPR request.",
        },
      },
    ],
  },
  refund: {
    title: {
      bg: "Политика за възстановяване",
      en: "Refund Policy",
    },
    sections: [
      {
        heading: { bg: "1. Цифрови продукти", en: "1. Digital Products" },
        body: {
          bg: "Поради естеството на цифровите продукти, възстановяване на суми е възможно само в рамките на 14 дни от покупката, ако продуктът не е бил свален или използван.",
          en: "Due to the nature of digital products, refunds are available only within 14 days of purchase if the product has not been downloaded or used.",
        },
      },
      {
        heading: { bg: "2. Билети за събития", en: "2. Event Tickets" },
        body: {
          bg: "Билетите могат да бъдат върнати в рамките на 14 дни от покупката, но не по-късно от 7 дни преди събитието. След този срок възстановяване не е възможно, но билетът може да бъде прехвърлен на друго лице.",
          en: "Tickets can be refunded within 14 days of purchase, but no later than 7 days before the event. After this period, refunds are not possible, but tickets can be transferred to another person.",
        },
      },
      {
        heading: { bg: "3. Абонаменти", en: "3. Subscriptions" },
        body: {
          bg: "Абонаментите могат да бъдат отменени по всяко време чрез портала на Stripe. Отказът влиза в сила в края на текущия период. Възстановяване за частично използван период не се предлага.",
          en: "Subscriptions can be canceled at any time through the Stripe portal. Cancellation takes effect at the end of the current period. Refunds for partially used periods are not offered.",
        },
      },
      {
        heading: { bg: "4. Как да поискате възстановяване", en: "4. How to Request a Refund" },
        body: {
          bg: "Свържете се с нас на elegiaood@gmail.com с номера на поръчката и причината за възстановяването. Ще отговорим в рамките на 5 работни дни.",
          en: "Contact us at elegiaood@gmail.com with your order number and the reason for the refund. We will respond within 5 business days.",
        },
      },
    ],
  },
};

export type LegalSlug = keyof typeof legalPages;

export function getLegalPage(slug: string): LegalContent | undefined {
  return legalPages[slug];
}

export const legalSlugs = Object.keys(legalPages);
