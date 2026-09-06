export type MusicPlaylist = {
  id?: number;
  name: string;
  createdAt: number;
};

export type MusicTrack = {
  id?: number;
  playlistId: number;
  title: string;
  artist: string;
  duration: number;
  sourceType: "file" | "url";
  audioBlob?: Blob;
  audioUrl?: string;
  createdAt: number;
};
