import { useLocale } from "../../../i18n/LocaleProvider";
import type { CatalogState } from "../CatalogProvider";

export function CatalogStatus({
  status,
  retry,
}: {
  status: CatalogState;
  retry: () => void;
}) {
  const { t } = useLocale();
  if (status === "ready") return null;
  if (status === "loading")
    return (
      <p className="catalog-status" role="status">
        {t("catalogLoading")}
      </p>
    );
  return (
    <div className="empty-state" role="alert">
      <strong>{t("catalogError")}</strong>
      <p>{t("catalogRecovery")}</p>
      <button type="button" onClick={retry}>
        {t("retry")}
      </button>
    </div>
  );
}
