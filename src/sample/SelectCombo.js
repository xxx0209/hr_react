import React, { useMemo, useState, useEffect, useRef } from "react";
import { Form, InputGroup, Badge, Button, ListGroup } from "react-bootstrap";

/**
 * SelectCombo
 * props:
 * - options: Array<object> | Array<string>
 * - value: string | Array<string>
 * - onChange: (newValue) => void
 * - label: string
 * - placeholder: string
 * - searchable: boolean (default false)
 * - multiple: boolean (default false)
 * - disabled: boolean
 * - className: string
 * - noOptionsText: string
 * - required: boolean
 * - valueKey: string (default: "value")
 * - labelKey: string (default: "label")
 * - colorKey: string (default: "color") ← 🎨 색상 표시용
 */
export default function SelectCombo({
  options = [],
  value,
  onChange,
  label,
  placeholder = "선택하세요",
  searchable = false,
  multiple = false,
  disabled = false,
  className = "",
  noOptionsText = "옵션이 없습니다",
  required = false,
  valueKey = "value",
  labelKey = "label",
  colorKey = "color", // 🎨 추가
}) {
  const normOptions = useMemo(() => {
    return options.map((o) => {
      if (typeof o === "string") return { [valueKey]: o, [labelKey]: o };
      return o;
    });
  }, [options, valueKey, labelKey]);

  const [internalValue, setInternalValue] = useState(multiple ? [] : "");
  const controlled = value !== undefined;
  const selected = controlled ? value : internalValue;

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    if (!q) return normOptions;
    return normOptions.filter(
      (o) =>
        o[labelKey]?.toLowerCase().includes(q) ||
        String(o[valueKey])?.toLowerCase().includes(q)
    );
  }, [normOptions, search, valueKey, labelKey]);

  const isSelected = (val) => {
    if (multiple) {
      return Array.isArray(selected) && selected.includes(val);
    }
    return selected === val;
  };

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
      setOpen(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    updateValue(multiple ? [] : "");
  };

  const displayLabel = () => {
    if (multiple) return null;
    if (!selected) return "";
    const found = normOptions.find((o) => o[valueKey] === selected);
    return found ? found[labelKey] : selected;
  };

  return (
    <div
      className={`select-combo ${className}`}
      ref={wrapperRef}
      style={{ position: "relative" }}
    >
      {label && <Form.Label>{label}</Form.Label>}

      <div>
        <InputGroup>
          {multiple ? (
            <div
              onClick={() => !disabled && setOpen((s) => !s)}
              style={{
                minHeight: "38px",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "6px",
                padding: "6px 8px",
                border: "1px solid #ced4da",
                borderRadius: ".375rem",
                background: disabled ? "#e9ecef" : "white",
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {Array.isArray(selected) && selected.length > 0 ? (
                selected.map((val) => {
                  const opt = normOptions.find((o) => o[valueKey] === val);
                  return (
                    <Badge
                      key={val}
                      pill
                      bg="secondary"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      {/* 🎨 색상 점 표시 */}
                      {opt?.[colorKey] && (
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: opt[colorKey],
                            display: "inline-block",
                            marginRight: 6,
                            border: "1px solid rgba(0,0,0,0.2)",
                          }}
                        />
                      )}
                      <span style={{ marginRight: 6 }}>
                        {opt ? opt[labelKey] : val}
                      </span>
                      <Button
                        size="sm"
                        variant="light"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(val);
                        }}
                        style={{ padding: "0 4px", lineHeight: 1 }}
                      >
                        ×
                      </Button>
                    </Badge>
                  );
                })
              ) : (
                <span style={{ color: "#6c757d" }}>{placeholder}</span>
              )}
              {required && (
                <input
                  type="text"
                  tabIndex={-1}
                  style={{
                    opacity: 0,
                    height: 0,
                    width: 0,
                    position: "absolute",
                  }}
                  value={
                    Array.isArray(selected) && selected.length > 0
                      ? selected.join(",")
                      : ""
                  }
                  required
                  onChange={() => {}}
                />
              )}
            </div>
          ) : (
            <>
              <Form.Control
                readOnly
                onClick={() => !disabled && setOpen((s) => !s)}
                value={displayLabel() || ""}
                placeholder={placeholder}
                disabled={disabled}
                style={{
                  cursor: disabled ? "not-allowed" : "pointer",
                  background: disabled ? "#e9ecef" : "white",
                }}
              />
              {required && (
                <input
                  type="text"
                  tabIndex={-1}
                  style={{
                    opacity: 0,
                    height: 0,
                    width: 0,
                    position: "absolute",
                  }}
                  value={selected || ""}
                  required
                  onChange={() => {}}
                />
              )}
            </>
          )}

          <Button
            variant="outline-secondary"
            onClick={(e) => {
              e.stopPropagation();
              if (
                selected &&
                (multiple
                  ? Array.isArray(selected) && selected.length > 0
                  : selected !== "")
              ) {
                handleClear(e);
              } else {
                setOpen((s) => !s);
              }
            }}
            aria-label="toggle"
            disabled={disabled}
          >
            {selected &&
            (multiple
              ? Array.isArray(selected) && selected.length > 0
              : selected !== "")
              ? "×"
              : "▾"}
          </Button>
        </InputGroup>

        {open && (
          <div
            style={{
              position: "absolute",
              zIndex: 9999,
              width: "100%",
              background: "white",
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 6,
              marginTop: 6,
              boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
            }}
          >
            {searchable && (
              <div style={{ padding: 8 }}>
                <Form.Control
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="검색..."
                  autoFocus
                />
              </div>
            )}

            <div style={{ maxHeight: 240, overflow: "auto" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 12, color: "#6c757d" }}>
                  {noOptionsText}
                </div>
              ) : (
                <ListGroup variant="flush">
                  {filtered.map((opt) => (
                    <ListGroup.Item
                      key={opt[valueKey]}
                      action
                      onClick={() => handleSelect(opt[valueKey])}
                      active={isSelected(opt[valueKey])}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {/* 🎨 색상 표시 */}
                        {opt?.[colorKey] && (
                          <span
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              background: opt[colorKey],
                              display: "inline-block",
                              marginRight: 8,
                              border: "1px solid rgba(0,0,0,0.2)",
                            }}
                          />
                        )}
                        <span>{opt[labelKey]}</span>
                      </div>
                      {isSelected(opt[valueKey]) && (
                        <span style={{ opacity: 0.7 }}>✓</span>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
