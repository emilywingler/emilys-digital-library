import { OrnateArrow } from "@/components/decor/OrnateArrow";
import { Divider, Flourish } from "@/components/decor/Ornaments";
import { useLocale } from "@/i18n/locale";
import type { Profile } from "@/types/content";
import { NewspaperMasthead } from "./NewspaperMasthead";
import { NewspaperPortrait } from "./NewspaperPortrait";

interface Props {
  profile: Profile;
}

/**
 * Home section: a parchment newspaper front page laid on the dark library desk.
 * Data comes in as props (from `src/content`), so this component never knows
 * whether content is static or fetched.
 */
export function HomeFrontPage({ profile }: Props) {
  const { locale, t } = useLocale();
  return (
    <section data-section="home" id="home" aria-labelledby="home-title" className="px-3 pb-12 pt-6 sm:px-6 sm:pt-10">
      <article className="paper relative mx-auto max-w-5xl home-reveal px-5 py-6 sm:px-10 sm:py-10">
        <Flourish className="pointer-events-none absolute left-2 top-2 h-8 w-8 text-paper-muted/60" />
        <Flourish className="pointer-events-none absolute right-2 top-2 h-8 w-8 rotate-90 text-paper-muted/60" />
        <Flourish className="pointer-events-none absolute bottom-2 left-2 h-8 w-8 -rotate-90 text-paper-muted/60" />
        <Flourish className="pointer-events-none absolute bottom-2 right-2 h-8 w-8 rotate-180 text-paper-muted/60" />

        <NewspaperMasthead />

        <header className="headline-hover mt-8 border-b border-rule pb-6 text-center">
          <h1 id="home-title" className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
            {profile.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm uppercase tracking-[0.18em] text-paper-muted sm:text-base">
            {profile.headline[locale]}
          </p>
        </header>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_17rem] lg:grid-cols-[1fr_19rem] md:gap-10">
          <NewspaperPortrait portrait={profile.portrait} />
          <div className="md:order-first md:border-r md:border-rule md:pr-10">
            <h2 className="font-masthead text-sm uppercase tracking-[0.25em] text-paper-muted">
              {t.home.profileHeading} · {profile.location[locale]}
            </h2>
            <p className="drop-cap mt-3 text-lg leading-relaxed sm:columns-2 sm:gap-8 [hyphens:auto]" lang={locale === "pt" ? "pt-BR" : "en"}>
              {profile.intro[locale]}
            </p>
          </div>
        </div>

        <Divider className="mt-8 h-4 w-full text-paper-muted" />
        <div className="mt-4 text-center">
          <a href="#experience" className="link-draw inline-flex items-center gap-2 font-display text-lg italic hover:text-olive">
            {t.home.explore} <OrnateArrow direction="down" length="1.6rem" />
          </a>
        </div>
      </article>
    </section>
  );
}
