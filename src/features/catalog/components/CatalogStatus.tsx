import type { CatalogState } from "../CatalogProvider";

export function CatalogStatus({
  status,
  retry,
}: {
  status: CatalogState;
  retry: () => void;
}) {
  if (status === "ready") return null;
  if (status === "loading")
    return (
      <p className="catalog-status" role="status">
        Ders defteri açılıyor…
      </p>
    );
  return (
    <div className="empty-state" role="alert">
      <strong>Dersler yüklenemedi.</strong>
      <p>Bağlantını kontrol edip yeniden deneyebilirsin.</p>
      <button type="button" onClick={retry}>
        Yeniden dene
      </button>
    </div>
  );
}
