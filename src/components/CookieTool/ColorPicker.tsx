import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [internalColor, setInternalColor] = useState(color);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalColor(e.target.value);
    onChange(e.target.value);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex h-9 items-center gap-2 rounded-md border border-input px-3 py-2 cursor-pointer">
          <div 
            className="h-5 w-5 rounded-full border" 
            style={{ backgroundColor: internalColor }}
          />
          <span>{internalColor}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="flex flex-col gap-2">
          <input
            type="color"
            value={internalColor}
            onChange={handleChange}
            className="h-8 w-full"
          />
          <input
            type="text"
            value={internalColor}
            onChange={(e) => {
              setInternalColor(e.target.value);
              if (/^#([0-9A-F]{3}){1,2}$/i.test(e.target.value)) {
                onChange(e.target.value);
              }
            }}
            className="h-9 w-full rounded-md border border-input px-3 py-2"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};