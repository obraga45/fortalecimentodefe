"use client";

export default function Navbar({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-primary text-xl sm:text-2xl">✝️</span>
            <span className="font-serif text-sm sm:text-xl font-semibold text-foreground hidden sm:inline">
              Fortalecimento de Fé
            </span>
            <span className="font-serif text-base font-semibold text-foreground sm:hidden">
              Fé
            </span>
          </div>
          
          <div className="flex-1 max-w-md mx-2 sm:mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar versículos, reflexões..."
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 pl-8 sm:pl-10 bg-gray-100 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            </div>
          </div>
          
          <button
            onClick={onLoginClick}
            className="px-3 sm:px-5 py-1.5 sm:py-2 bg-primary text-white rounded-full text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">Iniciar Sessão / Publicar</span>
            <span className="sm:hidden">Entrar</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
