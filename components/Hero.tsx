"use client";

export default function Hero({ onShareClick }: { onShareClick: () => void }) {
  return (
    <section className="pt-32 md:pt-36 lg:pt-40 pb-6 sm:pb-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center">
        <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-secondary text-[10px] min-[400px]:text-xs sm:text-sm uppercase tracking-[0.18em] sm:tracking-[0.28em] mb-3 sm:mb-4 max-w-md mx-auto">
          <span className="text-base leading-none" aria-hidden="true">
            ✝️
          </span>
          Fortalecimento de fé • WhatsApp
        </p>
        <h1 className="text-[1.65rem] min-[400px]:text-[2rem] sm:text-4xl lg:text-[2.75rem] font-serif font-bold text-foreground mb-4 sm:mb-6 leading-[1.2] sm:leading-tight text-balance">
          Status de fé para o{" "}
          <span className="italic text-primary">WhatsApp</span>
        </h1>
        <p className="text-gray-600 text-[0.9375rem] sm:text-lg leading-7 sm:leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto text-pretty px-1">
          Escolhe versículos e reflexões que fortalecem, gera um cartão simples
          e partilha no WhatsApp — como um post limpo, só texto e autor.
        </p>
        <button
          onClick={onShareClick}
          className="inline-flex w-full min-[400px]:w-auto min-h-[3rem] justify-center items-center gap-2 px-5 sm:px-7 py-3.5 bg-primary text-white rounded-full text-sm sm:text-base font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl max-w-sm min-[400px]:max-w-none mx-auto"
        >
          <span aria-hidden="true">✍️</span>
          Criar e publicar status
        </button>
      </div>

      <ol className="mt-8 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 text-left">
        {[
          {
            step: "1",
            title: "Explora ou publica",
            body: "Navega pelos status da comunidade ou escreve a tua reflexão de fé.",
          },
          {
            step: "2",
            title: "Gera o cartão",
            body: "Cada reflexão vira uma imagem igual ao cartão da galeria — pronta para o WhatsApp.",
          },
          {
            step: "3",
            title: "Partilha no WhatsApp",
            body: "Um toque: descarrega ou abre o WhatsApp para colocar no teu estado.",
          },
        ].map((item) => (
          <li
            key={item.step}
            className="rounded-2xl border border-stone-100 bg-white/80 px-4 py-4 sm:px-5 sm:py-5 shadow-sm"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-semibold mb-3">
              {item.step}
            </span>
            <h2 className="font-serif font-semibold text-foreground text-lg mb-1.5">{item.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
