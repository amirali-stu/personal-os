import Dexie, { type Table } from "dexie";
import type { MusicPlaylist, MusicTrack } from "../types";

class MusicDatabase extends Dexie {
  playlists!: Table<MusicPlaylist, number>;
  tracks!: Table<MusicTrack, number>;

  constructor() {
    super("personal-os-music");

    this.version(1).stores({
      playlists: "++id, name, createdAt",
      tracks: "++id, playlistId, createdAt",
    });

    this.version(2)
      .stores({
        playlists: "++id, name, sortOrder, createdAt",
        tracks: "++id, playlistId, sortOrder, createdAt",
      })
      .upgrade(async (tx) => {
        await tx
          .table("playlists")
          .toCollection()
          .modify((p: MusicPlaylist) => {
            if (p.sortOrder == null) p.sortOrder = p.createdAt ?? Date.now();
          });
        await tx
          .table("tracks")
          .toCollection()
          .modify((t: MusicTrack) => {
            if (t.sortOrder == null) t.sortOrder = t.createdAt ?? Date.now();
          });
      });
  }
}

export const musicDb = new MusicDatabase();
