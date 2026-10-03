/** Decorative boot sequence: the page stays readable and interactive throughout. */
export function BootIntro({
  cycle,
  onReplay,
}: {
  cycle: number;
  onReplay: () => void;
}) {
  return (
    <div className="boot-intro">
      <div className="boot-emblem" key={cycle} aria-hidden="true">
        <img src="/cymurghs-chalk-logo.png" alt="" />
        <span className="boot-scan" />
      </div>
      <div className="boot-terminal" aria-hidden="true">
        <span>
          nazif@cymurghs:~$ <b>tahtayı aç</b>
        </span>
        <span className="boot-line" key={`line-${cycle}`}>
          Sınıf hazır. Merakını getir.
          <i className="boot-cursor" />
        </span>
      </div>
      <button
        className="boot-replay"
        type="button"
        onClick={onReplay}
        aria-label="Takım logosunun giriş animasyonunu yeniden oynat"
        title="Girişi yeniden oynat"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" />
        </svg>
      </button>
    </div>
  );
}
