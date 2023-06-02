import React, { useEffect, useState } from "react";
import { HMSPeer, useVideoList } from "@100mslive/react-sdk";
import { getLeft, StyledVideoList, useTheme } from "@100mslive/react-ui";
import { Pagination } from "./Pagination";
import ScreenshareTile from "./ScreenshareTile";
import VideoTile from "./VideoTile";
import { useAppConfig } from "./AppData/useAppConfig";
import { useIsHeadless } from "./AppData/useUISettings";

interface ListProps {
  maxTileCount?: number;
  peers: HMSPeer[];
  maxColCount?: number;
  maxRowCount?: number;
  includeScreenShareForPeer?: (peer: HMSPeer) => boolean;
}

const List: React.FC<ListProps> = ({
  maxTileCount,
  peers,
  maxColCount,
  maxRowCount,
  includeScreenShareForPeer,
}) => {
  const { aspectRatio } = useTheme();
  const tileOffset = useAppConfig("headlessConfig", "tileOffset");
  const isHeadless = useIsHeadless();
  const { ref, pagesWithTiles } = useVideoList({
    peers,
    maxTileCount,
    maxColCount,
    maxRowCount,
    includeScreenShareForPeer,
    aspectRatio,
    offsetY: getOffset({
      isHeadless: isHeadless ? true : false,
      offset: tileOffset,
    }),
  });
  const [page, setPage] = useState(0);
  useEffect(() => {
    // currentPageIndex should not exceed pages length
    if (page >= pagesWithTiles.length) {
      setPage(0);
    }
  }, [pagesWithTiles.length, page]);
  return (
    <StyledVideoList.Root ref={ref}>
      <StyledVideoList.Container>
        {pagesWithTiles && pagesWithTiles.length > 0
          ? pagesWithTiles.map((tiles, pageNo) => (
              <StyledVideoList.View
                key={pageNo}
                css={{
                  left: getLeft(pageNo, page),
                  transition: "left 0.3s ease-in-out",
                }}
              >
                {tiles.map((tile) => {
                  if (tile.width === 0 || tile.height === 0) {
                    return null;
                  }
                  return tile.track?.source === "screen" ? (
                    <ScreenshareTile
                      key={tile.track.id}
                      width={tile.width.toString()}
                      height={tile.height.toString()}
                      peerId={tile.peer.id}
                    />
                  ) : (
                    <VideoTile
                      key={tile.track?.id || tile.peer.id}
                      width={tile.width}
                      height={tile.height}
                      peerId={tile.peer?.id}
                      trackId={tile.track?.id}
                      visible={pageNo === page}
                    />
                  );
                })}
              </StyledVideoList.View>
            ))
          : null}
      </StyledVideoList.Container>
      {!isHeadless && pagesWithTiles.length > 1 ? (
        <Pagination
          page={page}
          setPage={setPage}
          numPages={pagesWithTiles.length}
        />
      ) : null}
    </StyledVideoList.Root>
  );
};

const VideoList = React.memo(List);

const getOffset = ({
  offset,
  isHeadless,
}: {
  offset?: Record<string, any>;
  isHeadless: boolean;
}) => {
  if (!isHeadless || typeof offset !== "number") {
    return 32;
  }
  return offset;
};

export default VideoList;
