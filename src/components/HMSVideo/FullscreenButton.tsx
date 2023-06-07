import { FC, ReactNode } from "react";
import { Flex, IconButton, Tooltip } from "@100mslive/react-ui";

interface FullScreenButtonProps {
  isFullScreen: boolean;
  icon: ReactNode;
  onToggle: () => void;
}

export const FullScreenButton: FC<FullScreenButtonProps> = ({
  isFullScreen,
  icon,
  onToggle,
}) => {
  return (
    <Tooltip title={`${isFullScreen ? "Exit" : "Go"} fullscreen`} side="top">
      <IconButton
        // variant="standard"
        css={{ margin: "0px" }}
        onClick={onToggle}
        key="fullscreen_btn"
        data-testid="fullscreen_btn"
      >
        <Flex>{icon}</Flex>
      </IconButton>
    </Tooltip>
  );
};
