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
  flashingButton,
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
          flashingButton={flashingButton}
          onCopy={onCopy}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          constants={constants}
          messages={messages}
        />
        <CutEntryButton
          disabled={disabledCutButton}
          flashingButton={flashingButton}
          onCut={onCut}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          constants={constants}
          messages={messages}
        />
        <PasteEntryButton
          disabled={disabledPasteButton}
          flashingButton={flashingButton}
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
          flashingButton={flashingButton}
          onRename={onRename}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          constants={constants}
          messages={messages}
        />
        <DeleteEntryButton
          disabled={disabledDeleteButton}
          flashingButton={flashingButton}
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
  flashingButton,
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
      flashingButton={flashingButton}
      onClick={onCopy}
      onFlashingAnimationEnd={onFlashingAnimationEnd}
    />
  );
}

function CutEntryButton({
  disabled,
  flashingButton,
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
      flashingButton={flashingButton}
      onClick={onCut}
      onFlashingAnimationEnd={onFlashingAnimationEnd}
    />
  );
}

function PasteEntryButton({
  disabled,
  flashingButton,
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
      flashingButton={flashingButton}
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
    <button onClick={onResetClipboardData} disabled={disabled}>
      {messages.RESET_CLIPBOARD_BUTTON_LABEL}
    </button>
  );
}

function RenameEntryButton({
  disabled,
  flashingButton,
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
      flashingButton={flashingButton}
      onClick={onRename}
      onFlashingAnimationEnd={onFlashingAnimationEnd}
    />
  );
}

function DeleteEntryButton({
  disabled,
  flashingButton,
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
      flashingButton={flashingButton}
      onClick={onRemove}
      onFlashingAnimationEnd={onFlashingAnimationEnd}
    />
  );
}

export default BottomButtonBar;
