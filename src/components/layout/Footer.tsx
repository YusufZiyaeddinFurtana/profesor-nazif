import { socialLinks } from "../../data/siteContent";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-layout">
        <div className="footer-identity">
          <img src="/cymurghs-logo.png" alt="" />
          <span>
            <strong>Profesör Nazif</strong>
            <small>Cymurghs #7466’nın eğitim köşesi</small>
          </span>
        </div>
        <div className="footer-social">
          <span>Bizi takip et</span>
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
          Başa dön ↑
        </a>
      </div>
    </footer>
  );
}
