import CreateFolderDialog from "./dialogs/CreateFolderDialog.jsx";
import ExportZipDialog from "./dialogs/ExportZipDialog.jsx";
import ExtractDialog from "./dialogs/ExtractDialog.jsx";
import RenameDialog from "./dialogs/RenameDialog.jsx";
import ResetDialog from "./dialogs/ResetDialog.jsx";
import DeleteEntriesDialog from "./dialogs/DeleteEntriesDialog.jsx";
import ErrorMessageDialog from "./dialogs/ErrorMessageDialog.jsx";
import ImportPasswordDialog from "./dialogs/ImportPasswordDialog.jsx";
import OptionsDialog from "./dialogs/OptionsDialog.jsx";
import ChooseActionDialog from "./dialogs/ChooseActionDialog.jsx";

function DialogsContainer({
  dialogs,
  hiddenExportPassword,
  messages,
  onCreateFolder,
  onCloseCreateFolder,
  onExportZip,
  onCloseExportZip,
  onExtract,
  onCloseExtract,
  onRename,
  onCloseRename,
  onReset,
  onCloseReset,
  onDeleteEntries,
  onCloseDeleteEntries,
  onCloseDisplayError,
  onCloseImportPassword,
  onSetOptions,
  onResetOptions,
  onCloseOptions,
  onImportZipFile,
  onAddFiles,
  onCloseChooseAction
}) {
  return (
    <>
      <CreateFolderDialog
        data={dialogs.createFolder}
        onCreateFolder={onCreateFolder}
        onClose={onCloseCreateFolder}
        messages={messages}
      />
      <ExportZipDialog
        data={dialogs.exportZip}
        hiddenPassword={hiddenExportPassword}
        onExportZip={onExportZip}
        onClose={onCloseExportZip}
        messages={messages}
      />
      <ExtractDialog
        data={dialogs.extract}
        onExtract={onExtract}
        onClose={onCloseExtract}
        messages={messages}
      />
      <RenameDialog
        data={dialogs.rename}
        onRename={onRename}
        onClose={onCloseRename}
        messages={messages}
      />
      <ResetDialog
        data={dialogs.reset}
        onReset={onReset}
        onClose={onCloseReset}
        messages={messages}
      />
      <DeleteEntriesDialog
        data={dialogs.deleteEntries}
        onDeleteEntries={onDeleteEntries}
        onClose={onCloseDeleteEntries}
        messages={messages}
      />
      <ErrorMessageDialog
        data={dialogs.displayError}
        onClose={onCloseDisplayError}
        messages={messages}
      />
      <ImportPasswordDialog
        data={dialogs.enterImportPassword}
        onClose={onCloseImportPassword}
        messages={messages}
      />
      <OptionsDialog
        data={dialogs.options}
        onSetOptions={onSetOptions}
        onResetOptions={onResetOptions}
        onClose={onCloseOptions}
        messages={messages}
      />
      <ChooseActionDialog
        data={dialogs.chooseAction}
        onImportZipFile={onImportZipFile}
        onAddFiles={onAddFiles}
        onClose={onCloseChooseAction}
        messages={messages}
      />
    </>
  );
}

export default DialogsContainer;
