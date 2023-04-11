import "./styles/BottomButtonBar.css";

import { useRef } from "react";

import Button from "./Button.js";

function BottomButtonBar({
  disabledCopyButton,
  disabledCutButton,
  disabledPasteButton,
  disabledResetClipboardDataButton,
  disabledExtractButton,
  disabledHighlightAllButton,
  disabledRenameButton,
  disabledDeleteButton,
  hideDownloadManager,
  hideInfobar,
  clickedButtonName,
  onCopy,
  onCut,
  onPaste,
  onResetClipboardData,
  onExtract,
  onHighlightAll,
  onRename,
  onRemove,
  onMove,
  onUpdateHeight,
  onClickedButton,
  constants,
  messages
}) {
  const previousTouchClientY = useRef(0);

  function handleTouchMove(event) {
    const { clientY } = event.changedTouches[0];
    if (previousTouchClientY.current) {
      const deltaY = clientY - previousTouchClientY.current;
      onMove(deltaY);
    } else {
      previousTouchClientY.current = clientY;
    }
  }

  function handleTouchEnd() {
    previousTouchClientY.current = 0;
    onUpdateHeight();
  }

  return (
    <div
      className="button-bar button-bar-bottom"
      role="toolbar"
      aria-label="Highlighted entry commands"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(event) => event.preventDefault()}
      style={hideInfobar && hideDownloadManager ? { borderBlockEnd: 0 } : null}
    >
      <div className="button-group">
        <HighlightAllButton
          disabled={disabledHighlightAllButton}
          clickedButtonName={clickedButtonName}
          onHighlightAll={onHighlightAll}
          onClickedButton={onClickedButton}
          constants={constants}
          messages={messages}
        />
        <ExtractEntryButton
          disabled={disabledExtractButton}
          clickedButtonName={clickedButtonName}
          onExtract={onExtract}
          onClickedButton={onClickedButton}
          constants={constants}
          messages={messages}
        />
        <RenameEntryButton
          disabled={disabledRenameButton}
          clickedButtonName={clickedButtonName}
          onRename={onRename}
          onClickedButton={onClickedButton}
          constants={constants}
          messages={messages}
        />
        <DeleteEntryButton
          disabled={disabledDeleteButton}
          clickedButtonName={clickedButtonName}
          onRemove={onRemove}
          onClickedButton={onClickedButton}
          constants={constants}
          messages={messages}
        />
      </div>
      <div className="button-group">
        <CopyEntryButton
          disabled={disabledCopyButton}
          clickedButtonName={clickedButtonName}
          onCopy={onCopy}
          onClickedButton={onClickedButton}
          constants={constants}
          messages={messages}
        />
        <CutEntryButton
          disabled={disabledCutButton}
          clickedButtonName={clickedButtonName}
          onCut={onCut}
          onClickedButton={onClickedButton}
          constants={constants}
          messages={messages}
        />
        <PasteEntryButton
          disabled={disabledPasteButton}
          clickedButtonName={clickedButtonName}
          onPaste={onPaste}
          onClickedButton={onClickedButton}
          constants={constants}
          messages={messages}
        />
        <ResetClipboardDataButton
          disabled={disabledResetClipboardDataButton}
          onResetClipboardData={onResetClipboardData}
          messages={messages}
        />
      </div>
    </div>
  );
}

function CopyEntryButton({
  disabled,
  clickedButtonName,
  onCopy,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.COPY_BUTTON_NAME}
      title={messages.COPY_BUTTON_TOOLTIP}
      label={messages.COPY_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onCopy}
      onClickedButton={onClickedButton}
    />
  );
}

function CutEntryButton({
  disabled,
  clickedButtonName,
  onCut,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.CUT_BUTTON_NAME}
      title={messages.CUT_BUTTON_TOOLTIP}
      label={messages.CUT_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onCut}
      onClickedButton={onClickedButton}
    />
  );
}

function PasteEntryButton({
  disabled,
  clickedButtonName,
  onPaste,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.PASTE_BUTTON_NAME}
      title={messages.PASTE_BUTTON_TOOLTIP}
      label={messages.PASTE_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onPaste}
      onClickedButton={onClickedButton}
    />
  );
}

function ResetClipboardDataButton({
  disabled,
  onResetClipboardData,
  messages
}) {
  return (
    <Button
      label={messages.RESET_CLIPBOARD_BUTTON_LABEL}
      disabled={disabled}
      onClick={onResetClipboardData}
    />
  );
}

function HighlightAllButton({
  disabled,
  clickedButtonName,
  onHighlightAll,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.HIGHLIGHT_ALL_BUTTON_NAME}
      title={messages.HIGHLIGHT_ALL_BUTTON_TOOLTIP}
      label={messages.HIGHLIGHT_ALL_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onHighlightAll}
      onClickedButton={onClickedButton}
    />
  );
}

function ExtractEntryButton({
  disabled,
  clickedButtonName,
  onExtract,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.EXTRACT_BUTTON_NAME}
      title={messages.EXTRACT_BUTTON_TOOLTIP}
      label={messages.EXTRACT_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onExtract}
      onClickedButton={onClickedButton}
    />
  );
}

function RenameEntryButton({
  disabled,
  clickedButtonName,
  onRename,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.RENAME_BUTTON_NAME}
      title={messages.RENAME_BUTTON_TOOLTIP}
      label={messages.RENAME_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onRename}
      onClickedButton={onClickedButton}
    />
  );
}

function DeleteEntryButton({
  disabled,
  clickedButtonName,
  onRemove,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.DELETE_BUTTON_NAME}
      title={messages.DELETE_BUTTON_TOOLTIP}
      label={messages.DELETE_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onRemove}
      onClickedButton={onClickedButton}
    />
  );
}

export default BottomButtonBar;
