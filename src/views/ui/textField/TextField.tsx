import { ChangeEvent, useCallback } from 'react';

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function TextField({ value, onChange }: TextFieldProps) {
  const change = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );
  return <input type="text" value={value} onChange={change} />;
}

export default TextField;
