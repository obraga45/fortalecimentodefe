"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const SITE_WATERMARK = "fortalecimentodefe.pt";

const formatAuthorHandle = (authorName: string) => {
  const slug = authorName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9.]/g, "");

  return slug ? `@${slug}` : "@comunidade";
};

function ExportAvatarRing({
  name,
  avatarUrl,
  shouldShowAvatarImage,
  onImageError,
}: {
  name: string;
  avatarUrl: string | null;
  shouldShowAvatarImage: boolean;
  onImageError: () => void;
}) {
  return (
    <div
      className="shrink-0 rounded-full p-[3px]"
      style={{
        background:
          "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
      }}
    >
      <div className="rounded-full bg-white p-[4px]">
        <ShareAvatar
          name={name}
          avatarUrl={avatarUrl}
          shouldShowAvatarImage={shouldShowAvatarImage}
          onImageError={onImageError}
          imageClassName="w-[88px] h-[88px] rounded-full object-cover"
          fallbackClassName="w-[88px] h-[88px] text-[30px] rounded-full"
        />
      </div>
    </div>
  );
}

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
  const tweetShareRef = useRef<HTMLDivElement>(null);
  const [reactions, setReactions] = useState(post.reactions);
  const [isSharing, setIsSharing] = useState(false);
  const [shareCaptureMounted, setShareCaptureMounted] = useState(false);
  const [avatarUnavailable, setAvatarUnavailable] = useState(false);
  const [shareAvatarDataUrl, setShareAvatarDataUrl] = useState<string | null>(null);
  const shareText = post.reference?.trim()
    ? `${post.content}\n\n${post.reference}\n\nlido em fortalecimentodefe.pt`
    : `${post.content}\n\nlido em fortalecimentodefe.pt`;
  const shouldShowAvatarImage = Boolean(post.avatar_url) && !avatarUnavailable;
  const contentLength = post.content.trim().length;
  const exportContentClassName =
    contentLength <= 80
      ? "text-[58px] leading-[1.18]"
      : contentLength <= 160
        ? "text-[48px] leading-[1.22]"
        : "text-[40px] leading-[1.28]";
  const authorHandle = formatAuthorHandle(post.author_name);

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
        backgroundColor: "#FFFFFF",
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

  const waitForShareCaptureMount = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

  const handleShare = async () => {
    if (!cardRef.current || isSharing) return;
    setIsSharing(true);
    setShareCaptureMounted(true);

    try {
      await waitForShareCaptureMount();

      // #region debug-point D:share-entry
      reportShareDebug("D", "handleShare started", {
        hasTweetShareRef: Boolean(tweetShareRef.current),
        avatarUrl: post.avatar_url,
        shouldShowAvatarImage,
      });
      // #endregion

      const shareAsset = await captureShareImage(
        tweetShareRef.current,
        "post-fortalecimento-fe.png"
      );

      if (!shareAsset) {
        // #region debug-point E:share-asset-null
        reportShareDebug("E", "share asset unavailable", {});
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
          title: "Status — Fortalecimento de Fé",
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
            title: "Status — Fortalecimento de Fé",
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
      setShareCaptureMounted(false);
    }
  };

  const shareCaptureTemplate = (
    <div className="share-capture-root" aria-hidden="true">
      <div
        ref={tweetShareRef}
        className="relative w-[1200px] min-h-[720px] bg-white px-[72px] pt-[64px] pb-[88px] text-black"
      >
        <div
          className="mb-14"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <ExportAvatarRing
            name={post.author_name}
            avatarUrl={shareAvatarDataUrl}
            shouldShowAvatarImage={Boolean(shareAvatarDataUrl)}
            onImageError={() => setShareAvatarDataUrl(null)}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flex: "1 1 auto",
              minWidth: 0,
              maxWidth: 980,
            }}
          >
            <div
              style={{
                display: "block",
                fontSize: 34,
                fontWeight: 700,
                lineHeight: "46px",
                color: "#000000",
                whiteSpace: "nowrap",
                margin: 0,
                padding: 0,
              }}
            >
              {post.author_name}
            </div>
            <div
              style={{
                display: "block",
                fontSize: 28,
                fontWeight: 400,
                lineHeight: "38px",
                color: "#8E8E8E",
                margin: 0,
                padding: 0,
                marginTop: 10,
              }}
            >
              {authorHandle}
            </div>
          </div>
        </div>

        <p className={`font-serif font-semibold text-black break-words ${exportContentClassName}`}>
          {post.content}
        </p>

        {post.reference ? (
          <p className="mt-10 font-serif italic text-[#6B7280] text-[30px] leading-snug">
            {post.reference}
          </p>
        ) : null}

        <p className="absolute bottom-10 right-[72px] text-[22px] font-medium tracking-wide text-black/20">
          {SITE_WATERMARK}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative w-full min-w-0 max-w-full flex-1 flex flex-col">
      <div
        ref={cardRef}
        className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 sm:p-5 w-full max-w-full overflow-hidden flex-1 flex flex-col"
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
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-slate-800 font-bold text-[0.9375rem] sm:text-base leading-snug break-words">
                {post.author_name}
              </span>
              <span className="text-slate-400 text-xs sm:text-sm truncate">@comunidade</span>
              <span className="text-slate-400 text-xs sm:text-sm">• {post.time_ago}</span>
            </div>
          </div>

          <div
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary text-white text-lg sm:text-2xl flex items-center justify-center shadow-md shrink-0"
            aria-hidden="true"
          >
            +
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="font-serif text-base sm:text-lg leading-relaxed sm:leading-relaxed text-slate-800 mb-3 break-words [overflow-wrap:anywhere]">
            {post.content}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {post.reference?.trim() ? (
              <span className="font-serif italic text-primary text-sm sm:text-base">
                {post.reference}
              </span>
            ) : null}
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
          <div className="grid grid-cols-3 sm:flex items-stretch sm:items-center gap-1 sm:gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleReaction("amen")}
              className="flex items-center justify-center gap-1.5 text-slate-400 hover:text-green-600 transition-colors min-h-[2.75rem] sm:min-h-0 rounded-lg sm:rounded-none active:bg-stone-50 sm:active:bg-transparent"
            >
              <span className="text-lg sm:text-base shrink-0">🙏</span>
              <span className="text-sm">{reactions.amen}</span>
            </button>
            <button
              type="button"
              onClick={() => handleReaction("touched")}
              className="flex items-center justify-center gap-1.5 text-slate-400 hover:text-pink-600 transition-colors min-h-[2.75rem] sm:min-h-0 rounded-lg sm:rounded-none active:bg-stone-50 sm:active:bg-transparent"
            >
              <span className="text-lg sm:text-base shrink-0">🤍</span>
              <span className="text-sm">{reactions.touched}</span>
            </button>
            <button
              type="button"
              onClick={() => handleReaction("inspired")}
              className="flex items-center justify-center gap-1.5 text-slate-400 hover:text-yellow-600 transition-colors min-h-[2.75rem] sm:min-h-0 rounded-lg sm:rounded-none active:bg-stone-50 sm:active:bg-transparent"
            >
              <span className="text-lg sm:text-base shrink-0">✨</span>
              <span className="text-sm">{reactions.inspired}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center justify-center gap-2 text-slate-600 hover:text-primary transition-colors disabled:opacity-50 w-full sm:w-auto min-h-[2.75rem] sm:min-h-0 py-2.5 sm:py-0 rounded-xl bg-stone-50 sm:bg-transparent font-medium text-sm active:bg-stone-100 sm:active:bg-transparent"
          >
            <span className="text-lg sm:text-base" aria-hidden="true">
              📤
            </span>
            <span className="text-sm">
              {isSharing ? "A gerar imagem…" : "Partilhar"}
            </span>
          </button>
        </div>

        <div className="mt-3 pt-2 border-t border-stone-50 text-center text-[10px] sm:text-xs text-slate-300 break-all px-2">
          lido em fortalecimentodefe.pt
        </div>
      </div>

      {shareCaptureMounted && typeof document !== "undefined"
        ? createPortal(shareCaptureTemplate, document.body)
        : null}
    </div>
  );
}
