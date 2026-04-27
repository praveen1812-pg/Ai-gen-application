/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  cover: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber City',
    artist: 'Neon Vibe',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    cover: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Midnight Drive',
    artist: 'Retro Runner',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Data Stream',
    artist: 'Digital Ghost',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 312,
    cover: 'https://images.unsplash.com/photo-1510519133418-241088789578?q=80&w=2070&auto=format&fit=crop',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = { x: 0, y: -1 };
export const GAME_SPEED = 150;
