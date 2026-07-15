"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Post, PostWithTimeAgo } from "@/src/types";

type ShareDebugHypothesisId = "A" | "B" | "C" | "D" | "E";

const reportShareDebug = (
  hypothesisId: ShareDebugHypothesisId,
  msg: string,
  data: Record<string, unknown> = {},
  runId = "pre-fix"
) => {
  // #region debug-point share-report
  fetch("http://127.0.0.1:7777/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: "share-image-export",
      runId,
      hypothesisId,
      location: "components/PostCard.tsx",
      msg: `[DEBUG] ${msg}`,
      data,
      ts: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
};

const getTagColor = (tag: string) => {
  switch (tag) {
    case "Força":
      return "bg-green-100 text-green-800";
    case "Gratidão":
      return "bg-yellow-100 text-yellow-800";
    case "Paz":
      return "bg-blue-100 text-blue-800";
    case "Esperança":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AvatarFallback = ({ name, className = "" }: { name: string; className?: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm sm:text-base ${className}`}>
      {initials}
    </div>
  );
};

function ShareAvatar({
  name,
  avatarUrl,
  shouldShowAvatarImage,
  onImageError,
  imageClassName,
  fallbackClassName,
}: {
  name: string;
  avatarUrl: string | null;
  shouldShowAvatarImage: boolean;
  onImageError: () => void;
  imageClassName: string;
  fallbackClassName: string;
}) {
  return shouldShowAvatarImage ? (
    <img
      src={avatarUrl ?? undefined}
      alt={name}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      loading="eager"
      decoding="sync"
      className={imageClassName}
      onError={onImageError}
    />
  ) : (
    <AvatarFallback name={name} className={fallbackClassName} />
  );
}

interface PostCardProps {
  post: PostWithTimeAgo;
  onReactionUpdate?: (postId: string, reactions: Post["reactions"]) => void;
}

export default function PostCard({ post, onReactionUpdate }: PostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const statusShareRef = useRef<HTMLDivElement>(null);
  const squareShareRef = useRef<HTMLDivElement>(null);
  const [reactions, setReactions] = useState(post.reactions);
  const [isSharing, setIsSharing] = useState(false);
  const [avatarUnavailable, setAvatarUnavailable] = useState(false);
  const [shareAvatarDataUrl, setShareAvatarDataUrl] = useState<string | null>(null);
  const shareText = `${post.content}\n\n${post.reference}\n\nlido em fortalecimentodefe.pt`;
  const shouldShowAvatarImage = Boolean(post.avatar_url) && !avatarUnavailable;
  const contentLength = post.content.trim().length;
  const isShortStatusContent = contentLength <= 90;
  const isMediumStatusContent = contentLength > 90 && contentLength <= 180;
  const statusContainerClassName = isShortStatusContent
    ? "py-[56px]"
    : isMediumStatusContent
      ? "py-[68px]"
      : "flex-1 py-[84px]";
  const statusBodyClassName = isShortStatusContent
    ? "pt-2"
    : isMediumStatusContent
      ? "pt-4"
      : "";
  const statusQuoteSpacingClassName = isShortStatusContent ? "mb-4" : "mb-8";
  const statusContentClassName = isShortStatusContent
    ? "text-[84px] leading-[1.18]"
    : isMediumStatusContent
      ? "text-[78px] leading-[1.22]"
      : "text-[76px] leading-[1.28]";
  const statusReferenceClassName = isShortStatusContent
    ? "text-[56px] mb-7"
    : "text-[52px] mb-10";
  const statusFooterSpacingClassName = isShortStatusContent ? "pt-7 mt-7" : "pt-10 mt-12";

  useEffect(() => {
    const avatarUrl = post.avatar_url;

    if (!avatarUrl || avatarUnavailable) {
      setShareAvatarDataUrl(null);
      return;
    }

    let isCancelled = false;

    const loadShareAvatar = async () => {
      try {
        const response = await fetch(avatarUrl, {
          mode: "cors",
          cache: "force-cache",
        });

        if (!response.ok) {
          throw new Error(`Avatar fetch failed with status ${response.status}`);
        }

        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (!isCancelled) {
            setShareAvatarDataUrl(typeof reader.result === "string" ? reader.result : null);
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        if (!isCancelled) {
          setShareAvatarDataUrl(null);
          reportShareDebug("B", "share avatar prefetch failed", {
            avatarUrl,
            errorName: error instanceof Error ? error.name : "unknown",
            errorMessage: error instanceof Error ? error.message : String(error),
          });
        }
      }
    };

    loadShareAvatar();

    return () => {
      isCancelled = true;
    };
  }, [avatarUnavailable, post.avatar_url]);

  const handleReaction = (type: keyof typeof reactions) => {
    const newReactions = {
      ...reactions,
      [type]: reactions[type] + 1,
    };
    setReactions(newReactions);
    onReactionUpdate?.(post.id, newReactions);
  };

  const dataURLToBlob = (dataurl: string): Blob => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const isShareAbortError = (error: unknown): boolean => {
    return error instanceof DOMException && error.name === "AbortError";
  };

  const openWhatsAppFallback = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const downloadImage = (dataUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  };

  const captureShareImage = async (
    node: HTMLDivElement | null,
    fileName: string
  ): Promise<{ dataUrl: string; file: File } | null> => {
    // #region debug-point D:capture-node-check
    reportShareDebug("D", "captureShareImage invoked", {
      fileName,
      hasNode: Boolean(node),
      clientWidth: node?.clientWidth ?? null,
      clientHeight: node?.clientHeight ?? null,
      childElementCount: node?.childElementCount ?? null,
    });
    // #endregion

    if (!node) return null;

    try {
      const dataUrl = await toPng(node, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#FDFBF7",
        skipAutoScale: true,
        cacheBust: true,
        skipFonts: true,
        includeQueryParams: false,
        style: {
          margin: "0",
          fontFamily: "Georgia, serif, system-ui, sans-serif",
        },
      });

      // #region debug-point A:capture-success
      reportShareDebug("A", "toPng completed", {
        fileName,
        dataUrlLength: dataUrl.length,
      });
      // #endregion

      const blob = dataURLToBlob(dataUrl);
      const file = new File([blob], fileName, { type: "image/png" });
      return { dataUrl, file };
    } catch (error) {
      // #region debug-point A:capture-error
      reportShareDebug("A", "toPng failed", {
        fileName,
        errorName: error instanceof Error ? error.name : "unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
        avatarUrl: post.avatar_url,
        shouldShowAvatarImage,
      });
      // #endregion
      throw error;
    }
  };

  const handleShare = async () => {
    if (!cardRef.current || isSharing) return;
    setIsSharing(true);

    try {
      const isMobileViewport =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 768px)").matches;

      // #region debug-point D:share-entry
      reportShareDebug("D", "handleShare started", {
        isMobileViewport,
        hasStatusShareRef: Boolean(statusShareRef.current),
        hasSquareShareRef: Boolean(squareShareRef.current),
        avatarUrl: post.avatar_url,
        shouldShowAvatarImage,
      });
      // #endregion

      const shareAsset = await captureShareImage(
        isMobileViewport ? statusShareRef.current : squareShareRef.current,
        isMobileViewport ? "estado-fortalecimento.png" : "post-fe.png"
      );

      if (!shareAsset) {
        // #region debug-point E:share-asset-null
        reportShareDebug("E", "share asset unavailable", {
          isMobileViewport,
        });
        // #endregion
        throw new Error("Share asset unavailable");
      }

      const canShareFiles =
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [shareAsset.file] });

      // #region debug-point C:share-capability
      reportShareDebug("C", "share capability evaluated", {
        canShareFiles,
        hasNavigatorShare: typeof navigator.share === "function",
        fileName: shareAsset.file.name,
        fileSize: shareAsset.file.size,
      });
      // #endregion

      if (canShareFiles) {
        await navigator.share({
          title: "Fortalecimento de Fé",
          text: shareText,
          files: [shareAsset.file],
        });
        // #region debug-point C:share-files-success
        reportShareDebug("C", "navigator.share completed with file", {
          fileName: shareAsset.file.name,
          fileSize: shareAsset.file.size,
        });
        // #endregion
      } else {
        // #region debug-point C:share-fallback-download
        reportShareDebug("C", "falling back to download and WhatsApp link", {
          fileName: shareAsset.file.name,
          fileSize: shareAsset.file.size,
        });
        // #endregion
        downloadImage(shareAsset.dataUrl, shareAsset.file.name);
        openWhatsAppFallback();
      }
    } catch (error) {
      // #region debug-point E:share-catch
      reportShareDebug("E", "handleShare caught error", {
        errorName: error instanceof Error ? error.name : "unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      // #endregion
      if (isShareAbortError(error)) {
        return;
      }

      try {
        if (navigator.share) {
          // #region debug-point E:text-only-fallback
          reportShareDebug("E", "attempting text-only fallback share", {
            hasNavigatorShare: true,
          });
          // #endregion
          await navigator.share({
            title: "Fortalecimento de Fé",
            text: shareText,
          });
        } else {
          openWhatsAppFallback();
        }
      } catch (fallbackError) {
        // #region debug-point E:text-fallback-error
        reportShareDebug("E", "text-only fallback failed", {
          errorName:
            fallbackError instanceof Error ? fallbackError.name : "unknown",
          errorMessage:
            fallbackError instanceof Error
              ? fallbackError.message
              : String(fallbackError),
        });
        // #endregion
        if (!isShareAbortError(fallbackError)) {
          openWhatsAppFallback();
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div>
      <div
        ref={cardRef}
        className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 sm:p-5 w-full overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          {shouldShowAvatarImage ? (
            <img
              src={post.avatar_url ?? undefined}
              alt={post.author_name}
              crossOrigin="anonymous"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
              referrerPolicy="no-referrer"
              onError={() => {
                setAvatarUnavailable(true);
              }}
            />
          ) : null}
          <AvatarFallback
            name={post.author_name}
            className={shouldShowAvatarImage ? "hidden" : ""}
          />

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1 min-w-0">
              <span className="text-slate-800 font-bold truncate text-base sm:text-base">
                {post.author_name}
              </span>
              <div className="flex items-center gap-1 flex-wrap min-w-0">
                <span className="text-slate-400 text-sm">@comunidade</span>
                <span className="text-slate-400 text-sm">• {post.time_ago}</span>
              </div>
            </div>
          </div>

          {/* Verified Badge */}
          <span className="text-primary text-lg sm:text-xl flex-shrink-0">✝️</span>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="font-serif text-[1.15rem] sm:text-lg leading-9 sm:leading-relaxed text-slate-800 mb-3 break-words">
            {post.content}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif italic text-primary text-sm sm:text-base">
              {post.reference}
            </span>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getTagColor(
                post.tag
              )}`}
            >
              {post.tag}
            </span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-stone-100">
          {/* Reaction Buttons */}
          <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => handleReaction("amen")}
              className="flex items-center justify-center sm:justify-start gap-1 text-slate-400 hover:text-green-600 transition-colors min-w-0"
            >
              <span className="text-lg sm:text-base shrink-0">🙏</span>
              <span className="text-sm">{reactions.amen}</span>
            </button>
            <button
              onClick={() => handleReaction("touched")}
              className="flex items-center justify-center sm:justify-start gap-1 text-slate-400 hover:text-pink-600 transition-colors min-w-0"
            >
              <span className="text-lg sm:text-base shrink-0">🤍</span>
              <span className="text-sm">{reactions.touched}</span>
            </button>
            <button
              onClick={() => handleReaction("inspired")}
              className="flex items-center justify-center sm:justify-start gap-1 text-slate-400 hover:text-yellow-600 transition-colors min-w-0"
            >
              <span className="text-lg sm:text-base shrink-0">✨</span>
              <span className="text-sm">{reactions.inspired}</span>
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center justify-center sm:justify-start gap-2 text-slate-400 hover:text-primary transition-colors disabled:opacity-50 w-full sm:w-auto py-2 sm:py-0 rounded-xl bg-stone-50 sm:bg-transparent"
          >
            <span className="text-lg sm:text-base">📤</span>
            <span className="text-sm sm:text-sm">Partilhar</span>
          </button>
        </div>

        {/* Watermark (only visible in exported image) */}
        <div className="mt-3 pt-2 border-t border-stone-50 text-center text-xs text-slate-300">
          lido em fortalecimentodefe.pt
        </div>
      </div>

      <div className="fixed left-[-200vw] top-0 pointer-events-none" aria-hidden="true">
        <div
          ref={statusShareRef}
          className="w-[1080px] h-[1920px] bg-[#FDFBF7] px-[72px] pt-[56px] pb-[72px] text-slate-800 flex flex-col"
        >
          <div className="flex items-center justify-between mb-[28px]">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/15 flex items-center justify-center text-primary text-3xl">
                ✝️
              </div>
              <div>
                <p className="text-[28px] uppercase tracking-[0.3em] text-secondary">
                  Comunidade de Fé
                </p>
                <p className="text-[54px] font-serif font-semibold text-foreground">
                  Fortalecimento de Fé
                </p>
              </div>
            </div>
            <span className={`px-8 py-3 rounded-full text-[32px] font-semibold ${getTagColor(post.tag)}`}>
              {post.tag}
            </span>
          </div>

          <div
            className={`rounded-[56px] border border-stone-100 bg-white px-[72px] shadow-[0_24px_80px_rgba(45,55,72,0.08)] flex flex-col ${statusContainerClassName}`}
          >
            <div className={statusBodyClassName}>
              <div className={`${statusQuoteSpacingClassName} text-secondary text-[120px] leading-none`}>
                "
              </div>
              <p className={`font-serif text-slate-800 break-words ${statusContentClassName}`}>
                {post.content}
              </p>
            </div>

            <div className={`${statusFooterSpacingClassName} border-t border-stone-100`}>
              <p className={`font-serif italic text-primary ${statusReferenceClassName}`}>
                {post.reference}
              </p>

              <div className="flex items-center gap-6">
                <ShareAvatar
                  name={post.author_name}
                  avatarUrl={shareAvatarDataUrl}
                  shouldShowAvatarImage={Boolean(shareAvatarDataUrl)}
                  onImageError={() => setShareAvatarDataUrl(null)}
                  imageClassName="w-24 h-24 rounded-[32px] object-cover shrink-0"
                  fallbackClassName="w-24 h-24 text-[34px] rounded-[32px] shrink-0"
                />
                <div>
                  <p className="text-[42px] font-semibold text-slate-800">{post.author_name}</p>
                  <p className="text-[28px] text-slate-400">@comunidade • {post.time_ago}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 text-center">
            <p className="text-[28px] uppercase tracking-[0.28em] text-slate-400 mb-4">
              lido em fortalecimentodefe.pt
            </p>
            <p className="text-[34px] font-medium text-primary">
              Palavras que fortalecem. Reflexões que inspiram.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed left-[-200vw] top-0 pointer-events-none" aria-hidden="true">
        <div
          ref={squareShareRef}
          className="w-[1568px] h-[1008px] bg-[#FDFBF7] p-[32px] text-slate-800"
        >
          <div className="h-full rounded-[44px] border border-stone-100 bg-white px-[46px] py-[42px] shadow-[0_24px_80px_rgba(45,55,72,0.08)] flex flex-col">
            <div className="flex items-start justify-between gap-6 mb-12">
              <div className="flex items-start gap-8 min-w-0">
                <ShareAvatar
                  name={post.author_name}
                  avatarUrl={shareAvatarDataUrl}
                  shouldShowAvatarImage={Boolean(shareAvatarDataUrl)}
                  onImageError={() => setShareAvatarDataUrl(null)}
                  imageClassName="w-[120px] h-[120px] rounded-full object-cover shrink-0"
                  fallbackClassName="w-[120px] h-[120px] text-[38px] rounded-full shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-4 min-w-0">
                    <p className="text-[52px] font-semibold text-slate-800 truncate">{post.author_name}</p>
                    <p className="text-[30px] text-slate-400 truncate">@comunidade</p>
                  </div>
                  <p className="text-[30px] text-slate-400 mt-2">• {post.time_ago}</p>
                </div>
              </div>
              <div className="h-[68px] w-[68px] rounded-[16px] bg-primary text-white text-[44px] flex items-center justify-center shadow-[0_8px_24px_rgba(95,138,117,0.28)] shrink-0">
                +
              </div>
            </div>

            <div className="mb-10">
              <p className="font-serif text-[66px] leading-[1.15] text-slate-800 break-words mb-8">
                {post.content}
              </p>
              <div className="flex items-center gap-4">
                <p className="font-serif italic text-primary text-[42px]">
                  {post.reference}
                </p>
                <span className={`px-7 py-3 rounded-full text-[26px] font-semibold ${getTagColor(post.tag)}`}>
                  {post.tag}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-stone-100">
              <div className="flex items-center justify-between mb-10 text-slate-400">
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-2">
                    <span className="text-[34px]">🙏</span>
                    <span className="text-[28px]">{reactions.amen}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[34px]">🤍</span>
                    <span className="text-[28px]">{reactions.touched}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[34px]">✨</span>
                    <span className="text-[28px]">{reactions.inspired}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[28px]">
                  <span className="text-[34px]">📤</span>
                  <span>Partilhar</span>
                </div>
              </div>

              <p className="text-[22px] text-center text-slate-300">
                lido em fortalecimentodefe.pt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
