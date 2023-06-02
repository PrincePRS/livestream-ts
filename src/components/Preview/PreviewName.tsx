import React from "react";
import { useParams } from "react-router-dom";
import { Button, Input, styled } from "@100mslive/react-ui";

interface PreviewNameProps {
  name: string;
  enableJoin: boolean;
  onChange: (value: string) => void;
  onJoin: (e: any) => void;
}

const PreviewName: React.FC<PreviewNameProps> = ({
  name,
  enableJoin,
  onJoin,
  onChange,
}) => {
  const { role } = useParams();

  const formSubmit = (e: any) => {
    e.preventDefault();
  };
  return (
    <Form onSubmit={formSubmit}>
      <Input
        required
        id="name"
        css={{ w: "100%" }}
        value={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your name"
        autoFocus
        autoComplete="name"
      />
      <Button type="submit" disabled={!name || !enableJoin} onClick={onJoin}>
        {/* {isStreamingKit() ? "Join Studio" : "Join Room"} */}
        {role && role.toLowerCase() === "broadcaster"
          ? "Launch room"
          : "Join Room"}
      </Button>
    </Form>
  );
};

const Form = styled("form", {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "$4",
  mt: "$10",
  mb: "$10",
});

export default PreviewName;
