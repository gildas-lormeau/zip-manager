import { useEffect, useEffectEvent, useRef } from "react";

function Dialog({
  className,
  data,
  title,
  resetLabel,
  cancelLabel,
  submitLabel,
  children,
  onOpen,
  onSubmit,
  onReset,
  onClose
}) {
  const dialogRef = useRef(null);

  function handleCancel() {
    dialogRef.current.close();
  }

  const handleOpen = useEffectEvent(() => {
    if (onOpen) {
      onOpen();
    }
  });

  useEffect(() => {
    if (!dialogRef.current.open && data) {
      handleOpen();
      dialogRef.current.showModal();
    }
  }, [data]);
  return (
    <dialog className={className} ref={dialogRef} onClose={onClose}>
      <form method="dialog" onSubmit={onSubmit}>
        <div className="dialog-title">{title}</div>
        <p>{children}</p>
        <div className="button-bar">
          <div className="button-group">
            {resetLabel && (
              <button type="button" onClick={onReset}>
                {resetLabel}
              </button>
            )}
          </div>
          <div className="button-group">
            {cancelLabel && (
              <button type="button" onClick={handleCancel}>
                {cancelLabel}
              </button>
            )}
            <button type="submit">{submitLabel}</button>
          </div>
        </div>
      </form>
    </dialog>
  );
}

export default Dialog;
