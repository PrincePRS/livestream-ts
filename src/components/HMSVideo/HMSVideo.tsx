import { forwardRef, ReactNode, Ref } from "react";
import { Flex } from "@100mslive/react-ui";

type HMSVideoProps = {
  children: ReactNode;
};

export const HMSVideo = forwardRef<HTMLVideoElement, HMSVideoProps>(
  ({ children }, videoRef: Ref<HTMLVideoElement>) => {
    return (
      <Flex data-testid="hms-video" css={{ size: "100%" }} direction="column">
        <video
          style={{ flex: "1 1 0", margin: "0 auto", minHeight: "0" }}
          ref={videoRef}
          playsInline
        />
        {children}
      </Flex>
    );
  }
);
