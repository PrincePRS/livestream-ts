import { useEffect, useState } from "react";
import { HMSHLSPlayerEvents, HMSHLSPlayer } from "@100mslive/hls-player";
import { Text } from "@100mslive/react-ui";
import { getDurationFromSeconds } from "./HMSVIdeoUtils";

interface VideoTimeProps {
  hlsPlayer: HMSHLSPlayer;
}

export const VideoTime: React.FC<VideoTimeProps> = ({ hlsPlayer }) => {
  const [videoTime, setVideoTime] = useState("");

  useEffect(() => {
    const timeupdateHandler = (currentTime: number) =>
      setVideoTime(getDurationFromSeconds(currentTime));
    if (hlsPlayer) {
      hlsPlayer.on(HMSHLSPlayerEvents.CURRENT_TIME, timeupdateHandler);
    }
    return function cleanup() {
      if (hlsPlayer) {
        hlsPlayer.off(HMSHLSPlayerEvents.CURRENT_TIME, timeupdateHandler);
      }
    };
  }, [hlsPlayer]);

  return hlsPlayer ? (
    <Text
      css={{
        minWidth: "$16",
      }}
      variant={{
        "@sm": "xs",
      }}
    >{`${videoTime}`}</Text>
  ) : null;
};
