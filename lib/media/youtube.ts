/**
 * Sample media used while a museum has no official video yet.
 *
 * This is a third-party public video, kept only as a layout demonstration; it is
 * labelled as a sample in the UI and is not an ISA production.
 */
export const SAMPLE_VIDEO = {
  id: 'rGMWF3EZlPw',
  title: 'U 995',
  author: 'Wopy Animationen',
  authorUrl: 'https://www.youtube.com/@wopyanimationen8367',
} as const;

/** Extracts a YouTube id from watch, youtu.be, shorts and embed URLs. */
export function youtubeId(url: string): string | null {
  if (!url) {
    return null;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);

    if (match) {
      return match[1];
    }
  }

  return null;
}
