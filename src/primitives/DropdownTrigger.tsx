import React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@100mslive/react-icons";
import { Dropdown, Flex, Text, textEllipsis } from "@100mslive/react-ui";

const DialogDropdownTrigger = React.forwardRef<
  HTMLButtonElement,
  {
    title: string;
    css: Record<string, any>;
    open: boolean;
    icon: JSX.Element;
    titleCSS: Record<string, any>;
  }
>(
  (
    { title, css, open, icon, titleCSS = {} },
    ref?: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <Dropdown.Trigger
        asChild
        data-testid={`${title}_selector`}
        css={{
          border: "1px solid $borderLight",
          bg: "$surfaceLight",
          r: "$1",
          p: "$6 $9",
          zIndex: 10,
          ...css,
        }}
        ref={ref}
      >
        <Flex
          css={{
            display: "flex",
            justifyContent: "space-between",
            color: "$textHighEmp",
            w: "100%",
          }}
        >
          {icon}
          <Text
            css={{
              color: "inherit",
              ...textEllipsis("90%"),
              flex: "1 1 0",
              mx: icon ? "$6" : "0",
              ...titleCSS,
            }}
          >
            {title}
          </Text>
          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Flex>
      </Dropdown.Trigger>
    );
  }
);

export { DialogDropdownTrigger };
