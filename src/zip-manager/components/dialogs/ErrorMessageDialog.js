import Dialog from "./Dialog";

function ErrorMessageDialog({ data, onClose, messages }) {
  return (
    <Dialog data={data} title={messages.ERROR_TITLE} onClose={onClose}>
      <p>
        <label>{data?.message}</label>
      </p>
      <div className="button-bar">
        <button type="submit">{messages.DIALOG_OK_BUTTON_LABEL}</button>
      </div>
    </Dialog>
  );
}

export default ErrorMessageDialog;
