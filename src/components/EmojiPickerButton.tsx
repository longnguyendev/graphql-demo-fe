import { ButtonProps, Popover } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { ReactElement, cloneElement, isValidElement, useState } from "react";
import { useFormContext } from "react-hook-form";

interface EmojiPickerButtonProps {
  children: ReactElement<ButtonProps>;
}

export function EmojiPickerButton({ children }: EmojiPickerButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { setValue, getValues } = useFormContext();

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, { onClick: handleClick })}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <EmojiPicker
          onEmojiClick={(e) => {
            const prevValue = getValues("content");
            setValue("content", prevValue + e.emoji);
          }}
        />
      </Popover>
    </>
  );
}
