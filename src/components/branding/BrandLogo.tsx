import { brandAssets } from "../../config/site";
/** The visual brand remains the same in every language. */
export function BrandLogo() {
  return (
    <span className="brand-lockup">
      <img
        src={brandAssets.wordmark}
        alt="Profesör Nazif"
        width="722"
        height="133"
      />
      {/* Recolor only the supplied lettering; keep Nazif's original colors. */}
      <span
        className="brand-lockup-lettering"
        aria-hidden="true"
        style={{ maskImage: `url("${brandAssets.wordmark}")` }}
      />
    </span>
  );
}
