import React, {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import {
  HMSMessage,
  selectHMSMessages,
  selectLocalPeerID,
  selectLocalPeerRoleName,
  selectMessagesByPeerID,
  selectMessagesByRole,
  selectPeerNameByID,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { HorizontalMenuIcon, PinIcon } from "@100mslive/react-icons";
import {
  Box,
  Dropdown,
  Flex,
  IconButton,
  styled,
  Text,
  Tooltip,
} from "@100mslive/react-ui";
import { useSetPinnedMessage } from "../hooks/useSetPinnedMessage";
import { AnyARecord } from "dns";

const formatTime = (date: any) => {
  if (!(date instanceof Date)) {
    return "";
  }
  let hours: number | string = date.getHours();
  let mins: number | string = date.getMinutes();
  const suffix = hours > 11 ? "PM" : "AM";
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (mins < 10) {
    mins = "0" + mins;
  }
  return `${hours}:${mins} ${suffix}`;
};

const MessageTypeContainer: React.FC<{ left: string; right?: string }> = ({
  left,
  right,
}) => {
  return (
    <Flex
      align="center"
      css={{
        ml: "auto",
        mr: "$4",
        p: "$2 $4",
        border: "1px solid $textDisabled",
        r: "$0",
      }}
    >
      {left && (
        <SenderName variant="tiny" as="span" css={{ color: "$textMedEmp" }}>
          {left}
        </SenderName>
      )}
      {left && right && (
        <Box
          css={{ borderLeft: "1px solid $textDisabled", mx: "$4", h: "$8" }}
        />
      )}
      {right && (
        <SenderName as="span" variant="tiny">
          {right}
        </SenderName>
      )}
    </Flex>
  );
};

const MessageType: React.FC<{
  roles: string[];
  hasCurrentUserSent: boolean;
  receiver: string;
}> = ({ roles, hasCurrentUserSent, receiver }) => {
  const peerName = useHMSStore(selectPeerNameByID(receiver));
  const localPeerRoleName = useHMSStore(selectLocalPeerRoleName);
  if (receiver) {
    return (
      <MessageTypeContainer
        left={
          hasCurrentUserSent ? `${peerName ? `TO ${peerName}` : ""}` : "TO YOU"
        }
        right="PRIVATE"
      />
    );
  }

  if (roles && roles.length) {
    return (
      <MessageTypeContainer
        left="TO"
        right={hasCurrentUserSent ? roles.join(",") : localPeerRoleName}
      />
    );
  }
  return null;
};

const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const Link = styled("a", {
  color: "$brandDefault",
  wordBreak: "break-word",
  "&:hover": {
    textDecoration: "underline",
  },
});

export const AnnotisedMessage: React.FC<{ message: string }> = ({
  message,
}) => {
  if (!message) {
    return <Fragment />;
  }

  return (
    <Fragment>
      {message
        .trim()
        .split(/(\s)/)
        .map((part: string) =>
          URL_REGEX.test(part) ? (
            <Link
              href={part}
              key={part}
              target="_blank"
              rel="noopener noreferrer"
            >
              {part}
            </Link>
          ) : (
            part
          )
        )}
    </Fragment>
  );
};

const getMessageType = ({
  roles,
  receiver,
}: {
  roles: string[];
  receiver: string;
}) => {
  if (roles && roles.length > 0) {
    return "role";
  }
  return receiver ? "private" : "";
};

const ChatActions: React.FC<{ onPin: (e: any) => void }> = ({ onPin }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown.Root open={open} onOpenChange={setOpen}>
      <Dropdown.Trigger asChild>
        <IconButton>
          <Tooltip title="More options">
            <Box>
              <HorizontalMenuIcon />
            </Box>
          </Tooltip>
        </IconButton>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content sideOffset={5} align="end" css={{ width: "$48" }}>
          <Dropdown.Item data-testid="pin_message_btn" onClick={onPin}>
            <PinIcon />
            <Text variant="sm" css={{ ml: "$4" }}>
              Pin Message
            </Text>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
};

const SenderName = styled(Text, {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "24ch",
  minWidth: 0,
});

const ChatMessage: React.FC<{
  index: number;
  style?: Record<string, any>;
  message: Record<string, any>;
  setRowHeight: (index: number, rowHeight: number) => void;
  onPin: (e: any) => void;
}> = React.memo(({ index, style = {}, message, setRowHeight, onPin }) => {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (rowRef.current) {
      setRowHeight(index, rowRef.current.clientHeight);
    }
  }, [index, setRowHeight]);

  const hmsActions = useHMSActions();
  const localPeerId = useHMSStore(selectLocalPeerID);
  const permissions = useHMSStore(selectPermissions);
  const messageType = getMessageType({
    roles: message.recipientRoles,
    receiver: message.recipientPeer,
  });
  // show pin action only if peer has remove others permission and the message is of broadcast type
  const showPinAction = permissions?.removeOthers && !messageType;

  useEffect(() => {
    if (message.id && !message.read && inView) {
      hmsActions.setMessageRead(true, message.id);
    }
  }, [message.read, hmsActions, inView, message.id]);

  return (
    <Box ref={ref} as="div" css={{ mb: "$10", pr: "$10" }} style={style}>
      <Flex
        ref={rowRef}
        align="center"
        css={{
          flexWrap: "wrap",
          bg: messageType ? "$surfaceLight" : undefined,
          r: messageType ? "$1" : undefined,
          px: messageType ? "$4" : "$2",
          py: messageType ? "$4" : 0,
          userSelect: "none",
        }}
        key={message.time}
        data-testid="chat_msg"
      >
        <Text
          css={{
            color: "$textHighEmp",
            fontWeight: "$semiBold",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
          as="div"
        >
          <Flex align="center">
            {message.senderName === "You" || !message.senderName ? (
              <SenderName as="span">
                {message.senderName || "Anonymous"}
              </SenderName>
            ) : (
              <Tooltip title={message.senderName} side="top" align="start">
                <SenderName as="span">{message.senderName}</SenderName>
              </Tooltip>
            )}
            <Text
              as="span"
              variant="sm"
              css={{
                ml: "$4",
                color: "$textSecondary",
                flexShrink: 0,
              }}
            >
              {formatTime(message.time)}
            </Text>
          </Flex>
          <MessageType
            hasCurrentUserSent={message.sender === localPeerId}
            receiver={message.recipientPeer}
            roles={message.recipientRoles}
          />
          {showPinAction && <ChatActions onPin={onPin} />}
        </Text>
        <Text
          variant="body2"
          css={{
            w: "100%",
            mt: "$2",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            userSelect: "all",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <AnnotisedMessage message={message.message} />
        </Text>
      </Flex>
    </Box>
  );
});
const ChatList = React.forwardRef<
  VariableSizeList & { scrollToItem(value: number): void },
  {
    width: number;
    height: number;
    setRowHeight: (index: number, rowHeight: number) => void;
    getRowHeight: (index: number) => number;
    messages: HMSMessage[];
    scrollToBottom: (value: number) => void;
  }
>(
  (
    { width, height, setRowHeight, getRowHeight, messages, scrollToBottom },
    listRef
  ) => {
    const { setPinnedMessage } = useSetPinnedMessage();
    useLayoutEffect(() => {
      // if (listRef?.current && listRef.current?.scrollToItem) {
      //   scrollToBottom(1);
      // }   /////////////////Fix this.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listRef]);

    return (
      <VariableSizeList
        ref={listRef}
        itemCount={messages.length}
        itemSize={getRowHeight}
        width={width}
        height={height - 1}
        style={{
          overflowX: "hidden",
        }}
      >
        {({ index, style }) => (
          <ChatMessage
            style={style}
            index={index}
            key={messages[index].id}
            message={messages[index]}
            setRowHeight={setRowHeight}
            onPin={() => setPinnedMessage(messages[index])}
          />
        )}
      </VariableSizeList>
    );
  }
);
const VirtualizedChatMessages = React.forwardRef<
  VariableSizeList & { scrollToItem(value: number): void },
  {
    messages: HMSMessage[];
    setPinnedMessage?: () => void;
    scrollToBottom: (value: number) => void;
  }
>(({ messages, setPinnedMessage, scrollToBottom }, listRef) => {
  const rowHeights = useRef<Record<string, any>>({});

  function getRowHeight(index: number) {
    // 72 will be default row height for any message length
    // 16 will add margin value as clientHeight don't include margin
    return rowHeights.current[index] + 16 || 72;
  }

  const setRowHeight = useCallback(
    (index: number, size: number) => {
      // if (listRef) listRef.current.resetAfterIndex(0);     ///////////   fix this.
      rowHeights.current = { ...rowHeights.current, [index]: size };
    },
    [listRef]
  );

  return (
    <Box
      css={{
        mr: "-$10",
        h: "100%",
      }}
      as="div"
    >
      <AutoSizer
        style={{
          width: "90%",
        }}
      >
        {({ height, width }: { height: number; width: number }) => (
          <ChatList
            width={width}
            height={height}
            messages={messages}
            setRowHeight={setRowHeight}
            getRowHeight={getRowHeight}
            scrollToBottom={scrollToBottom}
            ref={listRef}
          />
        )}
      </AutoSizer>
    </Box>
  );
});

export const ChatBody = React.forwardRef<
  VariableSizeList,
  { role: string; peerId: string; scrollToBottom: (value: number) => void }
>(({ role, peerId, scrollToBottom }, listRef) => {
  const storeMessageSelector = role
    ? selectMessagesByRole(role)
    : peerId
    ? selectMessagesByPeerID(peerId)
    : selectHMSMessages;
  const messages = useHMSStore(storeMessageSelector) || [];

  if (messages.length === 0) {
    return (
      <Flex
        css={{
          width: "100%",
          height: "100%",
          textAlign: "center",
          px: "$4",
        }}
        align="center"
        justify="center"
      >
        <Text>There are no messages here</Text>
      </Flex>
    );
  }

  return (
    <Fragment>
      <VirtualizedChatMessages
        messages={messages}
        scrollToBottom={scrollToBottom}
        ref={listRef}
      />
    </Fragment>
  );
});
