import { useLocale } from "../i18n/LocaleProvider";
import { useEffect } from "react";

export function NotFoundPage() {
  const { t } = useLocale();
  useEffect(() => {
    document.title = `${t("notFoundTitle")} — ${t("brand")}`;
  }, [t]);
  return (
    <section className="section-wrap route-status">
      <h1>{t("notFoundHeading")}</h1>
      <p>{t("notFoundDescription")}</p>
      <a className="primary-button" href="/#kategoriler">
        {t("backCourses")}
      </a>
    </section>
  );
}
