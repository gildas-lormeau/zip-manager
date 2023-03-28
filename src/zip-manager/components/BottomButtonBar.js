import "./styles/BottomButtonBar.css";

import { useRef } from "react";

import Button from "./Button.js";

function BottomButtonBar({
  disabledCopyButton,
  disabledCutButton,
  disabledPasteButton,
  disabledResetClipboardDataButton,
  disabledRenameButton,
  disabledDeleteButton,
  clickedButtonName,
  onCopy,
  onCut,
  onPaste,
  onResetClipboardData,
  onRename,
  onRemove,
  onMove,
  onStopMove,
  onFlashingAnimationEnd,
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
    onStopMove();
  }

  return (
    <div
      className="button-bar button-bar-bottom"
      role="toolbar"
      aria-label="Highlighted entry commands"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="button-group">
        <CopyEntryButton
          disabled={disabledCopyButton}
          clickedButtonName={clickedButtonName}
          onCopy={onCopy}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          constants={constants}
          messages={messages}
        />
        <CutEntryButton
          disabled={disabledCutButton}
          clickedButtonName={clickedButtonName}
          onCut={onCut}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          constants={constants}
          messages={messages}
        />
        <PasteEntryButton
          disabled={disabledPasteButton}
          clickedButtonName={clickedButtonName}
          onPaste={onPaste}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          constants={constants}
          messages={messages}
        />
        <ResetClipboardDataButton
          disabled={disabledResetClipboardDataButton}
          onResetClipboardData={onResetClipboardData}
          messages={messages}
        />
      </div>
      <div className="button-group">
        <RenameEntryButton
          disabled={disabledRenameButton}
          clickedButtonName={clickedButtonName}
          onRename={onRename}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          constants={constants}
          messages={messages}
        />
        <DeleteEntryButton
          disabled={disabledDeleteButton}
          clickedButtonName={clickedButtonName}
          onRemove={onRemove}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          constants={constants}
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
  onFlashingAnimationEnd,
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
      onFlashingAnimationEnd={onFlashingAnimationEnd}
    />
  );
}

function CutEntryButton({
  disabled,
  clickedButtonName,
  onCut,
  onFlashingAnimationEnd,
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
      onFlashingAnimationEnd={onFlashingAnimationEnd}
    />
  );
}

function PasteEntryButton({
  disabled,
  clickedButtonName,
  onPaste,
  onFlashingAnimationEnd,
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
      onFlashingAnimationEnd={onFlashingAnimationEnd}
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

function RenameEntryButton({
  disabled,
  clickedButtonName,
  onRename,
  onFlashingAnimationEnd,
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
      onFlashingAnimationEnd={onFlashingAnimationEnd}
    />
  );
}

function DeleteEntryButton({
  disabled,
  clickedButtonName,
  onRemove,
  onFlashingAnimationEnd,
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
      onFlashingAnimationEnd={onFlashingAnimationEnd}
    />
  );
}

export default BottomButtonBar;
