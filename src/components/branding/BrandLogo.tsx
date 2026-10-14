import { brandAssets } from "../../config/site";
/** The visual brand remains the same in every language. */
export function BrandLogo() {
  return brandAssets.wordmark ? (
    <img
      className="brand-lockup"
      src={brandAssets.wordmark}
      alt="Profesör Nazif"
    />
  ) : (
    <span className="brand-mark">
      <img src={brandAssets.portrait} alt="Profesör Nazif" />
    </span>
  );
}
