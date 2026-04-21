/**
 * Bir ISO tarihini "X dakika önce", "Dün", "3 gün önce" gibi
 * okunabilir bir Türkçe metne çevirir.
 */
export function formatRelativeDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Az önce';
  if (diffMinutes < 60) return `${diffMinutes} dk önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays === 1) return 'Dün';
  if (diffDays < 7) return `${diffDays} gün önce`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
  return `${Math.floor(diffDays / 30)} ay önce`;
}

export function formatMessageTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  if (diffDays === 0) return `${hh}:${mm}`;
  if (diffDays === 1) return `Dün ${hh}:${mm}`;
  return formatRelativeDate(isoDate);
}

/**
 * Bir bitiş tarihini "3 gün kaldı", "Süresi doldu" gibi
 * okunabilir bir Türkçe metne çevirir.
 */
export function formatExpiresAt(expiresAt: string | null | undefined): string {
  if (!expiresAt) return 'Süresiz';
  const date = new Date(expiresAt);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Süresi doldu';
  if (diffDays === 1) return '1 gün kaldı';
  if (diffDays <= 7) return `${diffDays} gün kaldı`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} hafta kaldı`;
  return `${Math.floor(diffDays / 30)} ay kaldı`;
}
