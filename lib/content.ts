import type { Locale } from "./i18n";

// Bilingual content for the site. Each entry has bg + en variants.

export type Bi = { bg: string; en: string };
export type BiList = { bg: string[]; en: string[] };

export const site = {
  name: "Личностно овластяване",
  nameEn: "Personal Empowerment",
  email: "elegiaood@gmail.com",
  phone: "+359 87 944 7749",
  phoneDisplay: "087 944 7749",
  city: { bg: "Бургас 8000, България", en: "Burgas 8000, Bulgaria" },
  facebook: "https://www.facebook.com/profile.php?id=61562005563695",
  instagram: "https://www.instagram.com/lichnostno_ovlastyavane",
  tiktok: "https://www.tiktok.com/@azraltar",
};

export const hero: {
  title: Bi;
  subtitle: Bi;
} = {
  title: {
    bg: "Върни си своя вътрешен авторитет",
    en: "Reclaim your inner authority",
  },
  subtitle: {
    bg: "Семинари, коучинг и общност за хора, които са готови да поемат отговорност за собствения си живот и да създадат реалността, която заслужават.",
    en: "Seminars, coaching, and community for people ready to take responsibility for their own lives and create the reality they deserve.",
  },
};

export const mission: Bi = {
  bg: "Нашата мисия е да извадим разумите на хората от ръцете на културните инженери и да ги овластим до степен, до която сами да разберат, че те са единствените творци на своя живот. Ние вярваме, че всеки човек носи в себе си ресурса да се излекува, да намели своя път и да живее в съгласие със себе си.",
  en: "Our mission is to take people's minds out of the hands of cultural engineers and empower them to the point where they themselves realize they are the sole creators of their lives. We believe every person carries within them the resource to heal, find their path, and live in harmony with themselves.",
};

export const values: { title: Bi; desc: Bi }[] = [
  {
    title: { bg: "Отговорност", en: "Responsibility" },
    desc: {
      bg: "Първата стъпка към овластяването е да поемеш пълна отговорност за всичко в живота си — без обвинения, без жертва.",
      en: "The first step to empowerment is taking full responsibility for everything in your life — no blame, no victimhood.",
    },
  },
  {
    title: { bg: "Осъзнатост", en: "Awareness" },
    desc: {
      bg: "Промяната започва с виждане. Помагаме ти да видиш моделите, вярванията и механизмите, които те задържат.",
      en: "Change begins with seeing. We help you see the patterns, beliefs, and mechanisms that hold you back.",
    },
  },
  {
    title: { bg: "Автентичност", en: "Authenticity" },
    desc: {
      bg: "Истинската сила идва, когато живееш в съгласие със себе си — не с очакванията на другите.",
      en: "True power comes when you live in alignment with yourself — not with others' expectations.",
    },
  },
  {
    title: { bg: "Общност", en: "Community" },
    desc: {
      bg: "Не си сам. Създаваме пространство, в което хората се подкрепят взаимно в процеса на растеж.",
      en: "You are not alone. We create a space where people support each other in the process of growth.",
    },
  },
];

export type TeamMember = {
  name: string;
  role: Bi;
  bio: Bi;
  credentials: BiList;
};

export const team: TeamMember[] = [
  {
    name: "Деница Владимирова",
    role: {
      bg: "Сертифициран тета-практик, констелатор, фасилитатор",
      en: "Certified Theta practitioner, constellator, facilitator",
    },
    bio: {
      bg: "Деница е на 40 години и е сертифициран тета-практик, констелатор и практик, работещ с полето на Акаша. Нейната мисия е да помага на хората да намерят себе си, своя път и щастие, да бъдат успешни и заедно да създават живота, който заслужават.",
      en: "Denitsa is 40 years old, a certified Theta practitioner, constellator, and practitioner working with the Akashic field. Her mission is to help people find themselves, their path and happiness, be successful, and together create the life they deserve.",
    },
    credentials: {
      bg: [
        "Сертифициран тета-практик",
        "Системни констелации",
        "Работа с полето на Акаша",
        "Фасилитатор на групови процеси",
      ],
      en: [
        "Certified Theta practitioner",
        "Systemic constellations",
        "Akashic field work",
        "Group process facilitator",
      ],
    },
  },
];

export type Service = {
  slug: string;
  icon: string;
  title: Bi;
  who: Bi;
  desc: Bi;
  outcomes: BiList;
  format: Bi;
  duration: Bi;
  price: Bi;
};

export const services: Service[] = [
  {
    slug: "seminars",
    icon: "🌟",
    title: { bg: "Семинари", en: "Seminars" },
    who: {
      bg: "За хора, които искат дълбока трансформация в интензивен формат.",
      en: "For people who want deep transformation in an intensive format.",
    },
    desc: {
      bg: "Двудневни събития, в които се потапяме в процеси на самооткриване, енергийна работа, констелации и практики за овластяване. Всеки семинар е тематичен и създава пространство за пробив.",
      en: "Two-day events where we dive into processes of self-discovery, energy work, constellations, and empowerment practices. Each seminar is thematic and creates space for breakthroughs.",
    },
    outcomes: {
      bg: [
        "Яснота за това кой си и какво искаш",
        "Освобождаване от стари вярвания и травми",
        "Инструменти за самостоятелна работа",
        "Свързване с общност от съмишленици",
      ],
      en: [
        "Clarity on who you are and what you want",
        "Release from old beliefs and trauma",
        "Tools for self-guided work",
        "Connection with a community of like-minded people",
      ],
    },
    format: { bg: "На живо, офлайн", en: "Live, in-person" },
    duration: { bg: "2 дни (уикенд)", en: "2 days (weekend)" },
    price: { bg: "от 180 лв.", en: "from 180 BGN" },
  },
  {
    slug: "coaching",
    icon: "💬",
    title: { bg: "Индивидуален коучинг", en: "1:1 Coaching" },
    who: {
      bg: "За хора, които искат персонализирана работа и фокус върху своя процес.",
      en: "For people who want personalized work and focus on their process.",
    },
    desc: {
      bg: "Индивидуални сесии, в които работим върху твоите конкретни въпроси — било то връзки, кариера, здраве или смисъл. Комбинираме тета-хилинг, констелации и коучинг подход.",
      en: "Individual sessions where we work on your specific questions — whether relationships, career, health, or meaning. We combine Theta healing, constellations, and a coaching approach.",
    },
    outcomes: {
      bg: [
        "Персонализирана програма според твоите нужди",
        "Дълбока работа върху конкретни блокажи",
        "Подкрепа между сесиите",
        "Ускорен темп на промяна",
      ],
      en: [
        "Personalized program based on your needs",
        "Deep work on specific blocks",
        "Support between sessions",
        "Accelerated pace of change",
      ],
    },
    format: { bg: "Онлайн или на живо", en: "Online or in-person" },
    duration: { bg: "60–90 мин. на сесия", en: "60–90 min per session" },
    price: { bg: "от 120 лв. / сесия", en: "from 120 BGN / session" },
  },
  {
    slug: "group-programs",
    icon: "🤝",
    title: { bg: "Групови програми", en: "Group Programs" },
    who: {
      bg: "За хора, които искат продължителна работа в кръг от съмишленици.",
      en: "For people who want ongoing work in a circle of like-minded people.",
    },
    desc: {
      bg: "Месечни или тримесечни програми, в които малка група се среща редовно за дълбока работа. Силата на груповото поле ускорява процеса за всеки участник.",
      en: "Monthly or quarterly programs where a small group meets regularly for deep work. The power of the group field accelerates the process for each participant.",
    },
    outcomes: {
      bg: [
        "Продължителна подкрепа и отчетност",
        "Силата на груповото поле",
        "Задълбочени връзки с другите участници",
        "Интеграция на промяната във времето",
      ],
      en: [
        "Ongoing support and accountability",
        "The power of the group field",
        "Deep connections with other participants",
        "Integration of change over time",
      ],
    },
    format: { bg: "Онлайн, затворена група", en: "Online, closed group" },
    duration: { bg: "3–6 месеца", en: "3–6 months" },
    price: { bg: "по договаряне", en: "by arrangement" },
  },
];

export type EventItem = {
  slug: string;
  status: "upcoming" | "past";
  title: Bi;
  date: string; // ISO
  dateEnd: string; // ISO
  location: Bi;
  description: Bi;
  highlights: BiList;
  price: Bi;
  packages: { name: Bi; price: Bi; spots: Bi }[];
  capacity: number;
};

export const events: EventItem[] = [
  {
    slug: "lichnostno-ovlastqvane-primorsko-2025",
    status: "upcoming",
    title: {
      bg: "Личностно овластяване — Първо издание",
      en: "Personal Empowerment — First Edition",
    },
    date: "2025-08-24",
    dateEnd: "2025-08-25",
    location: {
      bg: "Хотели комплекс „Магнолия“, ММЦ Приморско",
      en: "Hotel Complex Magnolia, MMC Primorsko",
    },
    description: {
      bg: "Първото издание на семинара „Личностно овластяване“. Два дни на потапяне в процеси на самооткриване, енергийна работа, констелации и практики за овластяване. Открий кой си наистина и създай живота, който заслужаваш.",
      en: "The first edition of the Personal Empowerment seminar. Two days of immersion into processes of self-discovery, energy work, constellations, and empowerment practices. Discover who you really are and create the life you deserve.",
    },
    highlights: {
      bg: [
        "Тета-хилинг сесии",
        "Системни констелации",
        "Работа с полето на Акаша",
        "Практики за ежедневно овластяване",
        "Време за почивка и интеграция в природата",
      ],
      en: [
        "Theta healing sessions",
        "Systemic constellations",
        "Akashic field work",
        "Daily empowerment practices",
        "Time for rest and integration in nature",
      ],
    },
    price: { bg: "от 180 лв.", en: "from 180 BGN" },
    packages: [
      {
        name: { bg: "Стандартен", en: "Standard" },
        price: { bg: "180 лв.", en: "180 BGN" },
        spots: { bg: "Достъп до всички сесии", en: "Access to all sessions" },
      },
      {
        name: { bg: "VIP", en: "VIP" },
        price: { bg: "280 лв.", en: "280 BGN" },
        spots: {
          bg: "Първи ред + индивидуална сесия с Деница",
          en: "Front row + individual session with Denitsa",
        },
      },
    ],
    capacity: 40,
  },
];

export type Testimonial = {
  name: string;
  role: Bi;
  text: Bi;
};

export const testimonials: Testimonial[] = [
  {
    name: "Мария И.",
    role: { bg: "Участник в семинар", en: "Seminar participant" },
    text: {
      bg: "Семинарът промени начина, по който виждам себе си. За първи път разбрах, че не съм жертва на обстоятелствата. Деница създава пространство, в което се случва истинска магия.",
      en: "The seminar changed the way I see myself. For the first time I understood I am not a victim of circumstances. Denitsa creates a space where real magic happens.",
    },
  },
  {
    name: "Петър К.",
    role: { bg: "Клиент на коучинг", en: "Coaching client" },
    text: {
      bg: "След три сесии с Деница пуснах модели, които ме държаха 20 години. Сега се чувствам свободен и лек. Препоръчвам на всеки, който е готов за истинска работа.",
      en: "After three sessions with Denitsa I released patterns that held me for 20 years. Now I feel free and light. I recommend it to anyone ready for real work.",
    },
  },
  {
    name: "Елена Д.",
    role: { bg: "Участник в групова програма", en: "Group program participant" },
    text: {
      bg: "Груповата програма ми даде общност, която не знаех, че ми трябва. Заедно сме по-силни. Промяната, която търсех с години, се случи в рамките на няколко месеца.",
      en: "The group program gave me a community I didn't know I needed. Together we are stronger. The change I'd been seeking for years happened within a few months.",
    },
  },
  {
    name: "Стефан Н.",
    role: { bg: "Участник в семинар", en: "Seminar participant" },
    text: {
      bg: "Дойдох скептично. Тръгнах с яснота, която не съм имал от години. Това не е просто семинар — това е преживяване, което променя живота ти.",
      en: "I came skeptical. I left with clarity I hadn't had in years. This isn't just a seminar — it's an experience that changes your life.",
    },
  },
  {
    name: "Анна П.",
    role: { bg: "Клиент на коучинг", en: "Coaching client" },
    text: {
      bg: "Деница е дар. Работата с нея е дълбока, нежна и могъща едновременно. Помогна ми да видя себе си с очи на любов, а не на съд.",
      en: "Denitsa is a gift. Working with her is deep, gentle, and powerful at once. She helped me see myself with eyes of love, not judgment.",
    },
  },
  {
    name: "Димитър В.",
    role: { bg: "Участник в семинар", en: "Seminar participant" },
    text: {
      bg: "Приморско беше перфектното място. Природата, морето и работата се сляха в нещо, което няма как да опиша с думи. Трябва да се преживее.",
      en: "Primorsko was the perfect place. Nature, the sea, and the work blended into something I can't describe with words. It has to be experienced.",
    },
  },
];

export type BlogPost = {
  slug: string;
  title: Bi;
  excerpt: Bi;
  date: string;
  readTime: Bi;
  content: Bi; // simple text, paragraphs separated by \n\n
};

export const blogPosts: BlogPost[] = [
  {
    slug: "shto-e-ovlastqvane",
    title: {
      bg: "Какво е личностно овластяване (и какво не е)",
      en: "What personal empowerment is (and what it isn't)",
    },
    excerpt: {
      bg: "Овластяването не е позитивно мислене. Не е и его. То е способността да поемеш отговорност и да действаш от своя център.",
      en: "Empowerment isn't positive thinking. Nor is it ego. It's the ability to take responsibility and act from your center.",
    },
    date: "2025-07-15",
    readTime: { bg: "4 мин.", en: "4 min" },
    content: {
      bg: "Често чуваме думата „овластяване“ и си представяме нещо като увереност, сила, може би дори агресия. Но истинското овластяване е тихо.\n\nОвластяването е способността да стоиш в себе си, когато всичко наоколо се разклаща. Да знаеш кой си, дори когато другите ти казват, че си нещо друго.\n\nТо не е позитивно мислене. Позитивното мислене е покриване на реалността с хубава история. Овластяването е виждане на реалността такава, каквато е — и избиране как да действаш от там.\n\nТо не е и его. Егото се нуждае от външна валидация. Овластеният човек не се нуждае от нея — той знае своята стойност отвътре.\n\nПървата стъпка към овластяването е отговорност. Не частична, не условна — пълна. Когато поемеш отговорност за всичко в живота си, ти си взимаш силата да го промениш.",
      en: "We often hear the word \"empowerment\" and imagine something like confidence, strength, maybe even aggression. But true empowerment is quiet.\n\nEmpowerment is the ability to stand in yourself when everything around you is shaking. To know who you are, even when others tell you you're something else.\n\nIt isn't positive thinking. Positive thinking is covering reality with a nice story. Empowerment is seeing reality as it is — and choosing how to act from there.\n\nIt isn't ego either. Ego needs external validation. The empowered person doesn't need it — they know their worth from within.\n\nThe first step to empowerment is responsibility. Not partial, not conditional — full. When you take responsibility for everything in your life, you take back the power to change it.",
    },
  },
  {
    slug: "kulturni-inzhenieri",
    title: {
      bg: "Кои са „културните инженери“ и как ни влияят",
      en: "Who are the \"cultural engineers\" and how they affect us",
    },
    excerpt: {
      bg: "Всеки ден някой оформя мисленето ти без да пита. Кои са тези хора и как да си върнеш контрола?",
      en: "Every day someone shapes your thinking without asking. Who are these people and how do you take back control?",
    },
    date: "2025-07-28",
    readTime: { bg: "5 мин.", en: "5 min" },
    content: {
      bg: "„Културни инженери“ е термин, който използваме за всички сили, които оформят нашето мислене без нашето съгласие — медии, реклами, семейни модели, образователна система, социални норми.\n\nТе не са непременно лоши хора. Повечето от тях също са продукти на същата система. Но резултатът е, че живеем живот, който не е наш.\n\nПървият признак, че си под влияние на културен инженер: чувстваш вина, когато правиш нещо за себе си.\n\nВторият признак: вярваш, че щастието идва отвън — от пари, от връзка, от успех.\n\nТретият признак: животът ти изглежда правилно, но не се чувства тво.\n\nОвластяването започва, когато спреш да питаш „какво трябва“ и започнеш да питаш „какво искам аз“.\n\nТова не е егоизъм. Това е честност. И от тази честност се ражда истинският живот.",
      en: "\"Cultural engineers\" is a term we use for all the forces that shape our thinking without our consent — media, advertising, family patterns, the educational system, social norms.\n\nThey aren't necessarily bad people. Most of them are also products of the same system. But the result is that we live a life that isn't ours.\n\nThe first sign you're under the influence of a cultural engineer: you feel guilt when you do something for yourself.\n\nThe second sign: you believe happiness comes from outside — from money, from a relationship, from success.\n\nThe third sign: your life looks right, but doesn't feel like yours.\n\nEmpowerment begins when you stop asking \"what should I do\" and start asking \"what do I want.\"\n\nThis isn't selfishness. It's honesty. And from that honesty, real life is born.",
    },
  },
  {
    slug: "praktiki-za-dnevno-ovlastqvane",
    title: {
      bg: "Три практики за ежедневно овластяване",
      en: "Three practices for daily empowerment",
    },
    excerpt: {
      bg: "Малки упражнения, които ти помагат да стоиш в себе си всеки ден. Без ритуали, без сложни техники — просто присъствие.",
      en: "Small exercises that help you stay in yourself every day. No rituals, no complex techniques — just presence.",
    },
    date: "2025-08-10",
    readTime: { bg: "3 мин.", en: "3 min" },
    content: {
      bg: "Овластяването не е събитие — то е практика. Ето три прости неща, които можеш да правиш всеки ден.\n\n1. Утринна проверка. Преди да хванеш телефона, попитай себе си: „Как се чувствам днес? Какво ми трябва?“ Тридесет секунди ти стигат.\n\n2. Пауза преди реакция. Когато нещо те раздразни, поеми един дъх. Попитай: „Това моя ли е емоция, или чужда?“ После действай.\n\n3. Вечерен преглед. Преди сън, спомни си три неща, за които си благодарен. Не като формула — като чувство.\n\nТези практики изглеждат малки. Но направени ежедневно, те те връщат в себе си. А това е основата на всичко.",
      en: "Empowerment isn't an event — it's a practice. Here are three simple things you can do every day.\n\n1. Morning check-in. Before you grab your phone, ask yourself: \"How do I feel today? What do I need?\" Thirty seconds is enough.\n\n2. Pause before reaction. When something irritates you, take one breath. Ask: \"Is this my emotion, or someone else's?\" Then act.\n\n3. Evening review. Before sleep, recall three things you're grateful for. Not as a formula — as a feeling.\n\nThese practices seem small. But done daily, they bring you back to yourself. And that is the foundation of everything.",
    },
  },
];

// Helpers
export function getEventBySlug(slug: string): EventItem | undefined {
  return events.find((e) => e.slug === slug);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateRange(start: string, end: string, locale: Locale): string {
  const s = new Date(start);
  const e = new Date(end);
  const sameDay = s.toDateString() === e.toDateString();
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const loc = locale === "bg" ? "bg-BG" : "en-GB";
  if (sameDay) return s.toLocaleDateString(loc, opts);
  const sStr = s.toLocaleDateString(loc, { day: "numeric", month: "long" });
  const eStr = e.toLocaleDateString(loc, opts);
  return `${sStr} – ${eStr}`;
}

export function localized(name: Bi, locale: Locale): string {
  return name[locale];
}

// ─── Launch countdown target ────────────────────────────────────────────────
// Format: "YYYY-MM-DDTHH:mm:ss" in local time
export const launchDate = "2026-11-10T10:00:00";

// ─── Video feed ──────────────────────────────────────────────────────────────
// Add videos here. For TikTok, use the full video URL and extract the numeric
// video ID from it (the long number in the URL path).
// For Facebook, use the full video/post URL.
// To add more videos, simply append objects to this array.

export type VideoItem = {
  id: string; // unique internal id
  platform: "tiktok" | "instagram" | "facebook";
  url?: string; // full URL to the video/post
  videoId?: string; // TikTok numeric video ID (extracted from URL)
  src?: string; // local video path after fetching
  poster?: string; // local poster/thumbnail path
  caption: Bi;
  date: string; // ISO date for sorting
};

export const videos: VideoItem[] = [
  // ── TikTok videos (@azraltar) ──
  // Replace these with real video URLs from https://www.tiktok.com/@azraltar
  // Example format: https://www.tiktok.com/@azraltar/video/7298765432109876543
  {
    id: "tt-1",
    platform: "tiktok",
    url: "https://www.tiktok.com/@azraltar/video/7298765432109876543",
    videoId: "7298765432109876543",
    caption: {
      bg: "Какво е личностно овластяване? Кратко обяснение.",
      en: "What is personal empowerment? A short explanation.",
    },
    date: "2025-08-20",
  },
  {
    id: "tt-2",
    platform: "tiktok",
    url: "https://www.tiktok.com/@azraltar/video/7298765432109876544",
    videoId: "7298765432109876544",
    caption: {
      bg: "Три практики за ежедневно овластяване.",
      en: "Three practices for daily empowerment.",
    },
    date: "2025-08-15",
  },
  {
    id: "tt-3",
    platform: "tiktok",
    url: "https://www.tiktok.com/@azraltar/video/7298765432109876545",
    videoId: "7298765432109876545",
    caption: {
      bg: "Кои са „културните инженери“?",
      en: "Who are the \"cultural engineers\"?",
    },
    date: "2025-08-10",
  },
  // ── Facebook videos ──
  // Replace with real Facebook video/post URLs
  {
    id: "fb-1",
    platform: "facebook",
    url: "https://www.facebook.com/profile.php?id=61562005563695",
    caption: {
      bg: "Семинарът в Приморско — моменти от събитието.",
      en: "The Primorsko seminar — moments from the event.",
    },
    date: "2025-08-25",
  },
];

export function getVideosByPlatform(platform: "all" | "tiktok" | "facebook"): VideoItem[] {
  const sorted = [...videos].sort((a, b) => b.date.localeCompare(a.date));
  if (platform === "all") return sorted;
  return sorted.filter((v) => v.platform === platform);
}

// ─── Demo shop products ─────────────────────────────────────────────────────

export type ProductCategory = "bracelets" | "crystals" | "potions";

export type ProductItem = {
  slug: string;
  name: Bi;
  category: ProductCategory;
  price: number; // BGN
  description: Bi;
};

export const productCategories: { key: ProductCategory; label: Bi }[] = [
  { key: "bracelets", label: { bg: "Гривни", en: "Bracelets" } },
  { key: "crystals", label: { bg: "Кристали", en: "Crystals" } },
  { key: "potions", label: { bg: "Елексири", en: "Potions" } },
];

export const products: ProductItem[] = [
  {
    slug: "bracelet-clarity",
    name: { bg: "Гривна за яснота", en: "Clarity bracelet" },
    category: "bracelets",
    price: 28,
    description: {
      bg: "Натурални камъни, носещи фокус и вътрешна яснота.",
      en: "Natural stones bringing focus and inner clarity.",
    },
  },
  {
    slug: "bracelet-protection",
    name: { bg: "Гривна за защита", en: "Protection bracelet" },
    category: "bracelets",
    price: 32,
    description: {
      bg: "Черен обсидиан и хематит за енергийна граница.",
      en: "Black obsidian and hematite for energetic boundaries.",
    },
  },
  {
    slug: "crystal-amethyst",
    name: { bg: "Кристал Аметист", en: "Amethyst crystal" },
    category: "crystals",
    price: 24,
    description: {
      bg: "Успокояваща енергия за медитация и сън.",
      en: "Calming energy for meditation and sleep.",
    },
  },
  {
    slug: "crystal-rose-quartz",
    name: { bg: "Розов кварц", en: "Rose quartz" },
    category: "crystals",
    price: 22,
    description: {
      bg: "Нежна вибрация за любов и състрадание.",
      en: "Gentle vibration for love and compassion.",
    },
  },
  {
    slug: "potion-meditation-oil",
    name: { bg: "Масло за медитация", en: "Meditation oil" },
    category: "potions",
    price: 35,
    description: {
      bg: "Ароматна смес за дълбоко съсредоточаване.",
      en: "Aromatic blend for deep concentration.",
    },
  },
  {
    slug: "potion-moon-elixir",
    name: { bg: "Лунен еликсир", en: "Moon elixir" },
    category: "potions",
    price: 42,
    description: {
      bg: "Енергийна вода за работа с лунните цикли.",
      en: "Energetic water for working with moon cycles.",
    },
  },
];

export function getProductsByCategory(category: "all" | ProductCategory): ProductItem[] {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}
