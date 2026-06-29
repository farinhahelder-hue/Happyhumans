'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const pending = pendingChanges[page]?.[fieldKey];
  const isDirty = pending !== undefined;
  const displayValue = pending !== undefined ? pending : value;

  // Auto-resize textarea to content
  useEffect(() => {
    if (focused && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [focused, displayValue]);

  const openEditor = useCallback((e: React.MouseEvent) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    setFocused(true);
    setTimeout(() => {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      } else if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, [isEditing, multiline]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    updateField(page, fieldKey, e.target.value);
    // Auto-resize textarea
    if (multiline && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [page, fieldKey, updateField, multiline]);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setFocused(false);
      if (multiline && textareaRef.current) textareaRef.current.blur();
      else if (inputRef.current) inputRef.current.blur();
    }
    if (multiline && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      setFocused(false);
      textareaRef.current?.blur();
    }
  }, [multiline]);

  if (!isEditing) {
    return <Tag style={style} className={className}>{displayValue}</Tag>;
  }

  if (focused) {
    const baseStyle = {
      ...style,
      outline: '2px dashed #16a34a',
      border: 'none',
      borderRadius: '4px',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      lineHeight: 'inherit',
      color: 'inherit',
      background: 'rgba(22, 163, 74, 0.06)',
    };

    if (multiline) {
      return (
        <textarea
          ref={textareaRef}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={3}
          style={{ ...baseStyle, width: '100%', padding: '4px 8px', resize: 'vertical', minHeight: '3.5rem' }}
        />
      );
    }
    return (
      <input
        ref={inputRef}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{ ...baseStyle, padding: '2px 6px', width: '100%' }}
      />
    );
  }

  return (
    <Tag
      onClick={openEditor}
      style={{
        ...style,
        cursor: 'pointer',
        outline: isDirty ? '2px solid #16a34a' : '2px solid rgba(45, 95, 84, 0.4)',
        outlineOffset: '2px',
        borderRadius: '3px',
        display: 'inline',
      }}
      className={className}
      title={isDirty ? '✎ Modifié — cliquez pour éditer' : '✎ Cliquez pour modifier'}
    >
      {displayValue}
      {isDirty && (
        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', marginLeft: '4px', verticalAlign: 'super', fontSize: '0.5em', flexShrink: 0 }} />
      )}
    </Tag>
  );
}
