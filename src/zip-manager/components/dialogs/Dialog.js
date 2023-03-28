import { useEffect, useRef } from "react";

function Dialog({ data, title, children, onOpen, onSubmit, onClose }) {
  const dialogRef = useRef(null);

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
        {children}
      </form>
    </dialog>
  );
}

export default Dialog;
