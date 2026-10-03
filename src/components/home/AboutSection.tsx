import { Arrow } from "../ui/Arrow";

export function AboutSection() {
  return (
    <section id="hakkimizda" className="about-section">
      <div className="section-wrap about-layout">
        <div className="about-logo">
          <img src="/cymurghs-logo.png" alt="Cymurghs #7466 takım logosu" />
          <span>Cymurghs #7466</span>
        </div>
        <div>
          <span className="eyebrow">HAKKIMIZDA</span>
          <h2>
            Merakın yanına
            <br />
            <em>bir tahta koyduk.</em>
          </h2>
          <p>
            Profesör Nazif, Cymurghs #7466 takımının ayı maskotundan doğan bir
            eğitim fikri. FRC ve FLL yolculuğunda karşımıza çıkan kavramları,
            bir öğretmenin tahtada anlattığı gibi açık ve izlenebilir kılmak
            istiyoruz.
          </p>
          <p>
            Bu sayfa, derslerin ve videoların toplanacağı yerin ilk tasarımıdır.
            Mekanikten yazılıma, proje üretiminden takım kültürüne uzanan
            başlıklar zamanla gerçek içeriklerle dolacak. Nazif de her videonun
            başında tebeşir çizgileriyle sizi karşılayacak.
          </p>
          <a
            href="https://www.cymurghs7466.com/"
            target="_blank"
            rel="noreferrer"
          >
            Cymurghs takımını tanı <Arrow diagonal />
          </a>
        </div>
      </div>
    </section>
  );
}
