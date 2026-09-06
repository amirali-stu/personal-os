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
        musicDb.playlists.orderBy("createdAt").reverse().toArray(),

        musicDb.tracks.orderBy("createdAt").reverse().toArray(),
      ]);

      setPlaylists(playlistData);
      setTracks(trackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createPlaylist(name: string) {
    const cleanName = name.trim();

    if (!cleanName) {
      return;
    }

    const playlist: MusicPlaylist = {
      name: cleanName,
      createdAt: Date.now(),
    };

    const id = await musicDb.playlists.add(playlist);

    setPlaylists((current) => [
      {
        ...playlist,
        id,
      },
      ...current,
    ]);
  }

  async function updatePlaylist(id: number, name: string) {
    const cleanName = name.trim();

    if (!cleanName) {
      return;
    }

    await musicDb.playlists.update(id, {
      name: cleanName,
    });

    setPlaylists((current) =>
      current.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              name: cleanName,
            }
          : playlist,
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

  async function addTrack(track: Omit<MusicTrack, "id" | "createdAt">) {
    const newTrack: MusicTrack = {
      ...track,
      createdAt: Date.now(),
    };

    const id = await musicDb.tracks.add(newTrack);

    setTracks((current) => [
      {
        ...newTrack,
        id,
      },
      ...current,
    ]);
  }

  async function deleteTrack(id: number) {
    await musicDb.tracks.delete(id);

    setTracks((current) => current.filter((track) => track.id !== id));
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
    reload: load,
  };
}
