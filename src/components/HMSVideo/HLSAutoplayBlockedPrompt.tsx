import React, { ReactNode } from "react";
import { Button, Dialog, Text } from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "../../primitives/DialogContent";

interface HLSAutoplayBlockedPromptProps {
  open: boolean;
  unblockAutoPlay: () => void;
}

export function HLSAutoplayBlockedPrompt({
  open,
  unblockAutoPlay,
}: HLSAutoplayBlockedPromptProps): JSX.Element {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value: boolean) => {
        if (!value) {
          unblockAutoPlay();
        }
      }}
    >
      <DialogContent title="Attention" closeable={false}>
        <DialogRow>
          <Text variant="md">
            The browser wants us to get a confirmation for playing the HLS
            Stream. Please click "play stream" to proceed.
          </Text>
        </DialogRow>
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={() => {
              unblockAutoPlay();
            }}
          >
            Play stream
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
}
