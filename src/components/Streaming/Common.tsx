import { selectPermissions, useHMSStore } from "@100mslive/react-sdk";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CrossIcon,
  RecordIcon,
} from "@100mslive/react-icons";
import {
  Box,
  Flex,
  IconButton,
  slideLeftAndFade,
  Switch,
  Text,
} from "@100mslive/react-ui";

export const StreamCard: React.FC<{
  title?: string;
  subtitle?: string;
  Icon?: React.ReactNode;
  css?: Record<string, any>;
  onClick?: (e: any) => void;
  testId: string;
}> = ({ title, subtitle, Icon, css = {}, onClick, testId }) => {
  return (
    <Flex
      css={{
        w: "100%",
        p: "$10",
        r: "$1",
        cursor: "pointer",
        bg: "$surfaceLight",
        mb: "$10",
        mt: "$8",
        ...css,
      }}
      data-testid={testId}
      onClick={onClick}
    >
      <Text css={{ alignSelf: "center", p: "$4" }}>
        {/* <Icon width={40} height={40} /> */}
        {Icon}
      </Text>
      <Box css={{ flex: "1 1 0", mx: "$8" }}>
        <Text variant="h6" css={{ mb: "$4" }}>
          {title}
        </Text>
        <Text variant="sm" css={{ color: "$textMedEmp" }}>
          {subtitle}
        </Text>
      </Box>
      <Text css={{ alignSelf: "center" }}>
        <ChevronRightIcon />
      </Text>
    </Flex>
  );
};

export const ContentHeader: React.FC<{
  onBack?: (e: any) => void;
  title?: string;
  content?: string;
}> = ({ onBack, title, content }) => {
  return (
    <Flex css={{ w: "100%", py: "$8", px: "$10", cursor: "pointer" }}>
      <Text
        css={{ p: "$2", bg: "$surfaceLight", r: "$round", alignSelf: "center" }}
        onClick={onBack}
        data-testid="go_back"
      >
        <ChevronLeftIcon width={16} height={16} />
      </Text>
      <Box css={{ flex: "1 1 0", mx: "$8" }}>
        <Text
          variant="tiny"
          css={{
            textTransform: "uppercase",
            fontWeight: "$semiBold",
            color: "$textMedEmp",
          }}
        >
          {title}
        </Text>
        <Text variant="h6">{content}</Text>
      </Box>
      <IconButton
        onClick={onBack}
        css={{ alignSelf: "flex-start" }}
        data-testid="close_stream_section"
      >
        <CrossIcon width={16} height={16} />
      </IconButton>
    </Flex>
  );
};

export const Container: React.FC<{
  children?: JSX.Element[];
  rounded?: boolean;
}> = ({ children, rounded = false }) => {
  return (
    <Box
      css={{
        size: "100%",
        zIndex: 2,
        position: "absolute",
        top: 0,
        left: 0,
        bg: "$surfaceDefault",
        transform: "translateX(10%)",
        animation: `${slideLeftAndFade("10%")} 100ms ease-out forwards`,
        display: "flex",
        flexDirection: "column",
        borderRadius: rounded ? "$2" : "0",
      }}
    >
      {children}
    </Box>
  );
};

export const ContentBody: React.FC<{
  Icon?: JSX.Element;
  children?: string;
  title?: string;
  removeVerticalPadding?: boolean;
}> = ({ Icon, title, removeVerticalPadding = false, children }) => {
  return (
    <Box css={{ p: removeVerticalPadding ? "$0 $10" : "$10" }}>
      <Text css={{ display: "flex", alignItems: "center", mb: "$4" }}>
        {Icon}
        <Text as="span" css={{ fontWeight: "$semiBold", ml: "$4" }}>
          {title}
        </Text>
      </Text>
      <Text variant="sm" css={{ color: "$textMedEmp" }}>
        {children}
      </Text>
    </Box>
  );
};

export const RecordStream: React.FC<{
  record?: boolean;
  setRecord?: (value: boolean) => void;
  testId?: string;
}> = ({ record, setRecord, testId }) => {
  const permissions = useHMSStore(selectPermissions);
  return permissions?.browserRecording ? (
    <Flex
      align="center"
      css={{ bg: "$surfaceLight", m: "$8 $10", p: "$8", r: "$0" }}
    >
      <Text css={{ color: "$error" }}>
        <RecordIcon />
      </Text>
      <Text variant="sm" css={{ flex: "1 1 0", mx: "$8" }}>
        Record the stream
      </Text>
      <Switch
        checked={record}
        onCheckedChange={setRecord}
        data-testid={testId}
      />
    </Flex>
  ) : null;
};

export const ErrorText: React.FC<{ error: any }> = ({ error }) => {
  if (!error) {
    return null;
  }
  return (
    <Text variant="sm" css={{ mb: "$8", color: "$error" }}>
      {error}
    </Text>
  );
};
