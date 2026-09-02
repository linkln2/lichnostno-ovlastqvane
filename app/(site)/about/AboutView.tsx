"use client";

import { useLocale } from "@/components/LocaleProvider";
import { tr, getLocalized, getLocalizedList } from "@/lib/i18n";
import { mission, values, team, localized } from "@/lib/content";
import { ParticleBurst } from "@/components/ParticleBurst";
import { SolarSystemOrbits } from "@/components/SolarSystemOrbits";

export default function AboutPage() {
  const { locale } = useLocale();

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            {tr("nav_about", locale)}
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            {locale === "bg"
              ? "Инициатива за личностно развитие, овластяване и пробуждане."
              : "An initiative for personal growth, empowerment, and awakening."}
          </p>
        </div>
      </section>

      {/* Mission + Values — centered around holy.png */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-50 py-20 sm:py-28">
        {/* Particle burst effect */}
        <ParticleBurst />

        {/* Radial glow behind the image */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(251,191,36,0) 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Section title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">
              {tr("section_mission_title", locale)}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">
              {getLocalized(mission, locale)}
            </p>
          </div>

          {/* Center image with values orbiting */}
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-12">
            {/* Left values (2) */}
            <div className="space-y-6 lg:space-y-8">
              {values.slice(0, 2).map((v, i) => (
                <ValueCard
                  key={v.title.en}
                  title={getLocalized(v.title, locale)}
                  desc={getLocalized(v.desc, locale)}
                  icon={valueIcons[i]}
                  align="right"
                />
              ))}
            </div>

            {/* Center image */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Solar system orbits behind image */}
                <SolarSystemOrbits className="absolute inset-0 z-0 opacity-80" />
                {/* Glow */}
                <div className="absolute inset-0 -m-4 rounded-full bg-amber-300/20 blur-2xl" />
                <img
                  src="/pictures/holy.webp"
                  alt={locale === "bg" ? "Свещенно" : "Sacred"}
                  className="relative z-10 h-96 w-auto rounded-2xl object-cover shadow-2xl sm:h-[32rem] lg:h-[40rem]"
                />
              </div>
            </div>

            {/* Right values (2) */}
            <div className="space-y-6 lg:space-y-8">
              {values.slice(2, 4).map((v, i) => (
                <ValueCard
                  key={v.title.en}
                  title={getLocalized(v.title, locale)}
                  desc={getLocalized(v.desc, locale)}
                  icon={valueIcons[i + 2]}
                  align="left"
                />
              ))}
            </div>
          </div>

          {/* Mobile: values below image in a grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:hidden">
            {values.map((v, i) => (
              <div
                key={v.title.en}
                className="rounded-2xl border border-amber-200/50 bg-white/70 p-5 backdrop-blur-sm"
              >
                <div className="mb-2 text-2xl text-amber-600">{valueIcons[i]}</div>
                <h3 className="font-semibold text-amber-800">{getLocalized(v.title, locale)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">{getLocalized(v.desc, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900">
            {locale === "bg" ? "Историята" : "The story"}
          </h2>
          <div className="mt-6 space-y-4 text-stone-600 leading-relaxed">
            {locale === "bg" ? (
              <>
                <p>
                  „Личностно овластяване“ се роди от простото наблюдение: хората живеят живот, който не е техен. Живеят по чужди сценарии, чужди очаквания, чужди страхове. И се чудят защо не са щастливи.
                </p>
                <p>
                  Деница Владимирова работи с хора от години — като тета-практик, констелатор и фасилитатор. Отново и отново виждаше едно и също: хората не се нуждаят от спасител. Нуждаят се от някой, който да им покаже, че спасителят са те самите.
                </p>
                <p>
                  Така се роди идеята за семинар — пространство, в което хората могат да се откъснат от ежедневието, да се потопят в себе си и да се върнат у дома с нещо истинско. Първото издание се проведе в Приморско, сред природата и морето.
                </p>
                <p>
                  Това е само началото. Мисията ни е да създадем общност от хора, които живеят от своя център — и които помагат на другите да направят същото.
                </p>
              </>
            ) : (
              <>
                <p>
                  "Personal Empowerment" was born from a simple observation: people live a life that isn't theirs. They live by others' scripts, others' expectations, others' fears. And they wonder why they aren't happy.
                </p>
                <p>
                  Denitsa Vladimirova has worked with people for years — as a Theta practitioner, constellator, and facilitator. Again and again she saw the same thing: people don't need a savior. They need someone to show them that the savior is themselves.
                </p>
                <p>
                  That's how the idea for a seminar was born — a space where people can break away from daily life, immerse themselves, and return home with something real. The first edition took place in Primorsko, surrounded by nature and the sea.
                </p>
                <p>
                  This is just the beginning. Our mission is to create a community of people who live from their center — and who help others do the same.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900">
            {tr("section_team_title", locale)}
          </h2>
          <div className="mt-12 space-y-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col gap-6 rounded-2xl border border-stone-200 bg-stone-50 p-6 sm:flex-row sm:p-8"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-amber-400 text-3xl font-bold text-amber-900">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-stone-900">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-amber-700">
                    {getLocalized(member.role, locale)}
                  </p>
                  <p className="mt-4 leading-relaxed text-stone-600">
                    {getLocalized(member.bio, locale)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {getLocalizedList(member.credentials, locale).map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Value card component ────────────────────────────────────────

const valueIcons = ["✦", "◉", "❋", "◈"];

function ValueCard({
  title,
  desc,
  icon,
  align,
}: {
  title: string;
  desc: string;
  icon: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`rounded-2xl border border-amber-200/50 bg-white/70 p-6 backdrop-blur-sm transition-all hover:border-amber-300/80 hover:bg-white/90 hover:shadow-lg ${
        align === "right" ? "lg:text-right" : "lg:text-left"
      }`}
    >
      <div className={`mb-2 text-2xl text-amber-600 ${align === "right" ? "lg:text-right" : "lg:text-left"}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-amber-800">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-stone-600">{desc}</p>
    </div>
  );
}
