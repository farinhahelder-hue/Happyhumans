'use client';
import { useState, useRef, useCallback } from 'react';
import { useInlineEdit } from '@/contexts/InlineEditContext';

type EditableFieldProps = {
  page: string;
  fieldKey: string;
  value: string;
  multiline?: boolean;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  style?: React.CSSProperties;
  className?: string;
};

export default function EditableField({
  page, fieldKey, value, multiline = false,
  as: Tag = 'span', style, className,
}: EditableFieldProps) {
  const { isEditing, updateField, pendingChanges } = useInlineEdit();
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pending value overrides server value
  const pending = pendingChanges[page]?.[fieldKey];
  const displayValue = pending !== undefined ? pending : value;

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    setFocused(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [isEditing]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    updateField(page, fieldKey, e.target.value);
  }, [page, fieldKey, updateField]);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setFocused(false);
      textareaRef.current?.blur();
    }
    // Tab moves to next editable field (browser default)
  }, []);

  // Inline edit mode: show textarea or input
  if (isEditing) {
    if (focused) {
      if (multiline) {
        return (
          <textarea
            ref={textareaRef}
            value={pending ?? value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            rows={3}
            style={{
              ...style,
              width: '100%',
              outline: '2px dashed #2d5f54',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              lineHeight: 'inherit',
              color: 'inherit',
              background: '#f0fff4',
              resize: 'vertical',
            }}
          />
        );
      }
      return (
        <input
          ref={undefined as unknown as React.Ref<HTMLInputElement>}
          value={pending ?? value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            ...style,
            outline: '2px dashed #2d5f54',
            border: 'none',
            borderRadius: '4px',
            padding: '2px 6px',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            color: 'inherit',
            background: '#f0fff4',
          }}
        />
      );
    }

    // Non-focused: show clickable text with dashed underline
    return (
      <Tag
        onClick={handleClick}
        style={{
          ...style,
          cursor: 'pointer',
          borderBottom: '2px dashed #2d5f54',
          display: 'inline',
        }}
        className={className}
        title="Cliquez pour modifier"
      >
        {displayValue}
      </Tag>
    );
  }

  // Normal mode
  return <Tag style={style} className={className}>{displayValue}</Tag>;
}
