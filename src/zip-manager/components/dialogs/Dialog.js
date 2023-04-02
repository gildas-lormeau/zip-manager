import { useEffect, useRef } from "react";

function Dialog({
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
  }, [data, onOpen]);
  return (
    <dialog ref={dialogRef} onClose={onClose}>
      <form method="dialog" onSubmit={onSubmit} onReset={handleReset}>
        <div>{title}</div>
        <p>{children}</p>
        <div className="button-bar">
          {resetLabel && (
            <button type="reset" onClick={handleButtonReset}>
              {resetLabel}
            </button>
          )}
          {cancelLabel && <button type="reset">{cancelLabel}</button>}
          <button type="submit">{submitLabel}</button>
        </div>
      </form>
    </dialog>
  );
}

export default Dialog;
