import { Arrow } from "../ui/Arrow";

export function IntroSection() {
  return (
    <section className="intro-band" aria-label="Kısa tanıtım">
      <span className="eyebrow">KÜÇÜK BİR TAHTA, BÜYÜK FİKİRLER</span>
      <p>
        Profesör Nazif, Cymurghs #7466’nın ayı maskotu. Bu eğitim köşesinde
        robotik, kodlama ve takım çalışmasını merak edenler için konuları
        çizerek, anlatarak ve deneyerek açıyoruz.
      </p>
      <a href="#hakkimizda">
        Hikâyemiz <Arrow diagonal />
      </a>
    </section>
  );
}
