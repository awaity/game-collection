import { buildMini } from '@game-collection/build-tools/mini';
import { NOTES, wav } from '../src/platform/audio';
import type { Sound } from '../src/core/game';
await buildMini({ slug: 'garden-guard', title: '花园守卫', audio: Object.fromEntries((Object.keys(NOTES) as Sound[]).map(sound => [sound, wav(sound)])) });
