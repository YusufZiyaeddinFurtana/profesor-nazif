import { useLocale } from "../../i18n/LocaleProvider";
import { socialLinks } from "../../config/site";

export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-layout">
        <a
          className="footer-identity"
          href="https://www.cymurghs7466.com/"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/cymurghs-logo.png" alt="" />
          <span>
            <strong>{t("brand")}</strong>
            <small>{t("footerCredit")}</small>
          </span>
        </a>
        <div className="footer-social">
          <span>{t("follow")}</span>
          <div>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
        <a className="back-to-top" href="#top">
          {t("top")}
        </a>
      </div>
    </footer>
  );
}
