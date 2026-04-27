type PageIntroProps = {
  eyebrow: string;
  title: string;
  body: string;
  aside?: string;
};

export function PageIntro({ eyebrow, title, body, aside }: PageIntroProps) {
  return (
    <section className="page-band">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-12 md:px-8 md:pb-12 md:pt-20">
        <div className="grid gap-6 border-b border-line pb-8 md:grid-cols-[1.35fr_0.65fr] md:pb-12">
          <div className="max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="display-title mt-4 max-w-2xl text-[2.35rem] leading-[0.94] sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="shell-copy mt-4 max-w-xl">{body}</p>
          </div>
          {aside ? (
            <div className="flex items-start md:justify-end md:pt-2">
              <p className="max-w-sm border-l border-accent/40 pl-4 text-[0.82rem] leading-6 text-text/88">
                {aside}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
