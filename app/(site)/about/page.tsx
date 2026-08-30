"use client";

import { useLocale } from "@/components/LocaleProvider";
import { tr } from "@/lib/i18n";
import { mission, values, team, localized } from "@/lib/content";

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

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-stone-900">
          {tr("section_mission_title", locale)}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-stone-600">
          {mission[locale]}
        </p>
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

      {/* Values */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-stone-900">
          {tr("section_values_title", locale)}
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title.en} className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="font-semibold text-amber-800">{v.title[locale]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{v.desc[locale]}</p>
            </div>
          ))}
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
                    {member.role[locale]}
                  </p>
                  <p className="mt-4 leading-relaxed text-stone-600">
                    {member.bio[locale]}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.credentials[locale].map((c) => (
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
