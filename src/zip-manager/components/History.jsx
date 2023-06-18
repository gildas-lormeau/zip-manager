import { BackButton, ForwardButton } from "./Buttons.jsx";

function History({
  disabledBackButton,
  disabledForwardButton,
  clickedButtonName,
  onNavigateBack,
  onNavigateForward,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <span className="history-buttons">
      <BackButton
        disabled={disabledBackButton}
        clickedButtonName={clickedButtonName}
        onNavigateBack={onNavigateBack}
        onClickedButton={onClickedButton}
        constants={constants}
        messages={messages}
      />
      <ForwardButton
        disabled={disabledForwardButton}
        clickedButtonName={clickedButtonName}
        onNavigateForward={onNavigateForward}
        onClickedButton={onClickedButton}
        constants={constants}
        messages={messages}
      />
    </span>
  );
}

export default History;
