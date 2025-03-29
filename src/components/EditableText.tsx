import React, { useState, useRef, useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import { changeBottom } from "../utils";
import {
  FormatBold,
  FormatItalic,
  StrikethroughS,
  Visibility,
  Edit,
  FormatQuote,
  FormatListBulleted,
  Title,
} from "@mui/icons-material";
import { marked } from "marked";

interface EditableTextProps {
  initialText?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ initialText = "" }) => {
  const [text, setText] = useState<string>(initialText);
  const [html, setHtml] = useState<string>("");
  const [isEditing, setIsEditing] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const cursorPositionRef = useRef<number>(0);

  // Преобразуем Markdown в HTML
  useEffect(() => {
    setHtml(marked.parse(text) as string);
  }, [text]);

  // Сохранение позиции курсора
  const saveCursorPosition = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      cursorPositionRef.current = preCaretRange.toString().length;
    }
  };

  // Восстановление позиции курсора
  const restoreCursorPosition = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    const range = document.createRange();
    let node = editorRef.current.firstChild;
    let offset = 0;
    let count = 0;

    while (node && count < cursorPositionRef.current) {
      if (node.nodeType === Node.TEXT_NODE) {
        const textLength = node.textContent?.length || 0;
        if (count + textLength >= cursorPositionRef.current) {
          offset = cursorPositionRef.current - count;
          break;
        }
        count += textLength;
      }
      node = node.nextSibling;
    }

    if (node) {
      range.setStart(node, offset);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  // Обработчик изменения текста
  const handleInput = () => {
    saveCursorPosition();
    setText(editorRef.current?.innerText || "");
    // setTimeout(() => {
    //   alert("innerHeight: " + window.innerHeight);
    //   alert("visualViewport.height: " + window?.visualViewport?.height);
    // }, 1500);
  };

  // Восстанавливаем курсор после обновления состояния
  useEffect(() => {
    restoreCursorPosition();
  }, [text]);

  // Добавляем/удаляем форматирование
  const toggleMarkdownFormat = (symbol: string) => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const isFormatted =
      selectedText.startsWith(symbol) && selectedText.endsWith(symbol);
    const newText = isFormatted
      ? selectedText.slice(symbol.length, -symbol.length)
      : `${symbol}${selectedText}${symbol}`;

    saveCursorPosition();
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));
    setText(editorRef.current.innerText);
  };

  const toggleUnderline = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const isUnderlined =
      selectedText.startsWith("__") && selectedText.endsWith("__");
    const newText = isUnderlined
      ? selectedText.slice(2, -2)
      : `__${selectedText}__`;

    saveCursorPosition();
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));
    setText(editorRef.current.innerText);
  };

  const toggleHeading = (level: number) => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const headingSymbol = "#".repeat(level);
    const isHeading = selectedText.startsWith(headingSymbol);
    const newText = isHeading
      ? selectedText.slice(headingSymbol.length + 1)
      : `${headingSymbol} ${selectedText}`;

    saveCursorPosition();
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));
    setText(editorRef.current.innerText);
  };

  const toggleBulletList = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    // Разделяем текст на строки
    const lines = selectedText.split("\n");

    // Проверяем, является ли текст уже списком
    const isList = lines.every((line) => line.startsWith("- "));

    // Преобразуем текст в список или обратно
    const newText = isList
      ? lines.map((line) => line.slice(2)).join("\n") // Убираем маркеры
      : lines.map((line) => `- ${line}`).join("\n"); // Добавляем маркеры

    // Вставляем новый текст
    saveCursorPosition();
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));

    // Обновляем состояние текста
    setText(editorRef.current.innerText);
  };

  const toggleQuote = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const lines = selectedText.split("\n");
    const isQuote = lines.every((line) => line.startsWith("> "));
    const newText = isQuote
      ? lines.map((line) => line.slice(2)).join("\n")
      : lines.map((line) => `> ${line}`).join("\n");

    saveCursorPosition();
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));
    setText(editorRef.current.innerText);
  };

  return (
    <div className="w-full max-w-lg">
      {/* Режим просмотра */}
      {!isEditing && (
        <div
          className="p-2 overflow-x-hidden rounded-md text-white"
          dangerouslySetInnerHTML={{ __html: html }}
          style={{ minHeight: "60vh", maxHeight: "80vh" }}
        />
      )}

      {/* Режим редактирования */}
      {isEditing && (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="p-2 overflow-x-hidden rounded-md focus:outline-none text-white whitespace-pre-wrap"
          onInput={handleInput}
          style={{ minHeight: "60vh", maxHeight: "80vh" }}
        >
          {text}
        </div>
      )}

      {/* Кнопки */}
      <div
        className="flex gap-2 mt-2 fixed left-0 right-0 bg-gray-800"
        style={{ bottom: changeBottom() }}
      >
        <IconButton
          onClick={() => toggleMarkdownFormat("**")}
          size="small"
          color="inherit"
        >
          <FormatBold fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => toggleMarkdownFormat("*")}
          size="small"
          color="inherit"
        >
          <FormatItalic fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => toggleMarkdownFormat("~~")}
          size="small"
          color="inherit"
        >
          <StrikethroughS fontSize="small" />
        </IconButton>
        <IconButton onClick={toggleUnderline} size="small" color="inherit">
          <span style={{ fontSize: "18px", textDecoration: "underline" }}>
            U
          </span>
        </IconButton>
        <IconButton
          onClick={() => toggleHeading(1)}
          size="small"
          color="inherit"
        >
          <Title fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => toggleHeading(2)}
          size="small"
          color="inherit"
        >
          <Title fontSize="small" />
        </IconButton>
        <IconButton onClick={toggleBulletList} size="small" color="inherit">
          <FormatListBulleted fontSize="small" />
        </IconButton>
        <IconButton onClick={toggleQuote} size="small" color="inherit">
          <FormatQuote fontSize="small" />
        </IconButton>
        <Button
          variant="contained"
          onClick={() => setIsEditing(!isEditing)}
          size="small"
          color="inherit"
        >
          {isEditing ? "Отобразить" : "Редактировать"}
        </Button>
        <IconButton
          onClick={() => setIsEditing(false)}
          size="small"
          color="inherit"
        >
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => setIsEditing(true)}
          size="small"
          color="inherit"
        >
          <Edit fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};

export default EditableText;
