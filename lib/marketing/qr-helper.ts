import QRCode from 'qrcode';
import type { QrTarget } from './campaign-kit';

export interface QrTargetMeta {
  id: QrTarget;
  url: string;
  shortUrl: string;
  boxCaption: string;
  buttonLabel: string;
  urlLabelDefault: string;
}

export const QR_TARGET_META: Record<QrTarget, QrTargetMeta> = {
  live: {
    id: 'live',
    url: 'https://supercasa.svgvisual.com/envivo',
    shortUrl: 'supercasa.svgvisual.com/envivo',
    boxCaption: 'MIRA EL EN VIVO',
    buttonLabel: 'QR En Vivo (/envivo)',
    urlLabelDefault: 'MIRA EL EN VIVO EN',
  },
  donate: {
    id: 'donate',
    url: 'https://supercasa.svgvisual.com/donar',
    shortUrl: 'supercasa.svgvisual.com/donar',
    boxCaption: 'ESCANEA Y DONA',
    buttonLabel: 'QR Donar (/donar)',
    urlLabelDefault: 'ESCANEA Y DONA EN',
  },
};

const qrCache = new Map<string, string>();

export function getQrMeta(target: QrTarget): QrTargetMeta {
  return QR_TARGET_META[target];
}

export async function getQrDataUrl(
  target: QrTarget,
  customUrl?: string,
): Promise<string> {
  const url = customUrl?.trim() || QR_TARGET_META[target].url;
  const cacheKey = `${target}::${url}`;
  const cached = qrCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const dataUrl = await QRCode.toDataURL(url, {
    width: 320,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#1D2B4F',
      light: '#FFFFFF',
    },
  });

  qrCache.set(cacheKey, dataUrl);
  return dataUrl;
}
