import { create } from "zustand";

type Mode = "focus" | "break";

export const FOCUS_SECONDS = 25 * 60;
export const BREAK_SECONDS = 5 * 60;

type FocusState = {
  mode: Mode;
  secondsLeft: number;
  running: boolean;
  sessions: number;
  toggle: () => void;
  reset: () => void;
};

let intervalId: number | null = null;

function clearTimer() {
  if (intervalId != null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
}

function startTimer(tick: () => void) {
  clearTimer();
  intervalId = window.setInterval(tick, 1000);
}

export const useFocusStore = create<FocusState>((set, get) => ({
  mode: "focus",
  secondsLeft: FOCUS_SECONDS,
  running: false,
  sessions: 0,

  toggle: () => {
    const { running } = get();

    if (running) {
      clearTimer();
      set({ running: false });
      return;
    }

    set({ running: true });

    startTimer(() => {
      const state = get();
      if (!state.running) {
        clearTimer();
        return;
      }

      if (state.secondsLeft <= 1) {
        clearTimer();
        if (state.mode === "focus") {
          set({
            running: false,
            mode: "break",
            secondsLeft: BREAK_SECONDS,
            sessions: state.sessions + 1,
          });
        } else {
          set({
            running: false,
            mode: "focus",
            secondsLeft: FOCUS_SECONDS,
          });
        }
        return;
      }

      set({ secondsLeft: state.secondsLeft - 1 });
    });
  },

  reset: () => {
    clearTimer();
    set({
      mode: "focus",
      secondsLeft: FOCUS_SECONDS,
      running: false,
    });
  },
}));
