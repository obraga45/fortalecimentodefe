"use client";

import { useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";

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
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-8 transform transition-all">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-2">
            Acesse para Partilhar
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            Para manter a nossa comunidade segura e livre de spam, pedimos que se autentique antes de publicar.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            <span className="text-lg sm:text-xl">🔵</span>
            <span className="font-medium text-gray-700">Entrar com o Google</span>
          </button>
          
          <button
            onClick={handleFacebookSignIn}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            <span className="text-lg sm:text-xl">🔷</span>
            <span className="font-medium text-blue-800">Entrar com o Facebook</span>
          </button>
          
          <button className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            <span className="text-lg sm:text-xl">📧</span>
            <span className="font-medium text-gray-700">Entrar com Email</span>
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
