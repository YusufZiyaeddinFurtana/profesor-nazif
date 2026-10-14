import { useLocale } from "../../i18n/LocaleProvider";
import { instagramUrl } from "../../config/site";
import { BrandLogo } from "../branding/BrandLogo";
import { Arrow } from "../ui/Arrow";
export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-layout">
        <a
          className="brand footer-identity"
          href="/"
          aria-label={t("homeLabel")}
        >
          <BrandLogo />
        </a>
        <p className="footer-motto">
          {t("heroStart")} {t("heroAccent")} {t("heroEnd")}
        </p>
        {instagramUrl && (
          <div className="footer-social">
            <span>{t("follow")}</span>
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              Instagram <Arrow diagonal />
            </a>
          </div>
        )}
        <a className="back-to-top" href="#top">
          {t("top")}
        </a>
      </div>
    </footer>
  );
}
