'use client';

import React, { useEffect, useState } from 'react';
import {
  AdCreative,
  AdTheme,
  CAMPAIGN_CONSTANTS,
  CreativeSlide,
  QrTarget,
  resolveDynamicTokens,
  resolveQrTarget,
  resolveSlideUrlLabel,
  resolveSlideUrlText,
} from '@/lib/marketing/campaign-kit';
import { getQrDataUrl, getQrMeta } from '@/lib/marketing/qr-helper';

interface AdCanvasPreviewProps {
  creative: AdCreative;
  slide: CreativeSlide;
  theme: AdTheme;
  aspect: '9:16' | '4:5' | '1:1';
  creatorHandle?: string;
  hoursValue?: string;
  kickHandle?: string;
  customHeadline?: string;
  customSpeechBubble?: string;
  customUrlText?: string;
  showQrOverride?: boolean;
  qrTargetOverride?: QrTarget;
  transparentOverlayOverride?: boolean;
  compact?: boolean;
  thumbnail?: boolean;
}

const ACCENT_HEX: Record<NonNullable<CreativeSlide['accentColor']>, { bg: string; text: string }> = {
  magenta: { bg: '#E6009E', text: '#FFFFFF' },
  lime: { bg: '#B5F43D', text: '#0B1A3D' },
  yellow: { bg: '#FFD400', text: '#1D2B4F' },
  cyan: { bg: '#00A8E8', text: '#FFFFFF' },
};

export default function AdCanvasPreview({
  creative,
  slide,
  theme,
  aspect,
  creatorHandle,
  hoursValue,
  kickHandle,
  customHeadline,
  customSpeechBubble,
  customUrlText,
  showQrOverride,
  qrTargetOverride,
  transparentOverlayOverride,
  compact = false,
  thumbnail = false,
}: AdCanvasPreviewProps) {
  const isCortina = theme === 'cortina';
  const isStory = aspect === '9:16';
  const isSquare = aspect === '1:1';
  const isOverlay = transparentOverlayOverride ?? Boolean(slide.isTransparentOverlay);
  const hasFullScene = !isOverlay && Boolean(slide.fullSceneImage);

  const tokens = {
    hoursValue: hoursValue ?? creative.defaultHourValue ?? '12',
    kickHandle: kickHandle ?? creative.defaultKickHandle ?? 'deivid',
  };

  const handle = creatorHandle?.trim().replace(/^@+/, '');
  const kicker = resolveDynamicTokens(slide.kicker, tokens);
  const headline = resolveDynamicTokens(
    (customHeadline?.trim() || slide.headline).trim(),
    tokens,
  );
  const rawSpeech =
    customSpeechBubble !== undefined && customSpeechBubble.trim().length > 0
      ? customSpeechBubble.trim()
      : slide.speechBubble;
  const speechBubble = rawSpeech ? resolveDynamicTokens(rawSpeech, tokens) : undefined;
  const body = resolveDynamicTokens(slide.body, tokens);
  const giantNumber = slide.giantNumber
    ? resolveDynamicTokens(slide.giantNumber, tokens)
    : undefined;
  const urlLabel = resolveSlideUrlLabel(slide, {
    qrTargetOverride,
    ...tokens,
  });
  const urlText = resolveSlideUrlText(slide, {
    customUrlText,
    qrTargetOverride,
    ...tokens,
  });

  const showQr = showQrOverride ?? Boolean(slide.showQr);
  const effectiveQrTarget = resolveQrTarget(slide, qrTargetOverride);
  const qrMeta = getQrMeta(effectiveQrTarget);
  const [generatedQr, setGeneratedQr] = useState<{
    target: QrTarget;
    src: string;
  } | null>(null);

  useEffect(() => {
    if (!showQr || compact || thumbnail) return;
    let cancelled = false;
    getQrDataUrl(effectiveQrTarget)
      .then((dataUrl) => {
        if (!cancelled) {
          setGeneratedQr({ target: effectiveQrTarget, src: dataUrl });
        }
      })
      .catch(() => {
        if (!cancelled && effectiveQrTarget === 'donate') {
          setGeneratedQr({
            target: 'donate',
            src: CAMPAIGN_CONSTANTS.assets.qrDonate,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [effectiveQrTarget, showQr, compact, thumbnail]);

  const resolvedQrSrc = thumbnail
    ? `/api/qr?u=${encodeURIComponent(qrMeta.url)}`
    : generatedQr?.target === effectiveQrTarget
      ? generatedQr.src
      : effectiveQrTarget === 'donate'
        ? CAMPAIGN_CONSTANTS.assets.qrDonate
        : null;

  const accent = ACCENT_HEX[slide.accentColor ?? 'magenta'];
  const darkSurface = isOverlay || isCortina || hasFullScene;
  const progressPct = Math.max(0, Math.min(100, slide.progressPercent ?? 60));

  const aspectClass =
    aspect === '9:16'
      ? 'aspect-[9/16]'
      : aspect === '1:1'
        ? 'aspect-square'
        : 'aspect-[4/5]';

  const padClass = compact
    ? 'px-3 py-3'
    : isStory
      ? 'px-4 sm:px-5 pt-6 pb-5'
      : 'px-5 pt-4 pb-4';

  return (
    <div
      className={`relative w-full overflow-hidden select-none flex flex-col justify-between ${aspectClass} ${
        compact ? 'rounded-2xl' : 'rounded-[24px]'
      } ${
        isOverlay
          ? 'text-white border-2 border-dashed border-[#1D2B4F]/40'
          : hasFullScene
            ? 'bg-[#071127] text-white'
            : isCortina
              ? 'bg-gradient-to-br from-[#0D1E47] via-[#0B1A3D] to-[#071127] text-white'
              : 'bg-gradient-to-b from-[#5BB8F0] via-[#A9E2FF] to-[#FFF6C7] text-[#1D2B4F]'
      }`}
      style={
        isOverlay
          ? {
              backgroundColor: '#1E293B',
              backgroundImage:
                'linear-gradient(45deg, #2B394F 25%, transparent 25%), linear-gradient(-45deg, #2B394F 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2B394F 75%), linear-gradient(-45deg, transparent 75%, #2B394F 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }
          : undefined
      }
    >
      {/* LAYER 1: Transparent Overlay Scrims OR Full-Bleed 3D Scene OR Cortina Cape & Dots OR Sky Clouds */}
      {isOverlay ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[36%] bg-gradient-to-b from-[#071127]/95 via-[#071127]/72 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-[#071127]/95 via-[#071127]/75 to-transparent"
          />
          {/* Subtle corner cape accent without blocking center video */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 h-28 w-28"
            style={{
              backgroundColor: accent.bg,
              clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%)',
              opacity: 0.9,
            }}
          />
        </>
      ) : hasFullScene && slide.fullSceneImage ? (
        <>
          <img
            src={slide.fullSceneImage}
            alt={headline}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[52%] bg-gradient-to-b from-[#071127]/92 via-[#071127]/55 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-[#071127]/95 via-[#071127]/72 to-transparent"
          />
        </>
      ) : isCortina ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)',
              backgroundSize: compact ? '12px 12px' : '18px 18px',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-[44%]"
            style={{
              backgroundColor: accent.bg,
              clipPath: 'polygon(36% 0%, 100% 0%, 100% 100%, 0% 100%)',
              opacity: 0.92,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-[14%]"
            style={{
              backgroundColor: '#071127',
              clipPath: 'polygon(65% 0%, 100% 0%, 100% 100%, 0% 100%)',
              opacity: 0.35,
            }}
          />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 -right-6 h-32 w-32 rounded-full bg-[#FFD400]/55 blur-xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[18%] -left-10 h-28 w-36 rounded-full bg-white/55 blur-md"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[24%] -right-8 h-24 w-32 rounded-full bg-white/50 blur-md"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#FFE98A]/65 to-transparent"
          />
        </>
      )}

      {/* Giant Translucent Watermark Numeral (e.g., 48H, 12H, 01, 60%) */}
      {giantNumber && !hasFullScene && !isOverlay && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-2 bottom-[14%] font-display font-extrabold leading-none tracking-tighter select-none ${
            compact ? 'text-[54px]' : isStory ? 'text-[138px]' : 'text-[116px]'
          } ${
            isCortina
              ? slide.accentColor === 'lime' || slide.accentColor === 'yellow'
                ? 'text-[#0B1A3D]/18'
                : 'text-white/14'
              : 'text-[#1D2B4F]/10'
          }`}
        >
          {giantNumber}
        </div>
      )}

      {/* FOREGROUND POSTER LAYOUT */}
      <div className={`relative z-10 flex flex-1 flex-col justify-between min-h-0 ${padClass}`}>
        {/* TOP ROW: Floating FSV × Kavanah Capsule Lockup + Optional Tag */}
        <div className="flex items-center justify-between gap-1.5 shrink-0">
          <div
            className={`inline-flex items-center gap-1 rounded-full bg-white shadow-md min-w-0 ${
              compact ? 'px-2 py-1' : 'px-2.5 py-1'
            } ${!darkSurface ? 'border-2 border-[#1D2B4F]' : ''}`}
          >
            <img
              src={CAMPAIGN_CONSTANTS.assets.logoFsv}
              alt="Fundación Segundos de Vida"
              referrerPolicy="no-referrer"
              className={compact ? 'h-3.5 w-auto object-contain shrink-0' : 'h-4 sm:h-5 w-auto object-contain shrink-0'}
            />
            <span
              aria-hidden="true"
              className={`font-bold text-[#1D2B4F]/45 shrink-0 ${compact ? 'text-[8px]' : 'text-[10px]'}`}
            >
              ×
            </span>
            <img
              src={CAMPAIGN_CONSTANTS.assets.logoKavanahBlackHorizontal}
              alt="Familia Kavanah"
              referrerPolicy="no-referrer"
              className={compact ? 'h-2.5 w-auto object-contain shrink-0' : 'h-3.5 sm:h-4 w-auto object-contain shrink-0'}
            />
          </div>

          {!compact && (
            <div
              className="rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider shrink-0"
              style={{
                backgroundColor: handle ? '#B5F43D' : accent.bg,
                color: handle ? '#0B1A3D' : accent.text,
              }}
            >
              {handle ? `@${handle.toUpperCase()}` : isOverlay ? '48H EN VIVO' : '48H'}
            </div>
          )}
        </div>

        {/* HEADLINE SECTION */}
        <div className={compact ? 'mt-1.5 space-y-0.5' : isStory ? 'mt-3 space-y-1.5' : 'mt-2 space-y-1'}>
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={compact ? 'h-0.5 w-3 rounded-full' : 'h-[3px] w-5 rounded-full'}
              style={{ backgroundColor: darkSurface ? accent.bg : '#C62828' }}
            />
            <span
              className={`font-extrabold uppercase tracking-wider truncate ${
                compact ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'
              }`}
              style={{
                color: darkSurface
                  ? slide.accentColor === 'magenta'
                    ? '#FF7AD3'
                    : accent.bg
                  : '#C62828',
              }}
            >
              {kicker}
            </span>
          </div>

          <h3
            className={`font-display font-extrabold leading-[1.03] text-balance ${
              compact
                ? 'text-[13px]'
                : isStory
                  ? 'text-[26px] sm:text-[30px]'
                  : isSquare
                    ? 'text-[21px] sm:text-[24px]'
                    : 'text-[23px] sm:text-[26px]'
            } ${darkSurface ? 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]' : 'text-[#1D2B4F]'}`}
          >
            {headline}
          </h3>

          {!compact && !hasFullScene && !isOverlay && (
            <p
              className={`leading-snug text-pretty font-semibold ${
                isStory ? 'text-[12px] sm:text-[13px]' : 'text-[11px] sm:text-[12px]'
              } ${darkSurface ? 'text-[#DCE7FF]' : 'text-[#243763]'}`}
            >
              {body}
            </p>
          )}
        </div>

        {/* CENTER VISUAL: Transparent Open Window OR Direct Characters + Speech Bubble OR Photo Comparison */}
        <div className="relative flex-1 min-h-0 flex flex-col justify-end my-1">
          {isOverlay ? (
            <div className="flex-1 min-h-0 flex flex-col justify-between">
              {/* Open Center Transparency Guide (Exported PNG is 100% alpha=0 here) */}
              <div className="flex-1 flex flex-col items-center justify-center px-3 text-center">
                {!thumbnail ? (
                  <div className="rounded-2xl border-2 border-dashed border-white/45 bg-[#071127]/35 px-3 py-1.5 backdrop-blur-[1px]">
                    <div className={`font-extrabold uppercase tracking-wider text-[#B5F43D] ${compact ? 'text-[7px]' : 'text-[9.5px]'}`}>
                      Centro 100% Transparente (PNG)
                    </div>
                    {!compact && (
                      <p className="mt-0.5 text-[9.5px] font-semibold text-white/85">
                        Aquí se verá tu video o foto en Instagram / Reels
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Bottom Overlay Strip: Speech Bubble + Cause on Left, Direct 3D Child on Right */}
              {(slide.characterImage || speechBubble || (!compact && body)) && (
                <div className={`flex items-end justify-between gap-2 shrink-0 ${compact ? 'pt-1' : 'pt-2'}`}>
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5 pb-0.5">
                    {speechBubble && !compact && (
                      <div className="relative self-start max-w-full">
                        <div className="relative rounded-2xl bg-white text-[#1D2B4F] border-2 border-[#1D2B4F] shadow-[0_3px_0_#1D2B4F] px-2.5 py-1.5 text-[10px] sm:text-[10.5px] leading-tight font-extrabold">
                          {speechBubble}
                          {slide.characterImage && (
                            <>
                              <span
                                aria-hidden="true"
                                className="absolute right-4 -bottom-[8px] h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#1D2B4F]"
                              />
                              <span
                                aria-hidden="true"
                                className="absolute right-[18px] -bottom-[5px] h-0 w-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-white"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    {!compact && body && (
                      <p className="text-[10px] sm:text-[10.5px] leading-snug font-bold text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                        {body}
                      </p>
                    )}
                  </div>

                  {slide.characterImage && slide.secondaryCharacterImage ? (
                    <div className="shrink-0 flex items-end -space-x-2">
                      <img
                        src={slide.characterImage}
                        alt="Super Calvito"
                        referrerPolicy="no-referrer"
                        className={`${
                          compact ? 'h-12' : 'h-24 sm:h-28'
                        } w-auto object-contain object-bottom drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]`}
                      />
                      <img
                        src={slide.secondaryCharacterImage}
                        alt="Super Calvita"
                        referrerPolicy="no-referrer"
                        className={`${
                          compact ? 'h-12' : 'h-24 sm:h-28'
                        } w-auto object-contain object-bottom drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]`}
                      />
                    </div>
                  ) : slide.characterImage ? (
                    <div className="shrink-0 flex items-end justify-end">
                      <img
                        src={slide.characterImage}
                        alt="Super Calvito"
                        referrerPolicy="no-referrer"
                        className={`${
                          compact ? 'h-14' : 'h-28 sm:h-32'
                        } w-auto object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]`}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : (
            <>
          {/* Cartoon Speech Bubble ("modal de habla, así muy caricatura") */}
          {speechBubble && (
            <div
              className={`relative z-20 self-start max-w-[92%] ${
                hasFullScene
                  ? compact
                    ? 'mb-auto mt-1'
                    : 'mb-auto mt-2'
                  : compact
                    ? 'mb-1'
                    : 'mb-2'
              }`}
            >
              <div
                className={`relative rounded-2xl bg-white text-[#1D2B4F] border-[2.5px] border-[#1D2B4F] shadow-[0_4px_0_#1D2B4F] ${
                  compact ? 'px-2 py-1 text-[8px] leading-tight' : 'px-3.5 py-2 text-xs sm:text-[13px] leading-snug'
                } font-extrabold`}
              >
                {speechBubble}
                {/* Speech Bubble Pointer Tail */}
                <span
                  aria-hidden="true"
                  className={`absolute left-6 -bottom-[10px] h-0 w-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#1D2B4F] ${
                    compact ? 'hidden' : 'block'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute left-[26px] -bottom-[6px] h-0 w-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-white ${
                    compact ? 'hidden' : 'block'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Direct Composition by Content Type */}
          {hasFullScene ? (
            // Full-bleed 3D scene stays clear in the middle! Only optional small body caption near bottom if space allows
            <div className="flex-1" />
          ) : slide.houseImage && slide.secondaryHouseImage ? (
            // Side-by-side Hoy 60% vs Meta 100% directly on canvas
            <div className="flex-1 min-h-0 flex flex-col justify-center gap-2">
              <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0">
                <div className="flex flex-col min-h-0">
                  <div className="relative flex-1 min-h-0 overflow-hidden rounded-2xl border-[2.5px] border-[#1D2B4F] shadow-md">
                    <img
                      src={slide.houseImage}
                      alt={`La Supercasa hoy al ${progressPct}%`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 rounded-md bg-[#FFD400] px-1.5 py-0.5 text-[9px] font-extrabold text-[#1D2B4F] border border-[#1D2B4F]">
                      HOY · {progressPct}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col min-h-0">
                  <div className="relative flex-1 min-h-0 overflow-hidden rounded-2xl border-[2.5px] border-[#1D2B4F] shadow-md">
                    <img
                      src={slide.secondaryHouseImage}
                      alt="La Supercasa terminada al 100%"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 rounded-md bg-[#4CAF50] px-1.5 py-0.5 text-[9px] font-extrabold text-white border border-[#1D2B4F]">
                      META · 100%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : slide.houseImage ? (
            // Single House 60% photo integrated cleanly
            <div className="flex-1 min-h-0 flex flex-col justify-center">
              <div className="relative flex-1 min-h-0 overflow-hidden rounded-2xl border-[2.5px] border-[#1D2B4F] shadow-md">
                <img
                  src={slide.houseImage}
                  alt={`Avance real de La Supercasa al ${progressPct}%`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                {!compact && (
                  <span className="absolute top-2 left-2 rounded-lg bg-[#FFD400] px-2 py-0.5 text-[10px] font-extrabold text-[#1D2B4F] border border-[#1D2B4F]">
                    OBRA REAL · {progressPct}%
                  </span>
                )}
              </div>
            </div>
          ) : slide.scheduleRows && slide.scheduleRows.length > 0 ? (
            // Clean typographic schedule lines (no nested webpage cards)
            <div className="flex-1 min-h-0 flex flex-col justify-center gap-2 py-1">
              {slide.scheduleRows.map((row) => {
                const resolvedTitle = resolveDynamicTokens(row.title, tokens);
                return (
                  <div
                    key={row.time + row.title}
                    className={`rounded-xl px-3 py-2 ${
                      darkSurface
                        ? 'bg-[#071127]/72 border border-white/20'
                        : 'bg-white/90 border-2 border-[#1D2B4F]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-mono font-extrabold tabular-nums ${
                          compact ? 'text-[7px]' : 'text-[10px]'
                        }`}
                        style={{ color: darkSurface ? '#B5F43D' : '#C62828' }}
                      >
                        {row.time}
                      </span>
                      {!compact && (
                        <span
                          className={`text-[9px] font-bold truncate ${
                            darkSurface ? 'text-[#FFD400]' : 'text-[#46557A]'
                          }`}
                        >
                          {row.host}
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-display font-extrabold leading-tight truncate ${
                        compact ? 'text-[8px]' : 'text-[12px]'
                      } ${darkSurface ? 'text-white' : 'text-[#1D2B4F]'}`}
                    >
                      {resolvedTitle}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : slide.tierRows && slide.tierRows.length > 0 ? (
            // Clean typographic donation breakdown + optional direct Calvito
            <div className="flex-1 min-h-0 flex items-end gap-2 py-1">
              <div className="flex flex-col justify-center gap-2 flex-1 min-w-0 my-auto">
                {slide.tierRows.map((tier) => (
                  <div
                    key={tier.label}
                    className={`rounded-xl px-3 py-1.5 flex items-center justify-between gap-2 ${
                      darkSurface
                        ? 'bg-[#071127]/75 border border-white/25'
                        : 'bg-white/92 border-2 border-[#1D2B4F]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className={`font-extrabold truncate ${
                          compact ? 'text-[8px]' : 'text-[11px]'
                        } ${darkSurface ? 'text-white' : 'text-[#1D2B4F]'}`}
                      >
                        {tier.label}
                      </div>
                      {!compact && (
                        <div
                          className={`text-[9px] truncate ${
                            darkSurface ? 'text-[#B5F43D]' : 'text-[#46557A]'
                          }`}
                        >
                          {tier.note}
                        </div>
                      )}
                    </div>
                    <span
                      className={`font-display font-extrabold tabular-nums shrink-0 ${
                        compact ? 'text-[9px]' : 'text-sm'
                      }`}
                      style={{ color: darkSurface ? '#FFD400' : '#C62828' }}
                    >
                      {tier.amount}
                    </span>
                  </div>
                ))}
              </div>

              {slide.characterImage && (
                <div className="w-[38%] h-full flex items-end justify-center min-h-0">
                  <img
                    src={slide.characterImage}
                    alt="Personaje Super Calvito"
                    referrerPolicy="no-referrer"
                    className="max-h-full w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
                  />
                </div>
              )}
            </div>
          ) : slide.characterImage && slide.secondaryCharacterImage ? (
            // Dual characters sitting DIRECTLY on background (ZERO inner box!)
            <div className="relative flex-1 min-h-0 grid grid-cols-2 items-end gap-1 pt-1">
              <img
                src={slide.characterImage}
                alt="Super Calvito"
                referrerPolicy="no-referrer"
                className="max-h-full w-full object-contain object-bottom drop-shadow-[0_10px_18px_rgba(0,0,0,0.38)]"
              />
              <img
                src={slide.secondaryCharacterImage}
                alt="Super Calvita"
                referrerPolicy="no-referrer"
                className="max-h-full w-full object-contain object-bottom drop-shadow-[0_10px_18px_rgba(0,0,0,0.38)]"
              />
            </div>
          ) : slide.characterImage ? (
            // Single 3D character sitting DIRECTLY on background (ZERO inner box!)
            <div className="relative flex-1 min-h-0 flex items-end justify-center pt-1">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 bottom-2 h-[65%] rounded-full blur-2xl"
                style={{
                  backgroundColor: darkSurface
                    ? 'rgba(255,255,255,0.14)'
                    : 'rgba(255,255,255,0.6)',
                }}
              />
              <img
                src={slide.characterImage}
                alt="Super Calvito"
                referrerPolicy="no-referrer"
                className="relative z-10 max-h-full w-auto object-contain object-bottom drop-shadow-[0_12px_20px_rgba(0,0,0,0.35)]"
              />
            </div>
          ) : null}
            </>
          )}

          {/* Clean 60% Construction Bar (when applicable) */}
          {slide.showProgressBar && !compact && (
            <div className="mt-2 shrink-0">
              <div className="relative h-5 w-full overflow-hidden rounded-full border-2 border-[#1D2B4F] bg-white">
                <div
                  className="h-full rounded-full bg-[#4CAF50]"
                  style={{ width: `${progressPct}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-2.5 text-[9px] font-extrabold">
                  <span className="text-white drop-shadow">
                    {progressPct}% CONSTRUIDO
                  </span>
                  <span className="text-[#1D2B4F]">META $250M</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* POSTER FOOTER: Editorial URL Callout + White QR Card (NO FAKE WEB BUTTON!) */}
        <div className="relative z-10 shrink-0 pt-2">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div
                className={`font-extrabold uppercase tracking-wider ${
                  compact ? 'text-[7px]' : 'text-[9px] sm:text-[10px]'
                }`}
                style={{
                  color: darkSurface ? '#B5F43D' : '#C62828',
                }}
              >
                {urlLabel}
              </div>
              <div
                className={`font-display font-extrabold leading-tight tracking-tight ${
                  compact
                    ? 'text-[9.5px] truncate'
                    : showQr
                      ? 'text-[10.5px] sm:text-[12px] whitespace-nowrap truncate'
                      : isStory
                        ? 'text-[13px] sm:text-[14px] break-words'
                        : 'text-[14px] sm:text-[15.5px] break-words'
                } ${darkSurface ? 'text-white' : 'text-[#1D2B4F]'}`}
              >
                {urlText}
              </div>
              {!compact && (
                <div
                  className={`mt-0.5 text-[8.5px] font-bold tracking-tight ${
                    darkSurface ? 'text-white/80' : 'text-[#46557A]'
                  }`}
                >
                  Fundación Segundos de Vida · #PonteLaCapa
                </div>
              )}
            </div>

            {showQr && !compact && (
              <div
                data-qr-target={effectiveQrTarget}
                className={`shrink-0 rounded-xl bg-white p-1.5 text-center shadow-lg border-2 ${
                  effectiveQrTarget === 'live' ? 'border-[#E6009E]' : 'border-[#1D2B4F]'
                }`}
              >
                {resolvedQrSrc ? (
                  <img
                    src={resolvedQrSrc}
                    alt={`QR ${qrMeta.url}`}
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 sm:h-12 sm:w-12 object-contain mx-auto"
                  />
                ) : (
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded bg-[#E4F5FE] mx-auto" />
                )}
                <div
                  className={`mt-0.5 text-[6.5px] font-extrabold tracking-wider ${
                    effectiveQrTarget === 'live' ? 'text-[#B8007E]' : 'text-[#1D2B4F]'
                  }`}
                >
                  {qrMeta.boxCaption}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
