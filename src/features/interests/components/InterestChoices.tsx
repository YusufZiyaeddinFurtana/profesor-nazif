import { useLocale } from "../../../i18n/LocaleProvider";
import { programs } from "../../catalog/types";
import { focusAreas, toggleChoice, type LearningPreferences } from "../types";

export function InterestChoices({
  stage,
  value,
  onChange,
  disabled = false,
}: {
  stage: "programs" | "focus";
  value: LearningPreferences;
  onChange: (value: LearningPreferences) => void;
  disabled?: boolean;
}) {
  const { t } = useLocale();
  return (
    <fieldset className="interest-choices" disabled={disabled}>
      <legend>
        {t(
          stage === "programs"
            ? "interestsProgramsQuestion"
            : "interestsFocusQuestion",
        )}
      </legend>
      <p className="interest-help">{t("interestsMultiple")}</p>
      <div className="interest-options">
        {stage === "programs"
          ? programs.map((program) => (
              <label key={program} className="interest-option">
                <input
                  type="checkbox"
                  name="interestPrograms"
                  value={program}
                  checked={value.programs.includes(program)}
                  onChange={() =>
                    onChange({
                      ...value,
                      programs: toggleChoice(value.programs, program),
                    })
                  }
                />
                <span>
                  <strong>{program}</strong>
                  <span>
                    {t(
                      program === "FRC"
                        ? "frcShort"
                        : program === "FTC"
                          ? "ftcShort"
                          : "fllShort",
                    )}
                  </span>
                </span>
              </label>
            ))
          : focusAreas.map((area) => (
              <label key={area} className="interest-option">
                <input
                  type="checkbox"
                  name="focusAreas"
                  value={area}
                  checked={value.focusAreas.includes(area)}
                  onChange={() =>
                    onChange({
                      ...value,
                      focusAreas: toggleChoice(value.focusAreas, area),
                    })
                  }
                />
                <span>
                  <strong>
                    {t(
                      area === "engineering"
                        ? "interestsEngineering"
                        : "interestsBusiness",
                    )}
                  </strong>
                  <span>
                    {t(
                      area === "engineering"
                        ? "interestsEngineeringDescription"
                        : "interestsBusinessDescription",
                    )}
                  </span>
                </span>
              </label>
            ))}
      </div>
    </fieldset>
  );
}

export function PreferenceSummary({ value }: { value: LearningPreferences }) {
  const { t } = useLocale();
  const labels = [
    ...value.programs,
    ...value.focusAreas.map((area) =>
      t(area === "engineering" ? "interestsEngineering" : "interestsBusiness"),
    ),
  ];
  return (
    <p className="interest-summary">
      {labels.length ? labels.join(" · ") : t("interestsExploreAll")}
    </p>
  );
}
