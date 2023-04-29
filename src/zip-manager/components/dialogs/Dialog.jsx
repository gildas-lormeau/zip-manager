import { useEffect, useRef } from "react";

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

  function handleButtonReset(event) {
    event.preventDefault();
    onReset();
  }

  function handleReset() {
    dialogRef.current.close();
  }

  useEffect(() => {
    if (!dialogRef.current.open && data) {
      if (onOpen) {
        onOpen();
      }
      dialogRef.current.showModal();
    }
  }, [data]);
  return (
    <dialog className={className} ref={dialogRef} onClose={onClose}>
      <form method="dialog" onSubmit={onSubmit} onReset={handleReset}>
        <div className="dialog-title">{title}</div>
        <p>{children}</p>
        <div className="button-bar">
          <div className="button-group">
            {resetLabel && (
              <button type="reset" onClick={handleButtonReset}>
                {resetLabel}
              </button>
            )}
          </div>
          <div className="button-group">
            {cancelLabel && <button type="reset">{cancelLabel}</button>}
            <button type="submit">{submitLabel}</button>
          </div>
        </div>
      </form>
    </dialog>
  );
}

export default Dialog;
