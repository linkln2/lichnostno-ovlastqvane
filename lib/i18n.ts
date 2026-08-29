export type Locale = "bg" | "en";

export const locales: Locale[] = ["bg", "en"];
export const defaultLocale: Locale = "bg";

export const localeNames: Record<Locale, string> = {
  bg: "БГ",
  en: "EN",
};

// Centralized translations for UI strings (nav, buttons, labels)
type Dict = Record<string, Record<Locale, string>>;

export const t: Dict = {
  // Nav
  nav_home: { bg: "Начало", en: "Home" },
  nav_about: { bg: "За нас", en: "About" },
  nav_services: { bg: "Услуги", en: "Services" },
  nav_events: { bg: "Събития", en: "Events" },
  nav_testimonials: { bg: "Отзиви", en: "Testimonials" },
  nav_blog: { bg: "Блог", en: "Blog" },
  nav_feed: { bg: "Видеа", en: "Videos" },
  nav_contact: { bg: "Контакти", en: "Contact" },
  nav_register: { bg: "Запиши се", en: "Register" },

  // Countdown
  countdown_label: { bg: "Следващ уебинар", en: "Next webinar" },
  countdown_days: { bg: "Дни", en: "Days" },
  countdown_hours: { bg: "Часа", en: "Hours" },
  countdown_minutes: { bg: "Минути", en: "Minutes" },
  countdown_seconds: { bg: "Секунди", en: "Seconds" },
  countdown_title: {
    bg: "Обратното броене до следващия уебинар",
    en: "Countdown to the next webinar",
  },
  countdown_subtitle: {
    bg: "Нещо могъщо се подготвя. Бъди сред първите, които ще го преживеят.",
    en: "Something powerful is being prepared. Be among the first to experience it.",
  },

  // Video feed
  feed_title: { bg: "Видеа", en: "Videos" },
  feed_subtitle: {
    bg: "Кратки видеа от семинарите, практиките и ежедневието.",
    en: "Short videos from seminars, practices, and daily life.",
  },
  feed_tiktok: { bg: "TikTok", en: "TikTok" },
  feed_facebook: { bg: "Facebook", en: "Facebook" },
  feed_all: { bg: "Всички", en: "All" },
  feed_empty: {
    bg: "Все още няма добавени видеа. Очаквайте скоро!",
    en: "No videos added yet. Coming soon!",
  },
  feed_follow_tiktok: {
    bg: "Последвай ни в TikTok за още видеа",
    en: "Follow us on TikTok for more videos",
  },

  // Buttons / common
  btn_register: { bg: "Запиши се за събитието", en: "Register for event" },
  btn_book_call: { bg: "Запази консултация", en: "Book a consultation" },
  btn_join_newsletter: { bg: "Запиши се за бюлетин", en: "Join newsletter" },
  btn_read_more: { bg: "Виж повече", en: "Read more" },
  btn_send: { bg: "Изпрати", en: "Send" },
  btn_submit: { bg: "Подай регистрация", en: "Submit registration" },
  btn_all_events: { bg: "Всички събития", en: "All events" },
  btn_all_testimonials: { bg: "Всички отзиви", en: "All testimonials" },
  btn_all_posts: { bg: "Всички статии", en: "All posts" },
  btn_back_home: { bg: "Обратно към началото", en: "Back to home" },

  // Footer
  footer_tagline: {
    bg: "Личностно овластяване — върни си своя вътрешен авторитет.",
    en: "Personal Empowerment — reclaim your inner authority.",
  },
  footer_rights: {
    bg: "Всички права запазени.",
    en: "All rights reserved.",
  },
  footer_nav: { bg: "Навигация", en: "Navigation" },
  footer_contact: { bg: "Контакт", en: "Contact" },
  footer_follow: { bg: "Последвай ни", en: "Follow us" },

  // Hero
  hero_badge: { bg: "Семинари · Коучинг · Личностно развитие", en: "Seminars · Coaching · Personal growth" },
  hero_cta_secondary: { bg: "Запази безплатна консултация", en: "Book a free consultation" },

  // Sections
  section_mission_title: { bg: "Нашата мисия", en: "Our mission" },
  section_next_event_title: { bg: "Следващо събитие", en: "Next event" },
  section_how_title: { bg: "Как работи", en: "How it works" },
  section_testimonials_title: { bg: "Какво казват участниците", en: "What participants say" },
  section_team_title: { bg: "Екипът", en: "The team" },
  section_values_title: { bg: "Нашите ценности", en: "Our values" },
  section_services_title: { bg: "Програми и услуги", en: "Programs & services" },
  section_upcoming_title: { bg: "Предстоящи събития", en: "Upcoming events" },
  section_past_title: { bg: "Минали събития", en: "Past events" },
  section_recent_posts: { bg: "Последни статии", en: "Recent posts" },

  // How it works steps
  step1_title: { bg: "1. Запиши се", en: "1. Register" },
  step1_desc: {
    bg: "Избери събитие или програма, която резонира с теб, и попълни формуляра.",
    en: "Choose an event or program that resonates with you and fill in the form.",
  },
  step2_title: { bg: "2. Участвай", en: "2. Participate" },
  step2_desc: {
    bg: "Присъедини се на семинара или сесията и потопи се в процеса на трансформация.",
    en: "Join the seminar or session and immerse yourself in the transformation process.",
  },
  step3_title: { bg: "3. Интегрирай", en: "3. Integrate" },
  step3_desc: {
    bg: "Върни се у дома с инструменти, подкрепа и общност за продължителна промяна.",
    en: "Return home with tools, support, and community for lasting change.",
  },

  // Registration form
  form_name: { bg: "Име", en: "Name" },
  form_email: { bg: "Имейл", en: "Email" },
  form_phone: { bg: "Телефон", en: "Phone" },
  form_city: { bg: "Град", en: "City" },
  form_package: { bg: "Пакет", en: "Package" },
  form_notes: { bg: "Бележки (по желание)", en: "Notes (optional)" },
  form_required: { bg: "Задължително", en: "Required" },
  form_success: {
    bg: "Благодарим! Регистрацията ти е получена. Ще се свържем с теб скоро.",
    en: "Thank you! Your registration has been received. We'll contact you soon.",
  },
  form_error: {
    bg: "Възникна грешка. Моля, опитай отново.",
    en: "An error occurred. Please try again.",
  },
  form_register_for: { bg: "Регистрация за", en: "Register for" },

  // Contact form
  form_message: { bg: "Съобщение", en: "Message" },
  form_contact_success: {
    bg: "Съобщението е изпратено. Ще отговорим възможно най-скоро.",
    en: "Message sent. We'll reply as soon as possible.",
  },

  // Newsletter
  newsletter_title: { bg: "Бюлетин", en: "Newsletter" },
  newsletter_desc: {
    bg: "Получавай новини за събития, статии и практики директно в пощата си.",
    en: "Get news about events, articles, and practices straight to your inbox.",
  },

  // Misc
  loading: { bg: "Зареждане…", en: "Loading…" },
  no_events: { bg: "Няма предстоящи събития в момента.", en: "No upcoming events at the moment." },
  date_label: { bg: "Дата", en: "Date" },
  location_label: { bg: "Място", en: "Location" },
  price_label: { bg: "Цена", en: "Price" },
  from_label: { bg: "от", en: "from" },
  organizer_label: { bg: "Организатор", en: "Organizer" },
  lang_toggle: { bg: "Смяна на език", en: "Switch language" },
};

export function tr(key: string, locale: Locale): string {
  return t[key]?.[locale] ?? key;
}
