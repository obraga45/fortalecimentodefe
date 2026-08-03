"use client";

interface NavbarProps {
  onLoginClick: () => void;
  isAuthenticated?: boolean;
  userLabel?: string;
}

function SearchField({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="search"
        placeholder="Buscar status, versículos..."
        className="w-full min-h-[2.75rem] md:min-h-0 px-4 py-2 md:py-1.5 pl-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
        aria-hidden="true"
      >
        🔍
      </span>
    </div>
  );
}

export default function Navbar({
  onLoginClick,
  isAuthenticated = false,
  userLabel = "Iniciar Sessão",
}: NavbarProps) {
  const compactUserLabel = userLabel.split(" ")[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-gray-100 shadow-sm pt-[env(safe-area-inset-top)]">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-3 min-h-14 md:min-h-16">
          <div className="flex items-center gap-2 min-w-0 shrink sm:max-w-[14rem] lg:max-w-xs">
            <span className="text-primary text-xl sm:text-2xl shrink-0" aria-hidden="true">
              ✝️
            </span>
            <div className="hidden min-[480px]:flex flex-col min-w-0">
              <span className="font-serif text-base sm:text-xl font-semibold text-foreground truncate leading-tight">
                Fortalecimento de Fé
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-gray-500 truncate">
                Status WhatsApp
              </span>
            </div>
            <span className="font-serif text-base font-semibold text-foreground min-[480px]:hidden truncate">
              Status Fé
            </span>
          </div>

          <SearchField className="hidden md:block flex-1 max-w-md mx-4 lg:mx-8" />

          <button
            type="button"
            onClick={onLoginClick}
            className="px-3 sm:px-5 py-2 min-h-[2.5rem] bg-primary text-white rounded-full text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors shrink-0 max-w-[40vw] md:max-w-none"
          >
            {isAuthenticated ? (
              <>
                <span className="hidden lg:inline truncate">{userLabel} / Mudar</span>
                <span className="hidden sm:inline lg:hidden truncate">{compactUserLabel}</span>
                <span className="sm:hidden truncate">{compactUserLabel}</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Iniciar Sessão / Publicar</span>
                <span className="sm:hidden">Entrar</span>
              </>
            )}
          </button>
        </div>

        <div className="pb-3 md:hidden">
          <SearchField />
        </div>
      </nav>
    </header>
  );
}
