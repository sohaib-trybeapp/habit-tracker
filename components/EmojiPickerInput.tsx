"use client";

import { useState } from "react";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerInputProps {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPickerInput({ value, onChange }: EmojiPickerInputProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(data: EmojiClickData) {
    onChange(data.emoji);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="text-2xl h-12 w-12 p-0"
            aria-label="Pick an emoji"
          />
        }
      >
        {value}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-0" align="start">
        <EmojiPicker
          onEmojiClick={handleSelect}
          theme={Theme.AUTO}
          lazyLoadEmojis
          searchPlaceholder="Search emoji..."
        />
      </PopoverContent>
    </Popover>
  );
}
