import React, { useState, useMemo } from "react";
import { Form, Button, Badge } from "react-bootstrap";

/**
 * props:
 * - options: Array<string> | Array<{ value, label }>
 * - value: string | Array<string> (controlled)
 * - defaultValue : string | Array<string>
 * - onChange: (newValue) => void
 * - label: string
 * - multiple: boolean (default false)
 * - disabled: boolean
 * - className: string
 */
export default function RadioGroup({
  options = [],
  value,
  defaultValue,    // 추가
  onChange,
  label,
  multiple = false,
  disabled = false,
  className = "",
}) {
  const normOptions = useMemo(
    () => options.map((o) => (typeof o === "string" ? { value: o, label: o } : o)),
    [options]
  );

  const controlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(
    controlled ? value : defaultValue !== undefined ? defaultValue : multiple ? [] : ""
  );

  const selected = controlled ? value : internalValue;

  const updateValue = (newVal) => {
    if (onChange) onChange(newVal);
    if (!controlled) setInternalValue(newVal);
  };

  const handleSelect = (val) => {
    if (disabled) return;

    if (multiple) {
      const arr = Array.isArray(selected) ? [...selected] : [];
      const idx = arr.indexOf(val);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(val);
      updateValue(arr);
    } else {
      updateValue(val);
    }
  };

  const isSelected = (val) => {
    if (multiple) return Array.isArray(selected) && selected.includes(val);
    return selected === val;
  };

  return (
    <div className={`radio-group ${className}`}>
      {label && <Form.Label>{label}</Form.Label>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: 6 }}>
        {normOptions.map((opt) => (
          <Button
            key={opt.value}
            variant={isSelected(opt.value) ? "primary" : "outline-secondary"}
            onClick={() => handleSelect(opt.value)}
            disabled={disabled}
            style={{ display: "flex", alignItems: "center" }}
          >
            {opt.label}
            {isSelected(opt.value) && (
              <Badge bg="light" text="dark" style={{ marginLeft: 6 }}>
                ✓
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}