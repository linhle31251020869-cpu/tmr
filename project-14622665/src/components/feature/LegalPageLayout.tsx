import PageHero from '@/components/feature/PageHero';
import type { LegalDoc } from '@/lib/legalContent';

interface LegalPageLayoutProps {
  doc: LegalDoc;
  image: string;
  imageAlt: string;
  icons?: string[];
}

export default function LegalPageLayout({ doc, image, imageAlt, icons }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-mystic-gradient pt-20">
      <PageHero image={image} imageAlt={imageAlt} icons={icons}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mystic-purple-900/40 border border-mystic-purple-700/40 text-[10px] uppercase tracking-[0.25em] text-mystic-purple-200 mb-5">
            <i className="ri-file-shield-2-line text-mystic-gold-400 text-xs" /> Văn Bản Pháp Lý
          </span>
          <h1 className="mystic-heading text-3xl md:text-5xl font-bold text-glow-gold mb-4">
            {doc.title}
          </h1>
          <div className="mystic-divider max-w-xs mx-auto mb-4" />
          <p className="mystic-text text-sm opacity-80">{doc.subtitle}</p>
          <p className="mystic-text text-xs mt-3 opacity-60">
            Cập nhật gần nhất: {doc.updated}
          </p>
        </div>
      </PageHero>

      <section className="relative py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Mục lục */}
          <nav className="mystic-card rounded-2xl p-5 md:p-6 mb-8">
            <p className="mystic-heading text-xs font-semibold tracking-[0.2em] uppercase text-mystic-gold-500 mb-4 flex items-center gap-2">
              <i className="ri-list-check-2 text-base" /> Nội Dung
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {doc.sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    href={`#muc-${index + 1}`}
                    className="text-sm text-mystic-purple-200 hover:text-mystic-gold-300 transition-colors duration-300"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Nội dung */}
          <article className="mystic-card rounded-2xl p-6 md:p-10 space-y-8">
            {/* Lời mở đầu */}
            <div className="space-y-4">
              {doc.intro.map((paragraph) => (
                <p key={paragraph} className="mystic-text text-sm leading-relaxed opacity-85">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Các mục */}
            {doc.sections.map((section, index) => (
              <section
                key={section.heading}
                id={`muc-${index + 1}`}
                className="scroll-mt-28 pt-6 border-t border-mystic-purple-800/20"
              >
                <h2 className="mystic-heading text-xl md:text-2xl font-bold text-[#f3e7cf] mb-4 leading-snug">
                  {section.heading}
                </h2>

                <div className="space-y-3">
                  {section.blocks.map((block, blockIndex) => {
                    const key = `${section.heading}-${blockIndex}`;
                    if (block.type === 'subheading') {
                      return (
                        <h3 key={key} className="mystic-heading text-base md:text-lg font-semibold text-mystic-gold-400 pt-2">
                          {block.text}
                        </h3>
                      );
                    }
                    if (block.type === 'list') {
                      return (
                        <ul key={key} className="space-y-2 pl-1">
                          {block.items.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-mystic-purple-100/90 leading-relaxed">
                              <i className="ri-checkbox-blank-circle-fill text-[6px] text-mystic-gold-400 mt-2 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={key} className="mystic-text text-sm leading-relaxed opacity-85">
                        {block.text}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>
    </div>
  );
}