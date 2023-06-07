import { useState } from "react";
import { SpeakerIcon } from "@100mslive/react-icons";
import { Flex, Slider } from "@100mslive/react-ui";

interface VolumeControlProps {
  hlsPlayer: {
    volume: number;
    setVolume: (volume: number) => void;
  } | null;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({ hlsPlayer }) => {
  const [volume, setVolume] = useState<number>(hlsPlayer?.volume ?? 100);

  return (
    <Flex align="center" css={{ color: "$white" }}>
      <SpeakerIcon
        style={{ cursor: "pointer" }}
        onClick={() => {
          setVolume(0);
          if (hlsPlayer) {
            hlsPlayer.setVolume(0);
          }
        }}
      />
      <Slider
        css={{
          mx: "$4",
          w: "$20",
          cursor: "pointer",
          "@sm": { w: "$14" },
          "@xs": { w: "$14" },
        }}
        min={0}
        max={100}
        step={1}
        value={[volume]}
        onValueChange={(value) => {
          if (hlsPlayer) {
            hlsPlayer.setVolume(value[0]);
          }
          setVolume(value[0]);
        }}
        thumbStyles={{ w: "$6", h: "$6" }}
      />
    </Flex>
  );
};
