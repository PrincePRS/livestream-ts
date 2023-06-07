import React from "react";
import { flexCenter, styled } from "@100mslive/react-ui";
import PreviewJoin from "./PreviewJoin";

interface PreviewContainerProps {
  token: string;
  onJoin: () => void;
  env: string;
  skipPreview: boolean;
  initialName: string;
  asRole: string;
}

const PreviewContainer: React.FC<PreviewContainerProps> = ({
  token,
  onJoin,
  env,
  skipPreview,
  initialName,
  asRole,
}) => {
  return (
    <Container>
      <PreviewJoin
        initialName={initialName}
        skipPreview={skipPreview}
        env={env}
        onJoin={onJoin}
        token={token}
        asRole={asRole}
      />
    </Container>
  );
};

const Container = styled("div", {
  width: "100%",
  ...flexCenter,
  flexDirection: "column",
});

export default PreviewContainer;
