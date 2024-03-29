import { useCallback } from "react";
import {
  selectAppData,
  selectAppDataByPath,
  selectTrackByID,
  useHMSActions,
  useHMSStore,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import {
  UserPreferencesKeys,
  useUserPreferences,
} from "../hooks/useUserPreferences";
import { APP_DATA, UI_SETTINGS } from "../../common/constants";

/**
 * fields saved related to UI settings in store's app data can be
 * accessed using this hook. key is optional if not passed
 * the whole UI settings object is returned. Usage -
 * 1. val = useUiSettings("isAudioOnly");
 *    console.log(val); // false
 * 2. val = useUISettings();
 *    console.log(val); // {isAudioOnly: false}
 * @param {string | undefined} uiSettingKey
 */
export const useUISettings = (uiSettingKey?: string) => {
  const uiSettings = useHMSStore(
    selectAppDataByPath(APP_DATA.uiSettings, uiSettingKey ?? "")
  );
  return uiSettings;
};

type SetValue = React.Dispatch<React.SetStateAction<any>>; // Define the type for setValue

type UseSetUiSettingsResult = [any, SetValue];

/**
 * fields saved related to UI settings in store's app data can be
 * accessed using this hook. key is optional if not passed
 * the whole UI settings object is returned. Usage -
 * [val, setVal] = useUiSettings("isAudioOnly");
 * console.log(val); // false
 * setVal(true);
 * @param {string} uiSettingKey
 */
export const useSetUiSettings = (
  uiSettingKey: string = ""
): UseSetUiSettingsResult => {
  const value = useUISettings(uiSettingKey);
  const setValue = useSetAppData({
    key1: APP_DATA.uiSettings,
    key2: uiSettingKey,
  });
  return [value, setValue];
};

export const useIsHeadless = () => {
  const isHeadless = useUISettings(UI_SETTINGS.isHeadless);
  return isHeadless;
};

export const useHLSViewerRole = () => {
  return useHMSStore(selectAppData(APP_DATA.hlsViewerRole));
};

export const useWaitingViewerRole = () => {
  return useHMSStore(selectAppData(APP_DATA.waitingViewerRole));
};
export const useIsHLSStartedFromUI = () => {
  return useHMSStore(selectAppData(APP_DATA.hlsStarted));
};

export const useIsRTMPStartedFromUI = () => {
  return useHMSStore(selectAppData(APP_DATA.rtmpStarted));
};

export const useTokenEndpoint = () => {
  return useHMSStore(selectAppData(APP_DATA.tokenEndpoint));
};

export const useLogo = () => {
  return useHMSStore(selectAppData(APP_DATA.logo));
};

export const useUrlToEmbed = () => {
  return useHMSStore(selectAppData(APP_DATA.embedConfig))?.url;
};

export const usePinnedTrack = () => {
  const pinnedTrackId = useHMSStore(selectAppData(APP_DATA.pinnedTrackId));
  return useHMSStore(selectTrackByID(pinnedTrackId));
};

export const useSubscribedNotifications = (notificationKey: string = "") => {
  const notificationPreference = useHMSStore(
    selectAppDataByPath(APP_DATA.subscribedNotifications, notificationKey)
  );
  return notificationPreference;
};

export const useSetSubscribedNotifications = (
  notificationKey: string
): UseSetUiSettingsResult => {
  const value = useSubscribedNotifications(notificationKey);
  const setValue = useSetAppData({
    key1: APP_DATA.subscribedNotifications,
    key2: notificationKey,
  });
  return [value, setValue];
};

export const useSubscribeChatSelector = (chatSelectorKey: string) => {
  const chatSelectorPreference = useHMSStore(
    selectAppDataByPath(APP_DATA.chatSelector, chatSelectorKey)
  );
  return chatSelectorPreference;
};

export const useSetSubscribedChatSelector = (
  chatSelectorKey: string
): UseSetUiSettingsResult => {
  const value = useSubscribeChatSelector(chatSelectorKey);
  const setValue = useSetAppData({
    key1: APP_DATA.chatSelector,
    key2: chatSelectorKey,
  });
  return [value, setValue];
};

export const useSetAppDataByKey = (
  appDataKey: string
): UseSetUiSettingsResult => {
  const value = useHMSStore(selectAppData(appDataKey));
  const actions = useHMSActions();
  const setValue = useCallback(
    (value?: string) => {
      actions.setAppData(appDataKey, value);
    },
    [actions, appDataKey]
  );
  return [value, setValue];
};

const useSetAppData = ({ key1, key2 }: { key1: string; key2: string }) => {
  const actions = useHMSActions();
  const store = useHMSVanillaStore();
  const { preference, changePreference } = useUserPreferences(
    UserPreferencesKeys.UI_SETTINGS
  );
  const setValue = useCallback(
    (value: Record<string | number, any>) => {
      if (!key1) {
        return;
      }
      actions.setAppData(
        key1,
        key2
          ? {
              [key2]: value,
            }
          : value,
        true
      );
      const appData = store.getState(selectAppData());
      changePreference({
        ...appData.uiSettings,
        subscribedNotifications: appData.subscribedNotifications,
      });
    },
    [actions, key1, key2, store, changePreference]
  );
  return setValue;
};
