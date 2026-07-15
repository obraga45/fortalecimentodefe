"use client";

import { useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";

function GoogleLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.8-5.5 3.8-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 2.8 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7H12Z"
      />
      <path
        fill="#34A853"
        d="M2 12c0 1.6.4 3.1 1.2 4.5l3.2-2.5C5.9 13.4 5.7 12.7 5.7 12s.2-1.4.6-2L3.1 7.5A10 10 0 0 0 2 12Z"
      />
      <path
        fill="#FBBC05"
        d="M12 22c2.7 0 4.9-.9 6.5-2.4l-3.2-2.6c-.9.6-2 .9-3.3.9-2.5 0-4.7-1.7-5.5-4l-3.3 2.5C4.8 19.8 8.1 22 12 22Z"
      />
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.2-.2-1.8H12v3.9h5.5c-.3 1.4-1.1 2.5-2.3 3.3l3.2 2.6c1.9-1.8 3.2-4.5 3.2-8Z"
      />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#1877F2"
        d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.4-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12H17l-.6 3.5h-2.8V24A12 12 0 0 0 24 12Z"
      />
      <path
        fill="#FFF"
        d="M16.4 15.5 17 12h-3.4V9.8c0-1 .5-1.9 2-1.9h1.5V5c0 0-1.3-.2-2.6-.2-2.7 0-4.4 1.6-4.4 4.6V12h-3v3.5h3V24c.6.1 1.2.1 1.9.1s1.1 0 1.6-.1v-8.5h2.8Z"
      />
    </svg>
  );
}

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { signInWithGoogle, signInWithFacebook } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    onClose();
  };

  const handleFacebookSignIn = async () => {
    await signInWithFacebook();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-5 sm:p-8 transform transition-all border border-stone-100">
        <div className="text-center mb-5 sm:mb-7">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-2">
            Acesse para Partilhar
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            Para manter a nossa comunidade segura e livre de spam, pedimos que se autentique antes de publicar.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-stone-200 rounded-2xl hover:bg-stone-50 transition-colors text-sm shadow-sm"
          >
            <GoogleLogo />
            <span className="font-medium text-slate-700">Entrar com o Google</span>
          </button>
          
          <button
            onClick={handleFacebookSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#1668d8] transition-colors text-sm shadow-sm"
          >
            <FacebookLogo />
            <span className="font-medium text-white">Entrar com o Facebook</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 sm:mt-6 w-full text-center text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
