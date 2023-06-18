import "./styles/NavigationBar.css";

import History from "./History.jsx";
import Breadcrumb from "./Breadcrumb.jsx";

function NavigationBar({
  hidden,
  selectedFolder,
  ancestorFolders,
  disabledBackButton,
  disabledForwardButton,
  clickedButtonName,
  onNavigateBack,
  onNavigateForward,
  onGoIntoFolder,
  onClickedButton,
  constants,
  messages
}) {
  if (hidden) {
    return;
  } else {
    return (
      <div
        className="navigation-bar"
        role="toolbar"
        aria-label={messages.FOLDERS_LABEL}
      >
        <History
          disabledBackButton={disabledBackButton}
          disabledForwardButton={disabledForwardButton}
          clickedButtonName={clickedButtonName}
          onNavigateBack={onNavigateBack}
          onNavigateForward={onNavigateForward}
          onClickedButton={onClickedButton}
          constants={constants}
          messages={messages}
        />
        <Breadcrumb
          folder={selectedFolder}
          ancestorFolders={ancestorFolders}
          onGoIntoFolder={onGoIntoFolder}
          constants={constants}
          messages={messages}
        />
      </div>
    );
  }
}

export default NavigationBar;
