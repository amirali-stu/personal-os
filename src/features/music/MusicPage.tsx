// MusicPage.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../../app/store/settingsStore";
import { formatNumber } from "../../shared/utils/formatters";
import { CreatePlaylistModal } from "./components/CreatePlaylistModal";
import { DeletePlaylistModal } from "./components/DeletePlaylistModal";
import { EditPlaylistModal } from "./components/EditPlaylistModal";
import { MusicHeader } from "./components/MusicHeader";
import { PlaylistCard } from "./components/PlaylistCard";
import { PlaylistView } from "./components/PlaylistView";
import { useMusicLibrary } from "./hooks/useMusicLibrary";

export function MusicPage() {
  const { t } = useTranslation();

  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  const {
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
  } = useMusicLibrary();

  const [dragPlaylistId, setDragPlaylistId] = useState<number | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null,
  );
  const [playlistToEdit, setPlaylistToEdit] = useState<number | null>(null);
  const [playlistToDelete, setPlaylistToDelete] = useState<number | null>(null);
  const [savingPlaylist, setSavingPlaylist] = useState(false);
  const [deletingPlaylist, setDeletingPlaylist] = useState(false);

  const text = (key: string, fa: string, en: string) =>
    t(key, { defaultValue: isRtl ? fa : en });

  const selectedPlaylist = useMemo(
    () =>
      playlists.find((playlist) => playlist.id === selectedPlaylistId) ?? null,
    [playlists, selectedPlaylistId],
  );

  const editPlaylist = useMemo(
    () => playlists.find((playlist) => playlist.id === playlistToEdit) ?? null,
    [playlists, playlistToEdit],
  );

  const deleteTargetPlaylist = useMemo(
    () =>
      playlists.find((playlist) => playlist.id === playlistToDelete) ?? null,
    [playlists, playlistToDelete],
  );

  const selectedTracks = useMemo(
    () =>
      tracks
        .filter((track) => track.playlistId === selectedPlaylistId)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [tracks, selectedPlaylistId],
  );

  const sortedPlaylists = useMemo(
    () => [...playlists].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [playlists],
  );

  function handlePlaylistDragStart(id: number) {
    setDragPlaylistId(id);
  }

  function handlePlaylistDragOver(e: React.DragEvent, overId: number) {
    e.preventDefault();
    if (dragPlaylistId == null || dragPlaylistId === overId) return;
    const ids = sortedPlaylists.map((p) => p.id!).filter(Boolean);
    const from = ids.indexOf(dragPlaylistId);
    const to = ids.indexOf(overId);
    if (from < 0 || to < 0) return;
    const next = [...ids];
    next.splice(from, 1);
    next.splice(to, 0, dragPlaylistId);
    void reorderPlaylists(next);
  }

  function handlePlaylistDragEnd() {
    setDragPlaylistId(null);
  }

  async function handleUpdatePlaylist(name: string) {
    if (!playlistToEdit) {
      return;
    }

    setSavingPlaylist(true);

    try {
      await updatePlaylist(playlistToEdit, name);
      setPlaylistToEdit(null);
    } finally {
      setSavingPlaylist(false);
    }
  }

  async function handleDeletePlaylist() {
    if (!playlistToDelete) {
      return;
    }

    setDeletingPlaylist(true);

    try {
      await deletePlaylist(playlistToDelete);
      setPlaylistToDelete(null);

      if (selectedPlaylistId === playlistToDelete) {
        setSelectedPlaylistId(null);
      }
    } finally {
      setDeletingPlaylist(false);
    }
  }

  function getTrackCount(playlistId: number) {
    return tracks.filter((track) => track.playlistId === playlistId).length;
  }

  if (selectedPlaylist) {
    return (
      <div dir={isRtl ? "rtl" : "ltr"}>
        <PlaylistView
          playlist={selectedPlaylist}
          tracks={selectedTracks}
          onBack={() => setSelectedPlaylistId(null)}
          onAddTrack={addTrack}
          onDeleteTrack={deleteTrack}
          onReorderTracks={(ids) =>
            void reorderTracks(selectedPlaylist.id!, ids)
          }
        />
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <MusicHeader onCreatePlaylist={() => setShowCreateModal(true)} />

      {loading ? (
        <div className="py-20 text-center text-xs text-[var(--color-text-muted)]">
          {text(
            "music.loading",
            "در حال بارگذاری کتابخانه...",
            "Loading library...",
          )}
        </div>
      ) : playlists.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-20 text-center">
          <p className="text-sm font-bold text-white">
            {text(
              "music.emptyTitle",
              "هنوز لیستی ساخته نشده",
              "No playlists yet",
            )}
          </p>

          <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
            {text(
              "music.emptyDescription",
              "اولین لیست موسیقی خودت را بساز",
              "Create your first music playlist",
            )}
          </p>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="mt-5 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-xs font-bold text-white hover:bg-[var(--color-primary-hover)]"
          >
            {text(
              "music.createFirst",
              "ساخت اولین لیست",
              "Create your first playlist",
            )}
          </button>
        </div>
      ) : (
        <section>
          <div className="mb-4">
            <h2 className="text-start text-sm font-bold text-white">
              {text("music.libraryTitle", "کتابخانه من", "My Library")}
            </h2>

            <p className="mt-1 text-start text-[11px] text-[var(--color-text-muted)]">
              {formatNumber(playlists.length, language)}{" "}
              {text("music.playlists", "لیست موسیقی", "playlists")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                draggable
                onDragStart={() => handlePlaylistDragStart(playlist.id!)}
                onDragOver={(e) => handlePlaylistDragOver(e, playlist.id!)}
                onDragEnd={handlePlaylistDragEnd}
                className={`transition-all duration-300 ease-out ${
                  dragPlaylistId === playlist.id
                    ? "scale-[0.97] opacity-50"
                    : dragPlaylistId != null
                      ? "scale-[1.01]"
                      : ""
                }`}
              >
              <PlaylistCard
                playlist={playlist}
                trackCount={getTrackCount(playlist.id!)}
                onOpen={() => setSelectedPlaylistId(playlist.id!)}
                onEdit={() => setPlaylistToEdit(playlist.id!)}
                onDelete={() => setPlaylistToDelete(playlist.id!)}
                isDragging={dragPlaylistId === playlist.id}
              />
              </div>
            ))}
          </div>
        </section>
      )}

      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (name) => {
            await createPlaylist(name);
            setShowCreateModal(false);
          }}
        />
      )}

      {editPlaylist && (
        <EditPlaylistModal
          currentName={editPlaylist.name}
          saving={savingPlaylist}
          onClose={() => {
            if (!savingPlaylist) {
              setPlaylistToEdit(null);
            }
          }}
          onSave={handleUpdatePlaylist}
        />
      )}

      {deleteTargetPlaylist && (
        <DeletePlaylistModal
          playlistName={deleteTargetPlaylist.name}
          trackCount={getTrackCount(deleteTargetPlaylist.id!)}
          deleting={deletingPlaylist}
          onClose={() => {
            if (!deletingPlaylist) {
              setPlaylistToDelete(null);
            }
          }}
          onConfirm={handleDeletePlaylist}
        />
      )}
    </div>
  );
}
