"use client";

interface NavbarProps {
  onLoginClick: () => void;
  isAuthenticated?: boolean;
  userLabel?: string;
}

export default function Navbar({
  onLoginClick,
  isAuthenticated = false,
  userLabel = "Iniciar Sessão",
}: NavbarProps) {
  const compactUserLabel = userLabel.split(" ")[0];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-16 gap-3">
          <div className="flex items-center gap-2 sm:gap-2 min-w-0">
            <span className="text-primary text-xl sm:text-2xl shrink-0">✝️</span>
            <span className="font-serif text-sm sm:text-xl font-semibold text-foreground hidden sm:inline truncate">
              Fortalecimento de Fé
            </span>
            <span className="font-serif text-[1.15rem] font-semibold text-foreground sm:hidden truncate">
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
            className="px-4 sm:px-5 py-2 sm:py-2 bg-primary text-white rounded-full text-sm sm:text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0 max-w-[9.5rem] sm:max-w-none"
          >
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline truncate">{userLabel} / Mudar</span>
                <span className="sm:hidden truncate">{compactUserLabel} / Mudar</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Iniciar Sessão / Publicar</span>
                <span className="sm:hidden">Entrar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
