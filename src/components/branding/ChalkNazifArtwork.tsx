import { useLocale } from "../../i18n/LocaleProvider";
import { useId } from "react";

const chalkRevealPaths = [
  {
    d: "M410 220C330 130 390 85 440 105C520 35 685 40 760 120C815 150 820 250 770 320C730 435 655 485 540 470C405 465 340 360 410 220",
    width: 105,
    delay: 0,
  },
  {
    d: "M495 290C540 255 635 255 685 315C720 390 660 465 545 450C455 435 445 345 495 290",
    width: 125,
    delay: 0.5,
  },
  {
    d: "M480 325C540 270 610 285 670 325M470 365C530 410 620 410 695 360",
    width: 115,
    delay: 0.9,
  },
  {
    d: "M445 450C390 535 335 615 365 705M460 500C425 635 420 810 540 850C690 870 725 760 670 490",
    width: 150,
    delay: 1.2,
  },
  { d: "M485 485C535 460 585 525 645 475", width: 105, delay: 1.65 },
  { d: "M690 475C795 420 825 330 815 235", width: 155, delay: 1.85 },
];

export function ChalkNazifArtwork({
  animated = false,
}: {
  animated?: boolean;
}) {
  const { t } = useLocale();
  const id = useId().replace(/:/g, "");
  const filterId = `chalk-${id}`;
  const maskId = `draw-${id}`;
  return (
    <svg
      className={`chalk-artwork${animated ? " chalk-artwork--animated" : ""}`}
      viewBox="0 0 1140 932"
      role="img"
      aria-label={t(animated ? "chalkAnimated" : "chalkStatic")}
    >
      <defs>
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feColorMatrix
            in="SourceGraphic"
            type="luminanceToAlpha"
            result="luminance"
          />
          <feComponentTransfer in="luminance" result="mask">
            <feFuncA type="linear" slope="2.8" intercept="-.62" />
          </feComponentTransfer>
          <feFlood floodColor="#f7f3e6" result="chalk" />
          <feComposite in="chalk" in2="mask" operator="in" />
        </filter>
        {animated && (
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect width="1140" height="932" fill="black" />
            {chalkRevealPaths.map((stroke, index) => (
              <path
                key={index}
                className="chalk-mask-path"
                pathLength="1"
                d={stroke.d}
                fill="none"
                stroke="white"
                strokeWidth={stroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animationDelay: `${stroke.delay}s` }}
              />
            ))}
            <rect
              className="chalk-mask-complete"
              width="1140"
              height="932"
              fill="white"
            />
          </mask>
        )}
      </defs>
      <image
        href="/nazif-chalk.png"
        width="1140"
        height="932"
        filter={`url(#${filterId})`}
        mask={animated ? `url(#${maskId})` : undefined}
      />
    </svg>
  );
}
