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
  }
}

export const musicDb = new MusicDatabase();
