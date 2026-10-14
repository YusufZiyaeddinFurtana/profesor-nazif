import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale } from "../../../i18n/LocaleProvider";
import { programs, type Program } from "../../catalog/types";
import { categories } from "../../education/data/categories";
import { localizeCategory } from "../../../i18n/content/categories";
import { instructors } from "../../instructors/data/instructors";
import { bookingCalendars } from "../bookingConfig";
import { calendarTarget } from "../calendar";
import { Arrow } from "../../../components/ui/Arrow";
export function BookingPage() {
  const { locale, t } = useLocale();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState<Program | "">("");
  const [topic, setTopic] = useState("");
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const steps = [
    t("bookingDetails"),
    t("bookingProgram"),
    t("bookingTopic"),
    t("bookingTime"),
  ];
  const selected = categories.find(
    (c) => c.program === program && c.slug === topic,
  );
  const category = selected ? localizeCategory(selected, locale) : undefined;
  const binding = bookingCalendars.find(
    (c) => c.program === program && c.categorySlug === topic,
  );
  const calendar = binding ? calendarTarget(binding.url) : undefined;
  const instructor = instructors.find((i) => i.id === binding?.instructorId);
  useEffect(() => {
    document.title = `${t("bookingTitle")} — Profesör Nazif`;
  }, [t]);
  useEffect(() => {
    stepHeading.current?.focus({ preventScroll: true });
  }, [step]);
  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 0 && !name.trim()) return;
    setStep((value) => Math.min(value + 1, 3));
  }
  return (
    <section className="section-wrap booking-page">
      <header className="booking-heading">
        <h1>{t("bookingTitle")}</h1>
        <p>{t("bookingDescription")}</p>
      </header>
      <ol className="booking-steps" aria-label={t("bookingTitle")}>
        {steps.map((label, index) => (
          <li
            key={index}
            aria-current={step === index ? "step" : undefined}
            className={step > index ? "step-done" : ""}
          >
            <span>{index + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="booking-layout">
        <div className="booking-workspace">
          <h2 ref={stepHeading} tabIndex={-1}>
            {step === 0
              ? t("bookingDetails")
              : step === 1
                ? t("selectProgram")
                : step === 2
                  ? t("selectTopic")
                  : t("bookingTime")}
          </h2>
          <form onSubmit={next}>
            {step === 0 && (
              <div className="booking-fields">
                <label>
                  {t("fullName")}
                  <input
                    name="fullName"
                    autoComplete="name"
                    required
                    pattern=".*\S.*"
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  {t("email")}
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <p className="booking-privacy">{t("bookingPrivacy")}</p>
              </div>
            )}
            {step === 1 && (
              <fieldset className="booking-programs">
                <legend className="sr-only">{t("selectProgram")}</legend>
                {programs.map((item) => (
                  <label key={item}>
                    <input
                      type="radio"
                      name="program"
                      required
                      value={item}
                      checked={program === item}
                      onChange={() => {
                        setProgram(item);
                        setTopic("");
                      }}
                    />
                    <span>{item}</span>
                    <small>
                      {t(
                        item === "FRC"
                          ? "frcShort"
                          : item === "FTC"
                            ? "ftcShort"
                            : "fllShort",
                      )}
                    </small>
                  </label>
                ))}
              </fieldset>
            )}
            {step === 2 && (
              <label className="booking-topic">
                {t("field")}
                <select
                  name="topic"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="">{t("selectOne")}</option>
                  {categories
                    .filter((c) => c.program === program)
                    .map((c) => localizeCategory(c, locale))
                    .map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.title}
                      </option>
                    ))}
                </select>
                {category && <p>{category.description}</p>}
              </label>
            )}
            {step === 3 && (
              <div className="booking-calendar">
                {calendar ? (
                  <>
                    {instructor && <p>{instructor.name}</p>}
                    {calendar.canEmbed && (
                      <iframe
                        src={calendar.url}
                        title={t("calendarTitle")}
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    )}
                    <a
                      className="primary-button"
                      href={calendar.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("openCalendar")}
                      <Arrow diagonal />
                    </a>
                  </>
                ) : (
                  <div className="calendar-empty">
                    <svg
                      viewBox="0 0 48 48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <rect x="8" y="11" width="32" height="30" rx="3" />
                      <path d="M8 20h32M16 6v10M32 6v10M17 27h5m5 0h5m-15 7h5" />
                    </svg>
                    <h3>{t("calendarPending")}</h3>
                    <p>{t("calendarPendingDescription")}</p>
                  </div>
                )}
              </div>
            )}
            <div className="booking-actions">
              {step > 0 && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setStep((value) => value - 1)}
                >
                  {step === 3 ? t("chooseAnotherTopic") : t("back")}
                </button>
              )}
              {step < 3 && (
                <button className="primary-button" type="submit">
                  {t("continue")}
                  <Arrow />
                </button>
              )}
            </div>
          </form>
        </div>
        <aside className="booking-summary" aria-label={t("bookingSummary")}>
          <h2>{t("bookingSummary")}</h2>
          <dl>
            <div>
              <dt>{t("bookingProgram")}</dt>
              <dd>{program || "—"}</dd>
            </div>
            <div>
              <dt>{t("bookingTopic")}</dt>
              <dd>{category?.title || "—"}</dd>
            </div>
          </dl>
          <p>
            {t("heroStart")} {t("heroAccent")} {t("heroEnd")}
          </p>
        </aside>
      </div>
    </section>
  );
}
