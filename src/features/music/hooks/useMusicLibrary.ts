import { useCallback, useEffect, useState } from "react";
import { musicDb } from "../db/musicDb";
import type { MusicPlaylist, MusicTrack } from "../types";

export function useMusicLibrary() {
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const [playlistData, trackData] = await Promise.all([
        musicDb.playlists.orderBy("sortOrder").toArray(),
        musicDb.tracks.orderBy("sortOrder").toArray(),
      ]);

      setPlaylists(
        playlistData.map((p) => ({
          ...p,
          sortOrder: p.sortOrder ?? p.createdAt,
        })),
      );
      setTracks(
        trackData.map((t) => ({
          ...t,
          sortOrder: t.sortOrder ?? t.createdAt,
        })),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createPlaylist(name: string) {
    const cleanName = name.trim();
    if (!cleanName) return;

    const now = Date.now();
    const playlist: MusicPlaylist = {
      name: cleanName,
      sortOrder: now,
      createdAt: now,
    };

    const id = await musicDb.playlists.add(playlist);

    setPlaylists((current) => [...current, { ...playlist, id }]);
  }

  async function updatePlaylist(id: number, name: string) {
    const cleanName = name.trim();
    if (!cleanName) return;

    await musicDb.playlists.update(id, { name: cleanName });

    setPlaylists((current) =>
      current.map((playlist) =>
        playlist.id === id ? { ...playlist, name: cleanName } : playlist,
      ),
    );
  }

  async function deletePlaylist(id: number) {
    await musicDb.transaction(
      "rw",
      musicDb.playlists,
      musicDb.tracks,
      async () => {
        await musicDb.tracks.where("playlistId").equals(id).delete();
        await musicDb.playlists.delete(id);
      },
    );

    setPlaylists((current) => current.filter((playlist) => playlist.id !== id));
    setTracks((current) => current.filter((track) => track.playlistId !== id));
  }

  async function addTrack(
    track: Omit<MusicTrack, "id" | "createdAt" | "sortOrder"> & {
      sortOrder?: number;
    },
  ) {
    const now = Date.now();
    const newTrack: MusicTrack = {
      ...track,
      sortOrder: track.sortOrder ?? now,
      createdAt: now,
    };

    const id = await musicDb.tracks.add(newTrack);

    setTracks((current) => [...current, { ...newTrack, id }]);
  }

  async function deleteTrack(id: number) {
    await musicDb.tracks.delete(id);
    setTracks((current) => current.filter((track) => track.id !== id));
  }

  async function reorderPlaylists(orderedIds: number[]) {
    await Promise.all(
      orderedIds.map((id, index) =>
        musicDb.playlists.update(id, { sortOrder: index + 1 }),
      ),
    );

    setPlaylists((current) => {
      const map = new Map(current.map((p) => [p.id!, p]));
      return orderedIds
        .map((id, index) => {
          const p = map.get(id);
          if (!p) return null;
          return { ...p, sortOrder: index + 1 };
        })
        .filter(Boolean) as MusicPlaylist[];
    });
  }

  async function reorderTracks(playlistId: number, orderedIds: number[]) {
    await Promise.all(
      orderedIds.map((id, index) =>
        musicDb.tracks.update(id, { sortOrder: index + 1 }),
      ),
    );

    setTracks((current) => {
      const others = current.filter((t) => t.playlistId !== playlistId);
      const map = new Map(
        current.filter((t) => t.playlistId === playlistId).map((t) => [t.id!, t]),
      );
      const reordered = orderedIds
        .map((id, index) => {
          const t = map.get(id);
          if (!t) return null;
          return { ...t, sortOrder: index + 1 };
        })
        .filter(Boolean) as MusicTrack[];
      return [...others, ...reordered];
    });
  }

  return {
    playlists,
    tracks,
    loading,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrack,
    deleteTrack,
    reorderPlaylists,
    reorderTracks,
    reload: load,
  };
}
