import type { ReactNode } from "react";
import { ChalkNazifArtwork } from "../../../components/branding/ChalkNazifArtwork";
import { useLocale } from "../../../i18n/LocaleProvider";
export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { t } = useLocale();
  return (
    <section className="section-wrap auth-page">
      <div className="auth-introduction">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        <div className="auth-artwork">
          <ChalkNazifArtwork />
          <span>
            {t("heroStart")} {t("heroAccent")} {t("heroEnd")}
          </span>
        </div>
      </div>
      <div className="auth-workspace">{children}</div>
    </section>
  );
}
