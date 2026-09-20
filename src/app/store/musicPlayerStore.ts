import { create } from "zustand";
import type { MusicTrack } from "../../features/music/types";

export type RepeatMode = "off" | "all" | "one";

type MusicPlayerState = {
  queue: MusicTrack[];
  currentIndex: number;
  isPlaying: boolean;

  volume: number;
  isMuted: boolean;

  playbackRate: number;

  isShuffle: boolean;
  repeatMode: RepeatMode;

  currentTrack: MusicTrack | null;

  setQueue: (tracks: MusicTrack[], index?: number) => void;
  setCurrentIndex: (index: number) => void;

  play: () => void;
  pause: () => void;
  togglePlay: () => void;

  next: () => void;
  previous: () => void;

  setVolume: (volume: number) => void;
  toggleMute: () => void;

  setPlaybackRate: (rate: number) => void;

  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;

  clearPlayer: () => void;
};

export const useMusicPlayerStore = create<MusicPlayerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  currentTrack: null,

  isPlaying: false,

  volume: 1,
  isMuted: false,

  playbackRate: 1,

  isShuffle: false,
  repeatMode: "off",

  setQueue: (tracks, index = 0) => {
    if (tracks.length === 0) {
      set({
        queue: [],
        currentIndex: -1,
        currentTrack: null,
        isPlaying: false,
      });

      return;
    }

    const safeIndex = Math.max(0, Math.min(index, tracks.length - 1));

    set({
      queue: tracks,
      currentIndex: safeIndex,
      currentTrack: tracks[safeIndex],
      isPlaying: false,
    });
  },

  setCurrentIndex: (index) => {
    const { queue } = get();

    if (!queue.length) {
      return;
    }

    const safeIndex = Math.max(0, Math.min(index, queue.length - 1));

    set({
      currentIndex: safeIndex,
      currentTrack: queue[safeIndex],
      isPlaying: true,
    });
  },

  play: () => {
    set({ isPlaying: true });
  },

  pause: () => {
    set({ isPlaying: false });
  },

  togglePlay: () => {
    set((state) => ({
      isPlaying: !state.isPlaying,
    }));
  },

  next: () => {
    const { queue, currentIndex, isShuffle, repeatMode } = get();

    if (!queue.length) {
      return;
    }

    if (isShuffle && queue.length > 1) {
      let nextIndex = currentIndex;

      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * queue.length);
      }

      set({
        currentIndex: nextIndex,
        currentTrack: queue[nextIndex],
        isPlaying: true,
      });

      return;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      set({
        currentIndex: nextIndex,
        currentTrack: queue[nextIndex],
        isPlaying: true,
      });

      return;
    }

    if (repeatMode === "all") {
      set({
        currentIndex: 0,
        currentTrack: queue[0],
        isPlaying: true,
      });

      return;
    }

    set({
      isPlaying: false,
    });
  },

  previous: () => {
    const { queue, currentIndex } = get();

    if (!queue.length) {
      return;
    }

    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;

      set({
        currentIndex: previousIndex,
        currentTrack: queue[previousIndex],
        isPlaying: true,
      });

      return;
    }

    set({
      currentIndex: queue.length - 1,
      currentTrack: queue[queue.length - 1],
      isPlaying: true,
    });
  },

  setVolume: (volume) => {
    const safeVolume = Math.max(0, Math.min(1, volume));

    set({
      volume: safeVolume,
      isMuted: safeVolume === 0,
    });
  },

  toggleMute: () => {
    set((state) => ({
      isMuted: !state.isMuted,
    }));
  },

  setPlaybackRate: (rate) => {
    set({
      playbackRate: rate,
    });
  },

  toggleShuffle: () => {
    set((state) => ({
      isShuffle: !state.isShuffle,
    }));
  },

  setRepeatMode: (mode) => {
    set({
      repeatMode: mode,
    });
  },

  clearPlayer: () => {
    set({
      queue: [],
      currentIndex: -1,
      currentTrack: null,
      isPlaying: false,
    });
  },
}));
