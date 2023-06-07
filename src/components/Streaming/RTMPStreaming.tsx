import React, { useEffect, useRef, useState } from "react";
import {
  selectAppData,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import {
  AddCircleIcon,
  EndStreamIcon,
  GoLiveIcon,
  PencilIcon,
  SettingsIcon,
  TrashIcon,
} from "@100mslive/react-icons";
import {
  Accordion,
  Box,
  Button,
  Flex,
  Input,
  Label,
  Loading,
  Text,
} from "@100mslive/react-ui";
import {
  Container,
  ContentBody,
  ContentHeader,
  ErrorText,
  RecordStream,
} from "./Common";
import { ResolutionInput } from "./ResolutionInput";
import { useSetAppDataByKey } from "../AppData/useUISettings";
import {
  UserPreferencesKeys,
  useUserPreferences,
} from "../hooks/useUserPreferences";
import {
  APP_DATA,
  RTMP_RECORD_DEFAULT_RESOLUTION,
} from "../../common/constants";

export const RTMPStreaming: React.FC<{ onBack: (e: any) => void }> = ({
  onBack,
}) => {
  const { isRTMPRunning } = useRecordingStreaming();

  return (
    <Container>
      <ContentHeader
        title="Start Streaming"
        content="Choose a destination"
        onBack={onBack}
      />
      <ContentBody Icon={<SettingsIcon />} title="RTMP">
        Live Stream your call to Twitch, YouTube, Facebook and any app which
        supports RTMP, all at the same time
      </ContentBody>
      {!isRTMPRunning ? <StartRTMP /> : <EndRTMP />}
    </Container>
  );
};

const StartRTMP = () => {
  const { preference: rtmpPreference, changePreference: setRTMPPreference } =
    useUserPreferences(UserPreferencesKeys.RTMP_URLS);
  // const { rtmpPreference = [], setRTMPPreference } = useUserPreferences(
  //   UserPreferencesKeys.RTMP_URLS
  // );
  const [rtmpStreams, setRTMPStreams] = useState(
    rtmpPreference?.length > 0
      ? rtmpPreference
      : [
          {
            name: "Stream",
            id: Date.now(),
            rtmpURL: "",
            streamKey: "",
          },
        ]
  );
  const hmsActions = useHMSActions();
  const recordingUrl = useHMSStore(selectAppData(APP_DATA.recordingUrl));
  const [error, setError] = useState<string | boolean>(false);
  const [record, setRecord] = useState(false);
  const [resolution, setResolution] = useState<RecordingResolution>(
    RTMP_RECORD_DEFAULT_RESOLUTION
  );
  const [isRTMPStarted, setRTMPStarted] = useSetAppDataByKey(
    APP_DATA.rtmpStarted
  );
  const hasRTMPURL = rtmpStreams?.some(
    (value: Record<string, any>) => value.rtmpURL && value.streamKey
  );

  return (
    <Box
      css={{ overflowY: "auto" }}
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {rtmpStreams && rtmpStreams?.length > 0 && (
        <Box css={{ px: "$10" }}>
          <Accordion.Root
            type="single"
            collapsible
            defaultValue={rtmpStreams[0].id}
          >
            {rtmpStreams.map((rtmp: any, index: number) => {
              return (
                <Accordion.Item
                  value={rtmp.id}
                  key={rtmp.id}
                  css={{
                    border: "2px solid $surfaceLight !important",
                    r: "$1",
                    my: "$4",
                  }}
                >
                  <AccordionHeader
                    rtmp={rtmp}
                    setRTMPStreams={setRTMPStreams}
                  />
                  <Accordion.Content contentStyles={{ px: "$8", py: 0 }}>
                    <RTMPForm
                      {...rtmp}
                      setRTMPStreams={setRTMPStreams}
                      testId={`${index}_rtmp`}
                    />
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </Box>
      )}
      <ResolutionInput
        testId="rtmp_resolution"
        onResolutionChange={setResolution}
        css={{
          flexDirection: "column",
          alignItems: "start",
          px: "$10",
          my: "$8",
        }}
      />
      <RecordStream
        record={record}
        setRecord={setRecord}
        testId="rtmp_recording"
      />
      <Box css={{ p: "$8 $10", "@lg": { display: "flex", gap: "$4" } }}>
        {rtmpStreams && rtmpStreams.length < 3 && (
          <Button
            data-testid="add_stream"
            variant="standard"
            outlined
            icon
            css={{ my: "$4", w: "100%" }}
            onClick={() => {
              setRTMPStreams((streams: Record<string, any>[]) => [
                ...streams,
                {
                  name: "Stream",
                  id: Date.now(),
                  rtmpURL: "",
                  streamKey: "",
                },
              ]);
            }}
          >
            <AddCircleIcon /> Add Stream
          </Button>
        )}

        <Button
          data-testid="start_rtmp"
          variant="primary"
          icon
          type="submit"
          css={{ w: "100%", my: "$4" }}
          disabled={isRTMPStarted || (rtmpStreams?.length === 0 && !record)}
          onClick={async () => {
            try {
              const hasInvalidData = rtmpStreams?.find(
                (value: Record<string, any>) =>
                  (value.rtmpURL && !value.streamKey) ||
                  (value.streamKey && !value.rtmpURL)
              );
              if (hasInvalidData || (rtmpStreams?.length > 0 && !hasRTMPURL)) {
                return;
              }
              setError("");
              setRTMPStarted(true);
              const urls = hasRTMPURL
                ? rtmpStreams?.map(
                    (value: Record<string, any>) =>
                      `${value.rtmpURL}/${value.streamKey}`
                  )
                : [];
              await hmsActions.startRTMPOrRecording({
                rtmpURLs: urls,
                meetingURL: recordingUrl,
                resolution: getResolution(resolution),
                record: record,
              });
              setRTMPPreference(rtmpStreams ?? {});
            } catch (error: any) {
              console.error(error);
              setError(error.message);
              setRTMPStarted(false);
            }
          }}
        >
          {isRTMPStarted ? (
            <Loading size={24} color="currentColor" />
          ) : (
            <GoLiveIcon />
          )}
          {isRTMPStarted ? "Starting stream..." : "Go Live"}
        </Button>
        <ErrorText error={error} />
      </Box>
    </Box>
  );
};

const EndRTMP = () => {
  const hmsActions = useHMSActions();
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState("");
  const { isRTMPRunning } = useRecordingStreaming();

  useEffect(() => {
    if (inProgress && !isRTMPRunning) {
      setInProgress(false);
    }
  }, [inProgress, isRTMPRunning]);

  return (
    <Box css={{ p: "$4 $10" }}>
      <ErrorText error={error} />
      <Button
        data-testid="stop_rtmp"
        variant="danger"
        css={{ w: "100%", r: "$0", my: "$8" }}
        icon
        loading={inProgress}
        disabled={inProgress}
        onClick={async () => {
          try {
            setInProgress(true);
            await hmsActions.stopRTMPAndRecording();
          } catch (error: any) {
            setError(error.message);
            setInProgress(false);
          }
        }}
      >
        <EndStreamIcon />
        End Stream
      </Button>
    </Box>
  );
};

interface ActionIconProps {
  icon: React.ElementType;
  onClick: (e: any) => void;
}

const ActionIcon: React.FC<ActionIconProps> = ({ icon: Icon, onClick }) => {
  return (
    <Text as="span" css={{ mx: "$2", cursor: "pointer" }} onClick={onClick}>
      <Icon width={16} height={16} />
    </Text>
  );
};

const FormLabel: React.FC<{
  id: string;
  children: React.ReactNode;
}> = ({ id, children }) => {
  return (
    <Label
      htmlFor={id}
      css={{ color: "$textHighEmp", my: "$4", fontSize: "$sm" }}
    >
      {children}
    </Label>
  );
};

interface RTMPFormProps {
  rtmpURL: string;
  id: string;
  streamKey: string;
  setRTMPStreams: (streams: any) => void;
  testId: string;
}

interface Stream {
  id: number;

  [key: string]: any;
}

const RTMPForm: React.FC<RTMPFormProps> = ({
  rtmpURL,
  id,
  streamKey,
  setRTMPStreams,
  testId,
}) => {
  const formRef = useRef(null);
  return (
    <Flex id={id} direction="column" css={{ mb: "$8", px: "$8" }} ref={formRef}>
      <FormLabel id="rtmpURL">
        RTMP URL
        <Asterik />
      </FormLabel>
      <Input
        data-testid={`${testId}_url`}
        placeholder="Enter RTMP URL"
        id="rtmpURL"
        name="rtmpURL"
        value={rtmpURL}
        onChange={(e) => {
          setRTMPStreams((streams: Stream[]) =>
            updateStream({
              streams,
              id: Number(id),
              value: e.target.value,
              key: e.target.name,
            })
          );
        }}
        required
      />
      <FormLabel id="streamKey">
        Stream Key
        <Asterik />
      </FormLabel>
      <Input
        placeholder="Enter Stream Key"
        id="streamKey"
        name="streamKey"
        value={streamKey}
        data-testid={`${testId}_key`}
        onChange={(e) => {
          setRTMPStreams((streams: Stream[]) =>
            updateStream({
              streams,
              id: Number(id),
              value: e.target.value,
              key: e.target.name,
            })
          );
        }}
        required
      />
    </Flex>
  );
};

const Asterik = () => {
  return (
    <Text variant="sm" as="span" css={{ color: "$error", mx: "$2" }}>
      *
    </Text>
  );
};

interface RTMPStream {
  id: string;
  name: string;
}

interface AccordionHeaderProps {
  rtmp: RTMPStream;
  setRTMPStreams: React.Dispatch<React.SetStateAction<RTMPStream[]>>;
}

const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  rtmp,
  setRTMPStreams,
}) => {
  const [edit, setEdit] = useState(false);

  return (
    <Accordion.Header css={{ px: "$8" }}>
      {edit ? (
        <Input
          defaultValue={rtmp.name}
          autoFocus
          onBlur={(e) => {
            const value = e.currentTarget.value.trim();
            if (value) {
              setRTMPStreams((streams) =>
                streams.map((stream) => {
                  if (stream.id === rtmp.id) {
                    stream.name = value;
                  }
                  return stream;
                })
              );
              setEdit(false);
            }
          }}
        />
      ) : (
        <Text css={{ flex: "1 1 0" }}>{rtmp.name}</Text>
      )}
      <Flex css={{ mx: "$4", gap: "$2" }}>
        <ActionIcon
          onClick={(e: any) => {
            e.stopPropagation();
            setEdit(true);
          }}
          icon={PencilIcon}
        />
        <ActionIcon
          onClick={() => {
            setRTMPStreams((streams) =>
              streams.filter((stream) => stream.id !== rtmp.id)
            );
          }}
          icon={TrashIcon}
        />
      </Flex>
    </Accordion.Header>
  );
};

interface RecordingResolution {
  width: number;
  height: number;
}

type StreamArray = Stream[];

const updateStream = ({
  streams,
  id,
  key,
  value,
}: {
  streams: StreamArray;
  id: number;
  key: string;
  value: any;
}): StreamArray =>
  streams.map((stream) => {
    if (stream.id === id) {
      return {
        ...stream,
        [key]: value,
      };
    }
    return stream;
  });

export function getResolution(
  recordingResolution: RecordingResolution
): { width: number; height: number } | undefined {
  const resolution: RecordingResolution = {} as RecordingResolution;
  if (recordingResolution.width) {
    resolution.width = recordingResolution.width;
  }
  if (recordingResolution.height) {
    resolution.height = recordingResolution.height;
  }
  if (Object.keys(resolution).length > 0) {
    return resolution;
  }
}
