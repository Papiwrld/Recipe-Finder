import Image from 'next/image';
import SearchBar from './SearchBar';

// Heights rise toward the middle so the row of photos stays centered on the page
const stripHeights = ['h-32', 'h-44', 'h-56', 'h-44', 'h-32'];

interface HeroProps {
  title: string;
  subtitle: string;
  placeholder?: string;
  quickPicks?: string[];
  images: string[];
  onSearch: (query: string, ingredients: string[]) => void;
}

export default function Hero({ title, subtitle, placeholder, quickPicks, images, onSearch }: HeroProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 text-center sm:px-6 sm:pt-10 lg:px-8 lg:pb-14">
      <h1 className="animate-rise font-display text-5xl font-semibold leading-[1.02] tracking-tighter text-text sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-text-secondary sm:text-xl">{subtitle}</p>

      <div className="relative z-20 mx-auto mt-7 max-w-2xl sm:mt-8">
        <SearchBar onSearch={onSearch} placeholder={placeholder} quickPicks={quickPicks} />
      </div>

      <div className="mt-12 hidden grid-cols-5 items-end gap-4 md:grid" aria-hidden="true">
        {images.slice(0, 5).map((src, index) => (
          <div
            key={src}
            className={`relative animate-rise overflow-hidden rounded-2xl bg-muted shadow-soft ${stripHeights[index]}`}
            style={{ animationDelay: `${Math.abs(index - 2) * 70}ms` }}
          >
            <Image src={src} alt="" fill priority={index === 2} sizes="(max-width: 1024px) 20vw, 220px" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
