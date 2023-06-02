import { useEffect } from "react";
import {
  selectAppData,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  useHMSActions,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import { APP_DATA, isMacOS } from "../../common/constants";

let isEvenListenersAttached = false;

export class KeyboardInputManager {
  private actions: any;
  private store: any; // Replace 'any' with the type of your store
  constructor(store: any, actions: any) {
    this.actions = actions;
    this.store = store;
  }

  private toggleAudio = async (): Promise<void> => {
    const enabled = this.store.getState(selectIsLocalAudioEnabled);
    await this.actions({ type: "SET_LOCAL_AUDIO_ENABLED", payload: !enabled });
  };

  private toggleVideo = async (): Promise<void> => {
    const enabled = this.store.getState(selectIsLocalVideoEnabled);
    await this.actions({ type: "SET_LOCAL_VIDEO_ENABLED", payload: !enabled });
  };

  private hideSidepane = (): void => {
    if (this.store.getState(selectAppData(APP_DATA.sidePane))) {
      this.actions({
        type: "SET_APP_DATA",
        payload: { key: APP_DATA.sidePane, value: "" },
      });
    }
  };

  private toggleHlsStats = (): void => {
    this.actions({
      type: "SET_APP_DATA",
      payload: {
        key: APP_DATA.hlsStats,
        value: !this.store.getState(selectAppData(APP_DATA.hlsStats)),
      },
    });
  };

  private keyDownHandler = async (e: KeyboardEvent): Promise<void> => {
    const CONTROL_KEY = isMacOS ? e.metaKey : e.ctrlKey;
    const D_KEY = e.key === "d" || e.key === "D";
    const E_KEY = e.key === "e" || e.key === "E";
    const SNF_KEY = e.key === "]" || e.key === "}";

    const SHORTCUT_TOGGLE_AUDIO = CONTROL_KEY && D_KEY;
    const SHORTCUT_TOGGLE_VIDEO = CONTROL_KEY && E_KEY;
    const SHORTCUT_SIDEPANE_CLOSE = e.key === "Escape";
    const SHORTCUT_STATS_FOR_NERDS = CONTROL_KEY && SNF_KEY;

    if (SHORTCUT_TOGGLE_AUDIO) {
      e.preventDefault();
      await this.toggleAudio();
    } else if (SHORTCUT_TOGGLE_VIDEO) {
      e.preventDefault();
      await this.toggleVideo();
    } else if (SHORTCUT_SIDEPANE_CLOSE) {
      this.hideSidepane();
    } else if (SHORTCUT_STATS_FOR_NERDS) {
      this.toggleHlsStats();
    }
  };

  private bind = (): void => {
    document.addEventListener("keydown", this.keyDownHandler, false);
  };

  private unbind = (): void => {
    document.removeEventListener("keydown", this.keyDownHandler, false);
  };

  public bindAllShortcuts = (): void => {
    if (!isEvenListenersAttached) {
      this.bind();
      isEvenListenersAttached = true;
    }
  };

  public unbindAllShortcuts = (): void => {
    if (isEvenListenersAttached) {
      this.unbind();
      isEvenListenersAttached = false;
    }
  };
}

export const KeyboardHandler = () => {
  const store = useHMSVanillaStore();
  const actions = useHMSActions();

  useEffect(() => {
    const keyboardManager = new KeyboardInputManager(store, actions);
    keyboardManager.bindAllShortcuts();
    return keyboardManager.unbindAllShortcuts;
  }, [actions, store]);
  return null;
};
