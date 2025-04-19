import { useColorField } from '@react-aria/color';
import { useColorFieldState } from '@react-stately/color';
import { useRef } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const state = useColorFieldState({
    value,
    onChange: color => onChange(color.toString('hex'))
  });

  const { labelProps, inputProps } = useColorField(
    { label, "aria-label": label },
    state,
    inputRef
  );

  return (
    <div>
      <label {...labelProps} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        {...inputProps}
        ref={inputRef}
        type="color"
        className="h-10 w-full cursor-pointer rounded border border-gray-300"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
} 