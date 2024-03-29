import React from "react";
import { styled, Text, textEllipsis } from "@100mslive/react-ui";
import { ConnectionIndicator } from "./ConnectionIndicator";

interface TileConnectionProps {
  name?: string;
  peerId?: string;
  hideLabel: boolean;
  width?: number;
  isTile?: boolean;
}

const TileConnection: React.FC<TileConnectionProps> = ({
  name = "",
  peerId = "",
  hideLabel,
  isTile = true,
  width = 0,
}) => {
  return (
    <Wrapper>
      {!hideLabel ? (
        <Text
          css={{
            c: "$textHighEmp",
            ...textEllipsis(width - 60),
          }}
          variant="xs"
        >
          {name}
        </Text>
      ) : null}
      <ConnectionIndicator isTile peerId={peerId} />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "absolute",
  bottom: "$2",
  left: "$2",
  backgroundColor: "$backgroundDark",
  borderRadius: "$1",
  zIndex: 1,
  "& p,span": {
    p: "$2 $3",
  },
});

export default TileConnection;
