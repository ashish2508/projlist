const sizes = "(max-width: 899px) 100vw, min(68.64svh, 53vw)";
const sources = [
  "/hero/bonsai-400.cffe976c19fa.avif 400w",
  "/hero/bonsai-560.3886f4fa4585.avif 560w",
  "/hero/bonsai-735.615d6e1df377.avif 735w",
].join(", ");

export function HeroIllustration({ className }: { className: string }) {
  return (
    <>
      <link rel="preload" as="image" type="image/avif" imageSrcSet={sources} imageSizes={sizes} fetchPriority="high" />
      <picture>
        <source type="image/avif" srcSet={sources} sizes={sizes} />
        {/* The responsive sources are encoded ahead of deployment and served as static assets. */}
        <img src="/tree.webp" alt="" aria-hidden="true" width={735} height={1103}
          fetchPriority="high" data-critical-image className={className} />
      </picture>
    </>
  );
}
