"use client";

export default function Hero({ onShareClick }: { onShareClick: () => void }) {
  return (
    <section className="pt-20 sm:pt-32 pb-6 sm:pb-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center">
        <p className="inline-flex items-center gap-2 text-secondary text-[11px] sm:text-sm uppercase tracking-[0.28em] mb-3 sm:mb-4">
          <span className="text-base leading-none" aria-hidden="true">
            ✝️
          </span>
          Fortalecimento de fé • WhatsApp
        </p>
        <h1 className="text-[2rem] sm:text-4xl lg:text-[2.75rem] font-serif font-bold text-foreground mb-4 sm:mb-6 leading-[1.15] sm:leading-tight">
          Status de fé para o{" "}
          <span className="italic text-primary">WhatsApp</span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg leading-8 sm:leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto">
          Escolhe versículos e reflexões que fortalecem, gera um cartão simples
          e partilha no WhatsApp — como um post limpo, só texto e autor.
        </p>
        <button
          onClick={onShareClick}
          className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-5 sm:px-7 py-3.5 sm:py-3.5 bg-primary text-white rounded-full text-base font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl max-w-[20rem] sm:max-w-none"
        >
          <span aria-hidden="true">✍️</span>
          Criar e publicar status
        </button>
      </div>

      <ol className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 text-left">
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
