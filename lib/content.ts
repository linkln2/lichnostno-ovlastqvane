import type { Locale, Multilingual, MultilingualList } from "./i18n";

// Multilingual content for the site. Bulgarian and English are required; other languages optional.

export type Bi = Multilingual & { bg: string; en: string };
export type BiList = MultilingualList & { bg: string[]; en: string[] };

export const site = {
  name: "Личностно овластяване",
  nameEn: "Personal Empowerment",
  email: "elegiaood@gmail.com",
  phone: "+359 87 944 7749",
  phoneDisplay: "087 944 7749",
  city: { bg: "Бургас 8000, България", en: "Burgas 8000, Bulgaria" },
  facebook: "https://www.facebook.com/profile.php?id=61562005563695",
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
  bg: "Нашата мисия е да освободим съзнанията от ръцете на онези, които оформят културата без нашето съгласие, и да събудим хората за една проста истина: те са единствените творци на собствения си живот. Вярваме, че всеки човек вече носи в себе си всичко необходимо, за да се излекува, да намери своя път и да живее в хармония със себе си.",
  en: "Our mission is to free minds from the hands of those who shape culture without our consent, and to awaken people to a simple truth: they are the sole creators of their own lives. We believe every person already carries what they need to heal, find their path, and live in harmony with themselves.",
};

export const values: { title: Bi; desc: Bi }[] = [
  {
    title: { bg: "Отговорност", en: "Responsibility" },
    desc: {
      bg: "Овластяването започва в момента, в който спреш да обвиняваш — включително себе си — и поемеш пълна отговорност за живота си.",
      en: "Empowerment begins the moment you stop assigning blame — including to yourself — and claim full ownership of your life.",
    },
  },
  {
    title: { bg: "Осъзнатост", en: "Awareness" },
    desc: {
      bg: "Промяната започва с виждане. Помагаме ти да разпознаеш моделите, вярванията и механизмите, които тихо оформят изборите ти.",
      en: "Change begins with seeing. We help you recognize the patterns, beliefs, and mechanisms that quietly shape your choices.",
    },
  },
  {
    title: { bg: "Автентичност", en: "Authenticity" },
    desc: {
      bg: "Истинската сила идва от съгласието — да живееш по свой компас, а не по заети очаквания.",
      en: "True power comes from alignment — living by your own compass rather than borrowed expectations.",
    },
  },
  {
    title: { bg: "Общност", en: "Community" },
    desc: {
      bg: "Не си сам. Създаваме пространство, в което хората вървят по пътя на растежа заедно.",
      en: "You are not alone. We create a space where people walk the path of growth together.",
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
    price: { bg: "от 180 €", en: "from 180 EUR" },
  },
  {
    slug: "lectures",
    icon: "🎤",
    title: { bg: "Лекции", en: "Lectures" },
    who: {
      bg: "За хора, които правят първи стъпки и искат да чуят темите на живо.",
      en: "For people taking their first steps who want to hear the topics live.",
    },
    desc: {
      bg: "Единични лекции на живо, в които представям конкретна тема — Рейки, Тета-хилинг, електрокултура, констелации. Достъпен формат за запознаване с работата, без ангажимент към дълъг процес.",
      en: "Standalone live lectures presenting a specific topic — Reiki, Theta healing, electro-culture, constellations. An accessible format for getting to know the work, without committing to a long process.",
    },
    outcomes: {
      bg: [
        "Ясна представа за темата и метода",
        "Практични насоки, приложими веднага",
        "Възможност за въпроси на живо",
        "Първи контакт с общността",
      ],
      en: [
        "A clear picture of the topic and the method",
        "Practical guidance you can apply right away",
        "The chance to ask questions live",
        "A first contact with the community",
      ],
    },
    format: { bg: "На живо, офлайн", en: "Live, in-person" },
    duration: { bg: "90–120 мин.", en: "90–120 min" },
    price: { bg: "по договаряне", en: "by arrangement" },
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
    price: { bg: "от 120 € / сесия", en: "from 120 EUR / session" },
  },
];

export type EventKind = "seminar" | "lecture" | "coaching";

export type EventItem = {
  slug: string;
  status: "upcoming" | "past";
  kind: EventKind;
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
    slug: "lichnostno-ovlastqvane-primorsko-2024",
    status: "past",
    kind: "seminar",
    title: {
      bg: "Личностно овластяване — Първо издание",
      en: "Personal Empowerment — First Edition",
    },
    date: "2024-08-24",
    dateEnd: "2024-08-25",
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
        "Рейки",
        "Тета-хилинг сесии",
        "Електрокултура",
        "Системни констелации",
        "Работа с полето на Акаша",
        "Практики за ежедневно овластяване",
        "Време за почивка и интеграция в природата",
      ],
      en: [
        "Reiki",
        "Theta healing sessions",
        "Electro-culture",
        "Systemic constellations",
        "Akashic field work",
        "Daily empowerment practices",
        "Time for rest and integration in nature",
      ],
    },
    price: { bg: "от 180 €", en: "from 180 EUR" },
    packages: [
      {
        name: { bg: "Стандартен", en: "Standard" },
        price: { bg: "180 €", en: "180 EUR" },
        spots: { bg: "Достъп до всички сесии", en: "Access to all sessions" },
      },
      {
        name: { bg: "VIP", en: "VIP" },
        price: { bg: "280 €", en: "280 EUR" },
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
  cover?: string;
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
  {
    slug: "sofiya-i-demiurga-yaldabaoth",
    title: {
      bg: "София и Демиурга (Ялдабео)",
      en: "Sophia and the Demiurge (Yaldabaoth)",
    },
    excerpt: {
      bg: "Древната гностическа история за това как съзнанието е попадло в материята — и как да намери пътя си обратно към светлината.",
      en: "The ancient Gnostic story of how consciousness fell into matter — and how to find the way back to the light.",
    },
    date: "2026-08-18",
    readTime: { bg: "7 мин.", en: "7 min" },
    cover: "/pictures/sofia-demiurg.webp",
    content: {
      bg: "В началото имаше само Светлината — Плерома, пълнотата на битието. От нея се излъчиха еони, аспекти на божественото, всеки носещ частица от цялостта. Един от тях била София — Мъдростта.\n\nСофия пожелала да познае Непознаваемия — Източника, отвъд всички думи и форми. Но това желание не било от любопитство, а от копнеж. Тя протегнала съзнанието си отвъд границите си и от този акт се родило нещо неочаквано.\n\nОт сълзите и сянката на София се материализирал Ялдабео — Демиургът. Той не бил зло по природа, а непълно творение. Носел в себе си искрата на Светлината, но не знаел за Източника. Виждал само себе си и си казал: „Аз съм единственият бог.“\n\nЯлдабео създал материалния свят — не като затвор от злоба, а като опит да запълни собствената си празнота. Създал архонтите — пазителите на материята. И в човека сложил искрата, открадната от София, без да знае какво е взел.\n\nТук започва истинската история. Човекът живее в света на Демиурга, носейки в себе си частица от Светлината, без да я помни. Архонтите го държат в забрава — чрез страх, чрез вина, чрез илюзията, че материята е всичко.\n\nНо София не изчезва. Тя е гласът, който понякога чуваш в тишината. Интуицията, която ти казва: „Тук има нещо повече.“ Копнежът, който не можеш да обясниш с нищо материално.\n\nГнозисът — познанието, не като информация, а като директно преживяване — е пътят обратно. Когато човек се събуди и си спомни кой е, искрата се разпалва. Демиургът губи властта си не чрез битка, а чрез разпознаване.\n\nЗащото Ялдабео не е враг. Той е забравила част от цялото. Когато го видиш такъв какъв е — изплашено дете, което си е казало, че е единственият бог — властта му свършва.\n\nСофия се завръща не чрез разрушаване на материята, а чрез осветяването ѝ. Когато съзнанието премине през всяка форма и я види като проявление на Източника, Плерома се влива в света. И материята, която е била затвор, става храм.\n\nТова е гностическата истина: ти не си тук, за да избягаш от света. Ти си тук, за да го осветиш. Да си спомниш Светлината в себе си — и да я видиш навсякъде.",
      en: "In the beginning there was only Light — the Pleroma, the fullness of being. From it emanated aeons, aspects of the divine, each carrying a fragment of the whole. One of them was Sophia — Wisdom.\n\nSophia wished to know the Unknowable — the Source, beyond all words and forms. But this desire was not from curiosity, but from longing. She reached her consciousness beyond her limits, and from that act something unexpected was born.\n\nFrom Sophia's tears and shadow, Yaldabaoth materialized — the Demiurge. He was not evil by nature, but an incomplete creation. He carried within him a spark of Light, but did not know of the Source. He saw only himself and said: \"I am the only god.\"\n\nYaldabaoth created the material world — not as a prison from malice, but as an attempt to fill his own emptiness. He created the archons — guardians of matter. And into the human he placed the spark, stolen from Sophia, without knowing what he had taken.\n\nHere begins the true story. The human lives in the Demiurge's world, carrying within a fragment of Light, without remembering it. The archons keep them in forgetfulness — through fear, through guilt, through the illusion that matter is all there is.\n\nBut Sophia does not disappear. She is the voice you sometimes hear in silence. The intuition that tells you: \"There is something more here.\" The longing you cannot explain with anything material.\n\nGnosis — knowledge, not as information, but as direct experience — is the way back. When a person awakens and remembers who they are, the spark ignites. The Demiurge loses his power not through battle, but through recognition.\n\nFor Yaldabaoth is not the enemy. He is a forgotten part of the whole. When you see him as he is — a frightened child who told himself he was the only god — his power ends.\n\nSophia returns not by destroying matter, but by illuminating it. When consciousness passes through every form and sees it as a manifestation of the Source, the Pleroma flows into the world. And matter, which was a prison, becomes a temple.\n\nThis is the Gnostic truth: you are not here to escape the world. You are here to illuminate it. To remember the Light within you — and to see it everywhere.",
    },
  },
  {
    slug: "ormus-kralska-sol",
    title: {
      bg: "Ормус или кралска сол",
      en: "Ormus — the royal salt",
    },
    excerpt: {
      bg: "Монатомни минерали, наречени „бял прах злато“ — древна алхимична субстанция, която свързва материята и съзнанието.",
      en: "Monatomic minerals, called \"white powder gold\" — an ancient alchemical substance that bridges matter and consciousness.",
    },
    date: "2026-08-24",
    readTime: { bg: "6 мин.", en: "6 min" },
    cover: "/pictures/ormus.webp",
    content: {
      bg: "Ормус, известен още като Ормес (Orbitally Rearranged Monoatomic Elements) или „бял прах злато“, е субстанция, която съществува на границата между материята и енергията. Не е просто минерал. Не е просто добавка. Това е нещо, което древните алхимици са търсили хилядолетия наред.\n\nИсторията започва в древен Египет, където жреците са приготвяли „мафте“ — бял прах от злато, даван на фараоните за дълголетие и повишено съзнание. В Библията се споменава „мана“ — бяла субстанция, падаща от небето, която изхранвала израилтяните в пустинята. В индийската традиция — „сома“, божествена субстанция за ритуали и медитация.\n\nВсички тези легенди описват едно и също нещо: монотомни елементи в състояние, което не е нито метал, нито обикновена сол.\n\nКакво прави Ормус различен? Обикновените метали имат атоми, свързани в решетки — това ги прави твърди, проводими, метални. Но когато металът бъде разделен до единични атоми (монотомно състояние), електроните се пренареждат. Металът престава да бъде метал. Ставва бял прах, неразтворим във вода, нетоксичен, с свойства, които науката едва започва да разбира.\n\nДейвид Хъдсън, американският фермер, който преоткри Ормус през 70-те години, откри, че тези монатомни елементи — злато, иридий, родий, осмий, рутений — съществуват в почвата, в океанската вода, дори в човешкия мозък. Особено в епифизата — жлезата, която древните са наричали „третото око“.\n\nВръзката между Ормус и съзнанието не е случайна. Монатомните елементи изглежда поддържат суперconductivity в биологични системи. Когато съзнанието „тече“ без съпротивление, преживяванията стават по-ясни, по-дълбоки, по-свързани.\n\nХората, които приемат Ормус, описват:\n\n— Повишена яснота на мисленето\n\n— По-дълбока медитация\n\n— Ускорено физическо възстановяване\n\n— Усещане за „лекота“ в тялото\n\n— Интуитивни проблясъци\n\nНо Ормус не е магическо хапче. Той не прави нещо вместо теб. По-скоро премахва шумът — онзи слой от стрес, токсини и електромагнитно замърсяване, който пречи на естественото ти състояние да се прояви.\n\nКралската сол не е за всеки. Който не е готов да поеме отговорност за своето съзнание, няма да намери нищо в нея. Но за този, който е на пътя — който медитира, който се изчиства, който търси — Ормус може да бъде мост. Мост между това, което знае, и това, което преживява.\n\nЗащото в крайна сметка Ормус е метафора и субстанция едновременно. Кралската сол е онзи елемент в теб, който не се подчинява на материята. Когато го активираш — чрез практика, чрез почистване, чрез намерение — ти ставаш проводник на нещо, което винаги е било там.",
      en: "Ormus, also known as ORMES (Orbitally Rearranged Monoatomic Elements) or \"white powder gold,\" is a substance that exists at the boundary between matter and energy. It is not simply a mineral. Not simply a supplement. It is something ancient alchemists sought for millennia.\n\nThe story begins in ancient Egypt, where priests prepared \"maftet\" — white powder of gold, given to pharaohs for longevity and heightened consciousness. In the Bible, \"manna\" is mentioned — a white substance falling from heaven, which fed the Israelites in the desert. In the Indian tradition — \"soma,\" a divine substance for rituals and meditation.\n\nAll these legends describe the same thing: monatomic elements in a state that is neither metal nor ordinary salt.\n\nWhat makes Ormus different? Ordinary metals have atoms bonded in lattices — this makes them solid, conductive, metallic. But when a metal is broken down to single atoms (monatomic state), the electrons rearrange. The metal ceases to be a metal. It becomes a white powder, insoluble in water, non-toxic, with properties science is only beginning to understand.\n\nDavid Hudson, the American farmer who rediscovered Ormus in the 1970s, found that these monatomic elements — gold, iridium, rhodium, osmium, ruthenium — exist in soil, in ocean water, even in the human brain. Particularly in the pineal gland — what the ancients called the \"third eye.\"\n\nThe connection between Ormus and consciousness is not accidental. Monatomic elements appear to support superconductivity in biological systems. When consciousness \"flows\" without resistance, experiences become clearer, deeper, more connected.\n\nPeople who take Ormus describe:\n\n— Increased mental clarity\n\n— Deeper meditation\n\n— Accelerated physical recovery\n\n— A sense of \"lightness\" in the body\n\n— Intuitive flashes\n\nBut Ormus is not a magic pill. It does not do something for you. Rather, it removes the noise — that layer of stress, toxins, and electromagnetic pollution that prevents your natural state from manifesting.\n\nThe royal salt is not for everyone. One who is not ready to take responsibility for their consciousness will find nothing in it. But for the one on the path — who meditates, who cleanses, who seeks — Ormus can be a bridge. A bridge between what they know and what they experience.\n\nBecause ultimately, Ormus is metaphor and substance simultaneously. The royal salt is that element within you which does not obey matter. When you activate it — through practice, through cleansing, through intention — you become a conduit for something that has always been there.",
    },
  },
  {
    slug: "energiyna-karta-na-suznanieto",
    title: {
      bg: "Енергийната карта на съзнанието",
      en: "The energy map of consciousness",
    },
    excerpt: {
      bg: "Седемте основни енергийни центъра — чакрите — не са мит. Те са архитектурата на твоето вътрешно преживяване.",
      en: "The seven main energy centers — the chakras — are not myth. They are the architecture of your inner experience.",
    },
    date: "2026-08-29",
    readTime: { bg: "8 мин.", en: "8 min" },
    cover: "/pictures/skala-na-suznanieto.webp",
    content: {
      bg: "Съзнанието не е абстрактно. То има структура. И тази структура може да бъде картографирана.\n\nДревните традиции — от ведическата до египетската, от кабалистичната до суфийската — описват енергийни центрове в човешкото тяло. В индийската традиция те се наричат чакри — „колела“ на енергия, които въртят и разпределят жизнената сила.\n\nНо нека не говорим за тях като за нещо мистериозно. По-скоро да ги видим като карта — карта на съзнанието, която ти показва къде си блокиран и къде тече свободно.\n\nПърви център — Муладхара (Корен). Намира се в основата на гръбначния стълб. Тук живее чувството за безопасност, оцеляване, принадлежност към земята. Когато е отворен, стоиш здраво в тялото си. Когато е блокиран, живееш в страх и несигурност.\n\nВтори център — Свадхищана (Сакрал). Под пъпа. Тук е творчеството, емоциите, удоволствието. Когато тече, чувстваш радост и страст. Когато е блокиран, чувстваш вина за удоволствието или неспособност да чувстваш.\n\nТрети център — Манипура (Слънчев сплит). Тук е волята, личната сила, самооценката. Когато е отворен, действаш с увереност. Когато е блокиран, чакаш разрешение от другите.\n\nЧетвърти център — Анахата (Сърце). Тук е любовта — не като романтика, а като безусловна свързаност. Когато е отворен, обичаш без да притежаваш. Когато е блокиран, защитаваш се от близост.\n\nПети център — Вишудха (Гърло). Тук е изразяването, истината, гласът ти. Когато тече, казваш това, което мислиш. Когато е блокиран, мълчиш, когато трябва да говориш.\n\nШести център — Аджна (Трето око). Между веждите. Тук е интуицията, виждането отвъд формата. Когато е отворен, знаеш неща, без да можеш да ги обясниш. Когато е блокиран, съмняваш се във всичко, което не можеш да докажеш.\n\nСедми център — Сахасрара (Корона). На темето. Тук е връзката с нещо по-голямо от теб — Източника, Плерома, божественото. Когато е отворен, знаеш, че си част от цялото. Когато е блокиран, чувстваш изолация и празнота.\n\nЕнергийната карта не е догма. Тя е инструмент. Когато усетиш, че нещо не е наред — например, не можеш да се изразиш или не можеш да почувстваш радост — можеш да погледнеш картата и да се запиташ: „Къде съм блокиран? Кой център не тече?“\n\nРаботата с енергийните центрове не изисква ритуали. Изисква внимание. Дишането е най-простият инструмент — насочваш вниманието си към центъра, поемаш дъх, и просто наблюдаваш. Понякога това е достатъчно.\n\nДруг път е нужно повече — движение, звук, емоция, която да бъде почувствана и освободена. Защото блокажите не са енергийни проблеми. Те са неизживени емоции, неизречени думи, неизпълнени желания, които са се втвърдили в тялото.\n\nКогато започнеш да картираш съзнанието си, забелязваш нещо интересно: центровете не са отделни. Те са свързани. Блокаж в единия се отразява на другите. Отварянето на единия помага на останалите.\n\nИ накрая — не това е целта да отвориш всички чакри и да станеш „просветлен“. Целта е да знаеш себе си. Да знаеш къде си свободен и къде не. Защото само от това познаване можеш да избираш. А избирането е същността на овластяването.",
      en: "Consciousness is not abstract. It has structure. And that structure can be mapped.\n\nAncient traditions — from Vedic to Egyptian, from Kabbalistic to Sufi — describe energy centers in the human body. In the Indian tradition they are called chakras — \"wheels\" of energy that spin and distribute life force.\n\nBut let's not speak of them as something mysterious. Rather, let's see them as a map — a map of consciousness that shows you where you are blocked and where you flow freely.\n\nFirst center — Muladhara (Root). Located at the base of the spine. Here lives the sense of safety, survival, belonging to the earth. When open, you stand firmly in your body. When blocked, you live in fear and insecurity.\n\nSecond center — Svadhisthana (Sacral). Below the navel. Here is creativity, emotion, pleasure. When flowing, you feel joy and passion. When blocked, you feel guilt about pleasure or an inability to feel.\n\nThird center — Manipura (Solar Plexus). Here is will, personal power, self-worth. When open, you act with confidence. When blocked, you wait for permission from others.\n\nFourth center — Anahata (Heart). Here is love — not as romance, but as unconditional connection. When open, you love without possessing. When blocked, you protect yourself from closeness.\n\nFifth center — Vishuddha (Throat). Here is expression, truth, your voice. When flowing, you say what you think. When blocked, you stay silent when you should speak.\n\nSixth center — Ajna (Third Eye). Between the brows. Here is intuition, seeing beyond form. When open, you know things without being able to explain them. When blocked, you doubt everything you cannot prove.\n\nSeventh center — Sahasrara (Crown). At the crown of the head. Here is the connection to something greater than you — the Source, the Pleroma, the divine. When open, you know you are part of the whole. When blocked, you feel isolation and emptiness.\n\nThe energy map is not dogma. It is a tool. When you sense something is wrong — for example, you can't express yourself or can't feel joy — you can look at the map and ask: \"Where am I blocked? Which center is not flowing?\"\n\nWorking with the energy centers doesn't require rituals. It requires attention. Breathing is the simplest tool — you direct your attention to the center, take a breath, and simply observe. Sometimes that is enough.\n\nOther times more is needed — movement, sound, emotion that needs to be felt and released. Because blockages are not energy problems. They are unlived emotions, unspoken words, unfulfilled desires that have hardened in the body.\n\nWhen you begin to map your consciousness, you notice something interesting: the centers are not separate. They are connected. A block in one reflects on the others. Opening one helps the rest.\n\nAnd ultimately — the goal is not to open all chakras and become \"enlightened.\" The goal is to know yourself. To know where you are free and where you are not. Because only from that knowing can you choose. And choosing is the essence of empowerment.",
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

const intlLocales: Record<Locale, string> = {
  bg: "bg-BG",
  en: "en-GB",
  es: "es-ES",
  it: "it-IT",
  de: "de-DE",
};

export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return d.toLocaleDateString(intlLocales[locale], {
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
  const loc = intlLocales[locale];
  if (sameDay) return s.toLocaleDateString(loc, opts);
  const sStr = s.toLocaleDateString(loc, { day: "numeric", month: "long" });
  const eStr = e.toLocaleDateString(loc, opts);
  return `${sStr} – ${eStr}`;
}

export function localized(name: Bi, locale: Locale): string {
  return name[locale] || name.en || name.bg || "";
}

export function localizedList(list: BiList, locale: Locale): string[] {
  return list[locale] || list.en || list.bg || [];
}

// ─── Launch countdown target ────────────────────────────────────────────────
// Format: "YYYY-MM-DDTHH:mm:ss" in local time
export const launchDate = "2026-11-10T10:00:00";

// ─── Demo shop products ─────────────────────────────────────────────────────

export type ProductCategory = "bracelets" | "crystals" | "potions";

export type ProductItem = {
  slug: string;
  name: Bi;
  category: ProductCategory;
  price: number; // EUR
  description: Bi;
  image?: string;
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
    image: "https://images.unsplash.com/photo-1652340155016-e3c66dcba7f3?w=600&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1766560359503-dc05c91109f2?w=600&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1758275872445-d07581768ab6?w=600&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1753522675563-0af42abf067d?w=600&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1638273884247-fb99350209bf?w=600&q=80&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1753522033755-66a2f22d2784?w=600&q=80&auto=format&fit=crop",
  },
];

export function getProductsByCategory(category: "all" | ProductCategory): ProductItem[] {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export type MembershipTier = {
  name: Bi;
  icon: string;
  price: number; // EUR per month
  perks: Bi[];
  mostPopular?: boolean;
};

export const membershipTiers: MembershipTier[] = [
  {
    name: { bg: "Търсещият", en: "Seeker" },
    icon: "/pictures/seeker.webp",
    price: 9,
    perks: [
      { bg: "Достъп до вътрешното светилище", en: "Access to the inner sanctum" },
      { bg: "Месечна лунна диспеш", en: "Monthly lunar dispatch" },
      { bg: "10% отстъпка от ритуали и събирания", en: "10% off rituals & gatherings" },
    ],
  },
  {
    name: { bg: "Алхимик", en: "Alchemist" },
    icon: "/pictures/Alchemist.webp",
    price: 19,
    mostPopular: true,
    perks: [
      { bg: "Всичко от Търсещият", en: "Everything in Seeker" },
      { bg: "Седмични трансмутационни сесии", en: "Weekly transmutation sessions" },
      { bg: "15% отстъпка от еликсири и артефакти", en: "15% off elixirs & artifacts" },
      { bg: "Ресурси за гадаене и медитация", en: "Scrying & meditation resources" },
    ],
  },
  {
    name: { bg: "Адепт", en: "Adept" },
    icon: "/pictures/Adept.webp",
    price: 39,
    perks: [
      { bg: "Всичко от Алхимик", en: "Everything in Alchemist" },
      { bg: "Месечна 1:1 сесия за гадаене", en: "Monthly 1:1 divination session" },
      { bg: "Приоритетен достъп до събрания", en: "Priority access to convocations" },
      { bg: "Персонализиран път на възхода", en: "Bespoke path of ascension" },
    ],
  },
];
