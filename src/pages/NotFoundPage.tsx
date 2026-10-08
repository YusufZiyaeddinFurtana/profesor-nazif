import { useEffect } from "react";

export function NotFoundPage() {
  useEffect(() => {
    document.title = "Sayfa bulunamadı — Profesör Nazif";
  }, []);
  return (
    <section className="section-wrap route-status">
      <h1>Bu sayfa ders defterinde yok.</h1>
      <p>Adres değişmiş olabilir. Eğitimleri ana sayfadan bulabilirsin.</p>
      <a className="primary-button" href="/#kategoriler">
        Eğitimlere dön
      </a>
    </section>
  );
}
