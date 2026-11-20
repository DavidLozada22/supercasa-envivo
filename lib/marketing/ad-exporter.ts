'use client';

import {
  AdCreative,
  AdTheme,
  CAMPAIGN_CONSTANTS,
  CreativeSlide,
  QrTarget,
  getCanvasDimensions,
  resolveDynamicTokens,
  resolveQrTarget,
  resolveSlideUrlLabel,
  resolveSlideUrlText,
} from './campaign-kit';
import { getQrDataUrl, getQrMeta } from './qr-helper';

export interface ExportOptions {
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
}

const ACCENT_HEX: Record<NonNullable<CreativeSlide['accentColor']>, { bg: string; text: string; light: string }> = {
  magenta: { bg: '#E6009E', text: '#FFFFFF', light: '#FF7AD3' },
  lime: { bg: '#B5F43D', text: '#0B1A3D', light: '#B5F43D' },
  yellow: { bg: '#FFD400', text: '#1D2B4F', light: '#FFD400' },
  cyan: { bg: '#00A8E8', text: '#FFFFFF', light: '#5FD0FF' },
};

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const testLine = current ? `${current} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      current = testLine;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawContainedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  alignBottom = false,
) {
  const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = x + (w - dw) / 2;
  const dy = alignBottom ? y + (h - dh) : y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
) {
  ctx.save();
  if (radius > 0) {
    drawRoundedRect(ctx, x, y, w, h, radius);
    ctx.clip();
  }
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  opts?: {
    fontSize?: number;
    padX?: number;
    padY?: number;
    lineHeight?: number;
    tailAlignRight?: boolean;
    measureOnly?: boolean;
  },
): number {
  const fontSize = opts?.fontSize ?? 32;
  const padX = opts?.padX ?? 34;
  const padY = opts?.padY ?? 24;
  const lineHeight = opts?.lineHeight ?? 42;
  const tailHeight = opts?.fontSize && opts.fontSize < 30 ? 22 : 28;

  ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
  const lines = wrapText(ctx, text, maxWidth - padX * 2).slice(0, 3);
  const longestLine = Math.max(...lines.map((l) => ctx.measureText(l).width), 160);
  const bubbleW = Math.min(maxWidth, longestLine + padX * 2);
  const bubbleH = lines.length * lineHeight + padY * 2;
  const totalUsed = bubbleH + tailHeight + 6;

  if (opts?.measureOnly) {
    return totalUsed;
  }

  // Hard comic shadow
  ctx.save();
  drawRoundedRect(ctx, x, y + 8, bubbleW, bubbleH, 28);
  ctx.fillStyle = '#1D2B4F';
  ctx.fill();

  // Bubble fill + border
  drawRoundedRect(ctx, x, y, bubbleW, bubbleH, 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 4.5;
  ctx.strokeStyle = '#1D2B4F';
  ctx.stroke();

  // Pointer tail pointing down toward character (left or right aligned)
  const tailX = opts?.tailAlignRight
    ? Math.max(x + 28, x + bubbleW - 92)
    : Math.min(x + bubbleW - 60, x + 76);
  const tailY = y + bubbleH - 2;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(tailX + (opts?.tailAlignRight ? 26 : 18), tailY + tailHeight);
  ctx.lineTo(tailX + 40, tailY);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 4.5;
  ctx.strokeStyle = '#1D2B4F';
  ctx.stroke();

  // Cover top seam of tail cleanly with white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(tailX - 2, tailY - 6, 44, 10);

  // Text
  ctx.fillStyle = '#1D2B4F';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  lines.forEach((line, idx) => {
    ctx.fillText(line, x + padX, y + padY + idx * lineHeight);
  });
  ctx.restore();

  return totalUsed;
}

export async function renderAdToDataUrl(options: ExportOptions): Promise<string> {
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }

  const { width, height } = getCanvasDimensions(options.aspect);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const isCortina = options.theme === 'cortina';
  const isStory = options.aspect === '9:16';
  const isSquare = options.aspect === '1:1';
  const slide = options.slide;
  const isOverlay =
    options.transparentOverlayOverride ?? Boolean(slide.isTransparentOverlay);
  const hasFullScene = !isOverlay && Boolean(slide.fullSceneImage);
  const darkSurface = isOverlay || isCortina || hasFullScene;

  const tokens = {
    hoursValue: options.hoursValue ?? options.creative.defaultHourValue ?? '12',
    kickHandle: options.kickHandle ?? options.creative.defaultKickHandle ?? 'deivid',
  };

  const handle = options.creatorHandle?.trim().replace(/^@+/, '');
  const kickerText = resolveDynamicTokens(slide.kicker, tokens).toUpperCase();
  const headlineText = resolveDynamicTokens(
    (options.customHeadline?.trim() || slide.headline).trim(),
    tokens,
  );
  const rawSpeech =
    options.customSpeechBubble !== undefined && options.customSpeechBubble.trim().length > 0
      ? options.customSpeechBubble.trim()
      : slide.speechBubble;
  const speechText = rawSpeech ? resolveDynamicTokens(rawSpeech, tokens) : undefined;
  const bodyText = resolveDynamicTokens(slide.body, tokens);
  const giantNumber = slide.giantNumber
    ? resolveDynamicTokens(slide.giantNumber, tokens)
    : undefined;
  const urlLabel = resolveSlideUrlLabel(slide, {
    qrTargetOverride: options.qrTargetOverride,
    ...tokens,
  }).toUpperCase();
  const urlText = resolveSlideUrlText(slide, {
    customUrlText: options.customUrlText,
    qrTargetOverride: options.qrTargetOverride,
    ...tokens,
  });
  const showQr = options.showQrOverride ?? Boolean(slide.showQr);
  const effectiveQrTarget = resolveQrTarget(slide, options.qrTargetOverride);
  const qrMeta = getQrMeta(effectiveQrTarget);
  const accent = ACCENT_HEX[slide.accentColor ?? 'magenta'];
  const progressPct = Math.max(0, Math.min(100, slide.progressPercent ?? 60));

  // Preload all needed assets (including dynamically generated QR for /envivo or /donar)
  const qrImagePromise: Promise<HTMLImageElement | null> = showQr
    ? getQrDataUrl(effectiveQrTarget)
        .then((dataUrl) => loadImage(dataUrl))
        .catch(() =>
          effectiveQrTarget === 'donate'
            ? loadImage(CAMPAIGN_CONSTANTS.assets.qrDonate)
            : null,
        )
    : Promise.resolve(null);

  const [
    logoFsv,
    logoKavanahBlack,
    fullSceneImg,
    houseImg,
    secHouseImg,
    charImg,
    secCharImg,
    qrImg,
  ] = await Promise.all([
    loadImage(CAMPAIGN_CONSTANTS.assets.logoFsv),
    loadImage(CAMPAIGN_CONSTANTS.assets.logoKavanahBlackHorizontal),
    slide.fullSceneImage ? loadImage(slide.fullSceneImage) : Promise.resolve(null),
    slide.houseImage ? loadImage(slide.houseImage) : Promise.resolve(null),
    slide.secondaryHouseImage ? loadImage(slide.secondaryHouseImage) : Promise.resolve(null),
    slide.characterImage ? loadImage(slide.characterImage) : Promise.resolve(null),
    slide.secondaryCharacterImage ? loadImage(slide.secondaryCharacterImage) : Promise.resolve(null),
    qrImagePromise,
  ]);

  // 1. BACKGROUND LAYER
  if (isOverlay) {
    // True alpha transparency across the entire center so users can place it over photos/videos
    ctx.clearRect(0, 0, width, height);

    const topScrim = ctx.createLinearGradient(0, 0, 0, height * 0.34);
    topScrim.addColorStop(0, 'rgba(7, 17, 39, 0.92)');
    topScrim.addColorStop(0.65, 'rgba(7, 17, 39, 0.56)');
    topScrim.addColorStop(1, 'rgba(7, 17, 39, 0)');
    ctx.fillStyle = topScrim;
    ctx.fillRect(0, 0, width, height * 0.34);

    const botScrimStart = charImg ? height * 0.64 : height * 0.68;
    const botScrim = ctx.createLinearGradient(0, botScrimStart, 0, height);
    botScrim.addColorStop(0, 'rgba(7, 17, 39, 0)');
    botScrim.addColorStop(0.45, 'rgba(7, 17, 39, 0.72)');
    botScrim.addColorStop(1, 'rgba(7, 17, 39, 0.95)');
    ctx.fillStyle = botScrim;
    ctx.fillRect(0, botScrimStart, width, height - botScrimStart);

    // Subtle top-right superhero cape corner accent without obscuring center
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(width * 0.76, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height * 0.16);
    ctx.closePath();
    ctx.globalAlpha = 0.88;
    ctx.fillStyle = accent.bg;
    ctx.fill();
    ctx.restore();
  } else if (fullSceneImg) {
    drawCoverImage(ctx, fullSceneImg, 0, 0, width, height, 0);

    const topScrim = ctx.createLinearGradient(0, 0, 0, height * 0.52);
    topScrim.addColorStop(0, 'rgba(7, 17, 39, 0.94)');
    topScrim.addColorStop(0.6, 'rgba(7, 17, 39, 0.56)');
    topScrim.addColorStop(1, 'rgba(7, 17, 39, 0)');
    ctx.fillStyle = topScrim;
    ctx.fillRect(0, 0, width, height * 0.52);

    const botScrim = ctx.createLinearGradient(0, height * 0.64, 0, height);
    botScrim.addColorStop(0, 'rgba(7, 17, 39, 0)');
    botScrim.addColorStop(0.55, 'rgba(7, 17, 39, 0.78)');
    botScrim.addColorStop(1, 'rgba(7, 17, 39, 0.96)');
    ctx.fillStyle = botScrim;
    ctx.fillRect(0, height * 0.64, width, height * 0.36);
  } else if (isCortina) {
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0D1E47');
    bgGrad.addColorStop(0.55, '#0B1A3D');
    bgGrad.addColorStop(1, '#071127');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let dx = 28; dx < width; dx += 44) {
      for (let dy = 28; dy < height; dy += 44) {
        ctx.beginPath();
        ctx.arc(dx, dy, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(width * 0.72, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(width * 0.56, height);
    ctx.closePath();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = accent.bg;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(width * 0.95, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(width * 0.86, height);
    ctx.closePath();
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = '#071127';
    ctx.fill();
    ctx.restore();
  } else {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#5BB8F0');
    skyGrad.addColorStop(0.55, '#A9E2FF');
    skyGrad.addColorStop(1, '#FFF6C7');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    const clouds = [
      [130, 310, 82],
      [215, 296, 100],
      [300, 318, 70],
      [880, 340, 88],
      [965, 355, 68],
    ];
    for (const [cx, cy, cr] of clouds) {
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Giant translucent watermark numeral
  if (giantNumber && !fullSceneImg && !isOverlay) {
    ctx.save();
    ctx.font = `800 ${isStory ? 280 : 230}px "Baloo 2", "Fredoka", sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = isCortina
      ? slide.accentColor === 'lime' || slide.accentColor === 'yellow'
        ? 'rgba(11, 26, 61, 0.22)'
        : 'rgba(255, 255, 255, 0.14)'
      : 'rgba(29, 43, 79, 0.08)';
    ctx.fillText(giantNumber, width - 38, height - (isStory ? 290 : 210));
    ctx.restore();
  }

  // Safe zone margins (Instagram Story 9:16 top ~140px, bottom ~175px)
  const padX = 68;
  const topY = isStory ? 132 : 64;
  const bottomMargin = isStory ? 110 : 54;

  // 2. FLOATING WHITE CAPSULE LOCKUP (FSV x Kavanah)
  const capsuleW = 540;
  const capsuleH = 88;
  ctx.save();
  drawRoundedRect(ctx, padX, topY, capsuleW, capsuleH, 44);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  if (!darkSurface) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1D2B4F';
    ctx.stroke();
  }
  ctx.restore();

  if (logoFsv) {
    drawContainedImage(ctx, logoFsv, padX + 26, topY + 14, 218, 60);
  }
  ctx.fillStyle = 'rgba(29, 43, 79, 0.45)';
  ctx.font = '800 30px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('×', padX + 265, topY + capsuleH / 2);
  if (logoKavanahBlack) {
    drawContainedImage(ctx, logoKavanahBlack, padX + 290, topY + 18, 224, 52);
  }

  // Top-right badge ("48H EN VIVO" on transparent overlays, "48 HORAS" on graphics, or "@creator")
  const tagLabel = handle
    ? `@${handle.toUpperCase()}`
    : isOverlay
      ? '48H EN VIVO'
      : '48 HORAS';
  ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
  const tagW = Math.max(176, ctx.measureText(tagLabel).width + 52);
  const tagX = width - padX - tagW;
  const tagY = topY + 14;
  drawRoundedRect(ctx, tagX, tagY, tagW, 60, 30);
  ctx.fillStyle = handle ? '#B5F43D' : accent.bg;
  ctx.fill();
  ctx.fillStyle = handle ? '#0B1A3D' : accent.text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tagLabel, tagX + tagW / 2, tagY + 31);

  // 3. KICKER LINE + HEADLINE + OPTIONAL SUBTITLE
  let cursorY = topY + capsuleH + (isStory ? 54 : 38);

  // Horizontal accent tick + kicker text
  ctx.fillStyle = darkSurface ? accent.bg : '#C62828';
  drawRoundedRect(ctx, padX, cursorY + 11, 44, 6, 3);
  ctx.fill();

  ctx.fillStyle = darkSurface ? accent.light : '#C62828';
  ctx.font = '800 25px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(kickerText, padX + 60, cursorY);

  cursorY += 46;

  // Big Poster Headline
  const headlineSize = isStory ? 74 : isSquare ? 56 : 64;
  ctx.font = `800 ${headlineSize}px "Baloo 2", "Fredoka", sans-serif`;
  ctx.fillStyle = darkSurface ? '#FFFFFF' : '#1D2B4F';
  const headlineLines = wrapText(ctx, headlineText, width - padX * 2).slice(0, 3);
  ctx.save();
  if (darkSurface) {
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
  }
  for (const line of headlineLines) {
    ctx.fillText(line, padX, cursorY);
    cursorY += headlineSize * 1.04;
  }
  ctx.restore();

  if (!fullSceneImg && !isOverlay && bodyText) {
    cursorY += 12;
    const bodySize = isStory ? 32 : isSquare ? 26 : 28;
    ctx.font = `600 ${bodySize}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = darkSurface ? '#DCE7FF' : '#243763';
    const bodyLines = wrapText(ctx, bodyText, width - padX * 2).slice(0, 3);
    for (const line of bodyLines) {
      ctx.fillText(line, padX, cursorY);
      cursorY += bodySize * 1.35;
    }
  }

  cursorY += 22;

  // 4. SPEECH BUBBLE ("modal de habla, así muy caricatura")
  if (speechText && !isOverlay) {
    const bubbleUsedH = drawSpeechBubble(ctx, speechText, padX, cursorY, width - padX * 2 - 40);
    cursorY += bubbleUsedH;
  }

  // 5. DIRECT VISUAL STAGE (NO BOXES AROUND CHARACTERS!)
  const footerHeight = showQr ? 210 : 150;
  const stageBottom = height - bottomMargin - footerHeight;
  const stageH = Math.max(160, stageBottom - cursorY);
  const stageW = width - padX * 2;
  const barReserve = slide.showProgressBar ? 78 : 0;

  if (isOverlay) {
    // Keep center alpha=0 completely open! Place 3D character on bottom-right above QR and speech+cause on bottom-left.
    const qrTopY = height - bottomMargin - 186 - 26;
    const overlayRightBottom = (qrImg ? Math.min(stageBottom, qrTopY - 12) : stageBottom) - barReserve;
    const charW = charImg ? (secCharImg ? (isStory ? 410 : 320) : isStory ? 345 : 255) : 0;
    const charH = charImg ? Math.min(isStory ? 395 : 270, Math.max(170, stageH * 0.44)) : 0;

    if (charImg) {
      const charX = width - padX - charW;
      const charY = overlayRightBottom - charH;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.48)';
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 10;
      if (secCharImg) {
        const singleW = charW * 0.56;
        drawContainedImage(ctx, charImg, charX, charY, singleW, charH, true);
        drawContainedImage(ctx, secCharImg, charX + charW - singleW, charY, singleW, charH, true);
      } else {
        drawContainedImage(ctx, charImg, charX, charY, charW, charH, true);
      }
      ctx.restore();
    }

    const leftMaxW = charImg
      ? stageW - charW - 28
      : qrImg
        ? stageW - 216
        : stageW;

    let bodyTopY = stageBottom - barReserve - 16;

    if (bodyText) {
      ctx.save();
      const bodySize = isStory ? 25 : 22;
      const lineH = isStory ? 33 : 29;
      ctx.font = `700 ${bodySize}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = 'rgba(0,0,0,0.75)';
      ctx.shadowBlur = 8;
      const causeLines = wrapText(ctx, bodyText, leftMaxW).slice(0, 3);
      const lastBaseline = stageBottom - barReserve - 14;
      const firstBaseline = lastBaseline - (causeLines.length - 1) * lineH;
      bodyTopY = firstBaseline - bodySize;
      causeLines.forEach((line, idx) => {
        ctx.fillText(line, padX, firstBaseline + idx * lineH);
      });
      ctx.restore();
    }

    if (speechText) {
      const bubbleOpts = {
        fontSize: isStory ? 25 : 21,
        padX: 26,
        padY: 18,
        lineHeight: isStory ? 33 : 28,
        tailAlignRight: Boolean(charImg),
      };
      const bubbleMaxW = Math.max(280, leftMaxW);
      const neededH = drawSpeechBubble(ctx, speechText, padX, 0, bubbleMaxW, {
        ...bubbleOpts,
        measureOnly: true,
      });
      const speechY = Math.max(cursorY + 20, bodyTopY - neededH - 18);
      drawSpeechBubble(ctx, speechText, padX, speechY, bubbleMaxW, bubbleOpts);
    }

    if (slide.showProgressBar) {
      const pct = progressPct;
      const barY = stageBottom - 54;
      drawRoundedRect(ctx, padX, barY, stageW, 44, 22);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#1D2B4F';
      ctx.stroke();

      drawRoundedRect(ctx, padX + 4, barY + 4, ((stageW - 8) * pct) / 100, 36, 18);
      ctx.fillStyle = '#4CAF50';
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(`${pct}% CONSTRUIDO`, padX + 24, barY + 23);

      ctx.fillStyle = '#1D2B4F';
      ctx.textAlign = 'right';
      ctx.fillText('META: $250M COP', padX + stageW - 24, barY + 23);
      ctx.textAlign = 'left';
    }
  } else if (!fullSceneImg) {
    if (houseImg && secHouseImg) {
      const halfW = (stageW - 28) / 2;
      const photoH = stageH - barReserve - 16;
      drawCoverImage(ctx, houseImg, padX, cursorY, halfW, photoH, 28);
      drawCoverImage(ctx, secHouseImg, padX + halfW + 28, cursorY, halfW, photoH, 28);

      // Clean borders on photography
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#1D2B4F';
      drawRoundedRect(ctx, padX, cursorY, halfW, photoH, 28);
      ctx.stroke();
      drawRoundedRect(ctx, padX + halfW + 28, cursorY, halfW, photoH, 28);
      ctx.stroke();

      // Corner corner tags
      drawRoundedRect(ctx, padX + 18, cursorY + 18, 178, 44, 12);
      ctx.fillStyle = '#FFD400';
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1D2B4F';
      ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`HOY · ${progressPct}%`, padX + 107, cursorY + 41);

      drawRoundedRect(ctx, padX + halfW + 46, cursorY + 18, 198, 44, 12);
      ctx.fillStyle = '#4CAF50';
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('META · 100%', padX + halfW + 145, cursorY + 41);
      ctx.textAlign = 'left';
    } else if (houseImg) {
      const photoH = stageH - barReserve - 16;
      drawCoverImage(ctx, houseImg, padX, cursorY, stageW, photoH, 28);
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#1D2B4F';
      drawRoundedRect(ctx, padX, cursorY, stageW, photoH, 28);
      ctx.stroke();

      drawRoundedRect(ctx, padX + 20, cursorY + 20, 240, 46, 12);
      ctx.fillStyle = '#FFD400';
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1D2B4F';
      ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`OBRA REAL · ${progressPct}%`, padX + 140, cursorY + 43);
      ctx.textAlign = 'left';
    } else if (slide.scheduleRows && slide.scheduleRows.length > 0) {
      const rows = slide.scheduleRows;
      const rowGap = 18;
      const rowH = Math.min(136, (stageH - rowGap * (rows.length - 1)) / rows.length);
      rows.forEach((row, idx) => {
        const ry = cursorY + idx * (rowH + rowGap);
        drawRoundedRect(ctx, padX, ry, stageW, rowH, 22);
        ctx.fillStyle = darkSurface ? 'rgba(7, 17, 39, 0.78)' : 'rgba(255, 255, 255, 0.94)';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = darkSurface ? 'rgba(255,255,255,0.24)' : '#1D2B4F';
        ctx.stroke();

        ctx.fillStyle = darkSurface ? '#B5F43D' : '#C62828';
        ctx.font = '800 24px "JetBrains Mono", monospace';
        ctx.textBaseline = 'top';
        ctx.fillText(row.time, padX + 26, ry + 20);

        ctx.fillStyle = darkSurface ? '#FFD400' : '#46557A';
        ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(row.host, padX + stageW - 26, ry + 20);
        ctx.textAlign = 'left';

        ctx.fillStyle = darkSurface ? '#FFFFFF' : '#1D2B4F';
        ctx.font = '800 30px "Baloo 2", sans-serif';
        const resolvedTitle = resolveDynamicTokens(row.title, tokens);
        ctx.fillText(resolvedTitle.slice(0, 48), padX + 26, ry + 56);
      });
    } else if (slide.tierRows && slide.tierRows.length > 0) {
      const rows = slide.tierRows;
      const listW = charImg ? stageW * 0.62 : stageW;
      const rowGap = 18;
      const rowH = Math.min(124, (stageH - rowGap * (rows.length - 1)) / rows.length);
      const startListY = cursorY + Math.max(0, (stageH - (rows.length * rowH + (rows.length - 1) * rowGap)) / 2);

      rows.forEach((tier, idx) => {
        const ry = startListY + idx * (rowH + rowGap);
        drawRoundedRect(ctx, padX, ry, listW, rowH, 22);
        ctx.fillStyle = darkSurface ? 'rgba(7, 17, 39, 0.78)' : 'rgba(255, 255, 255, 0.94)';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = darkSurface ? 'rgba(255,255,255,0.24)' : '#1D2B4F';
        ctx.stroke();

        ctx.fillStyle = darkSurface ? '#FFFFFF' : '#1D2B4F';
        ctx.font = '800 25px "Plus Jakarta Sans", sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(tier.label, padX + 24, ry + 22);

        ctx.fillStyle = darkSurface ? '#B5F43D' : '#46557A';
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(tier.note, padX + 24, ry + 58);

        ctx.fillStyle = darkSurface ? '#FFD400' : '#C62828';
        ctx.font = '800 34px "Baloo 2", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(tier.amount, padX + listW - 24, ry + rowH / 2);
        ctx.textAlign = 'left';
      });

      if (charImg) {
        drawContainedImage(ctx, charImg, padX + listW + 18, cursorY, stageW - listW - 18, stageH, true);
      }
    } else if (charImg && secCharImg) {
      const halfW = (stageW - 16) / 2;
      drawContainedImage(ctx, charImg, padX, cursorY, halfW, stageH - barReserve, true);
      drawContainedImage(ctx, secCharImg, padX + halfW + 16, cursorY, halfW, stageH - barReserve, true);
    } else if (charImg) {
      // Soft radial spotlight directly on canvas, NO rectangular frame!
      const glow = ctx.createRadialGradient(
        width / 2,
        cursorY + stageH * 0.55,
        20,
        width / 2,
        cursorY + stageH * 0.55,
        stageH * 0.55,
      );
      glow.addColorStop(0, darkSurface ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.68)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(padX, cursorY, stageW, stageH);

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 12;
      drawContainedImage(ctx, charImg, padX, cursorY, stageW, stageH - barReserve, true);
      ctx.restore();
    }

    if (slide.showProgressBar) {
      const pct = progressPct;
      const barY = stageBottom - 54;
      drawRoundedRect(ctx, padX, barY, stageW, 44, 22);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#1D2B4F';
      ctx.stroke();

      drawRoundedRect(ctx, padX + 4, barY + 4, ((stageW - 8) * pct) / 100, 36, 18);
      ctx.fillStyle = '#4CAF50';
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(`${pct}% CONSTRUIDO`, padX + 24, barY + 23);

      ctx.fillStyle = '#1D2B4F';
      ctx.textAlign = 'right';
      ctx.fillText('META: $250M COP', padX + stageW - 24, barY + 23);
      ctx.textAlign = 'left';
    }
  }

  // 6. CLEAN EDITORIAL FOOTER + QR CARD (NO FAKE BUTTONS!)
  const footerBaseY = height - bottomMargin;
  const qrBoxSize = 186;

  if (qrImg) {
    const qrX = width - padX - qrBoxSize;
    const qrY = footerBaseY - qrBoxSize - 26;
    drawRoundedRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize + 34, 24);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = effectiveQrTarget === 'live' ? '#E6009E' : '#1D2B4F';
    ctx.stroke();
    ctx.drawImage(qrImg, qrX + 14, qrY + 14, qrBoxSize - 28, qrBoxSize - 28);

    ctx.fillStyle = effectiveQrTarget === 'live' ? '#B8007E' : '#1D2B4F';
    ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(qrMeta.boxCaption, qrX + qrBoxSize / 2, qrY + qrBoxSize + 14);
  }

  const textMaxW = qrImg ? stageW - qrBoxSize - 30 : stageW;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';

  ctx.fillStyle = darkSurface ? '#B5F43D' : '#C62828';
  ctx.font = '800 23px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(urlLabel, padX, footerBaseY - 98, textMaxW);

  ctx.fillStyle = darkSurface ? '#FFFFFF' : '#1D2B4F';
  ctx.font = `800 ${qrImg ? (isStory ? 38 : 34) : isStory ? 44 : 38}px "Baloo 2", sans-serif`;
  ctx.fillText(urlText, padX, footerBaseY - 46, textMaxW);

  ctx.fillStyle = darkSurface ? 'rgba(255,255,255,0.75)' : '#46557A';
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    'Fundación Segundos de Vida · NIT 900.649.809-2 · #PonteLaCapa',
    padX,
    footerBaseY - 8,
    textMaxW,
  );

  return canvas.toDataURL('image/png');
}

export async function downloadAdPng(options: ExportOptions, filename: string): Promise<void> {
  const dataUrl = await renderAdToDataUrl(options);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
