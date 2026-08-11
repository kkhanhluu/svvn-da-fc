import { createLucideIcon } from 'lucide-react';

/**
 * lucide-react only ships its stable set; this one lives in "Lucide Lab"
 * (https://lucide.dev/icons/lab/soccer-ball), a separate package built for a
 * much newer lucide-react than this project is on. Pulling in that package
 * would mean a major-version bump just for one glyph, so the icon node is
 * copied here instead and built with lucide's own icon factory — same
 * component API (size, className, strokeWidth, ...) as every other icon.
 */
export const SoccerBall = createLucideIcon('SoccerBall', [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  [
    'path',
    {
      d: 'M11.9 6.7s-3 1.3-5 3.6c0 0 0 3.6 1.9 5.9 0 0 3.1.7 6.2 0 0 0 1.9-2.3 1.9-5.9 0 .1-2-2.3-5-3.6',
      key: '1mg18b',
    },
  ],
  ['path', { d: 'M11.9 6.7V2', key: '1t12cm' }],
  ['path', { d: 'M16.9 10.4s3-1.4 4.5-1.6', key: '8aq2q9' }],
  ['path', { d: 'M15 16.3s1.9 2.7 2.9 3.7', key: 'volqrc' }],
  ['path', { d: 'M8.8 16.3S6.9 19 6 20', key: '1atvv1' }],
  ['path', { d: 'M2.6 8.7C4 9 7 10.4 7 10.4', key: '1uixp3' }],
]);
