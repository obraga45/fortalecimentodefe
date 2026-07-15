"use client";

export default function Hero({ onShareClick }: { onShareClick: () => void }) {
  return (
    <section className="pt-20 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      <p className="text-secondary text-[11px] sm:text-sm uppercase tracking-[0.28em] mb-3 sm:mb-4">
        Comunidade de Fé
      </p>
      <h1 className="text-[2rem] sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 sm:mb-6 leading-[1.15] sm:leading-tight">
        Palavras que Fortalecem,{" "}
        <span className="italic text-primary">Reflexões que Inspiram</span>
      </h1>
      <p className="text-gray-600 text-base sm:text-lg leading-8 sm:leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto">
        Um espaço sereno para partilhar versículos bíblicos, exortações e reflexões que tocam o seu coração.
      </p>
      <button
        onClick={onShareClick}
        className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-5 sm:px-6 py-3 sm:py-3 bg-primary text-white rounded-full text-base sm:text-base font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl max-w-[18rem] sm:max-w-none"
      >
        <span>🔥</span>
        Partilhar uma Reflexão
      </button>
    </section>
  );
}
