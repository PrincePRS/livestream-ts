import { PauseIcon, PlayIcon } from "@100mslive/react-icons";
import { IconButton, Tooltip } from "@100mslive/react-ui";
import React from "react";

interface PlayButtonProps {
  onClick: () => void;
  isPaused: boolean;
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  onClick,
  isPaused,
}) => {
  return (
    <Tooltip title={`${isPaused ? "Play" : "Pause"}`} side="top">
      <IconButton onClick={onClick} data-testid="play_pause_btn">
        {isPaused ? (
          <PlayIcon width={32} height={32} />
        ) : (
          <PauseIcon width={32} height={32} />
        )}
      </IconButton>
    </Tooltip>
  );
};
