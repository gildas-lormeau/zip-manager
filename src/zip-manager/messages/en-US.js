const PARENT_FOLDER_LABEL = "..";
const ROOT_FOLDER_LABEL = "<root>";
const ROOT_ZIP_FILENAME = "Download.zip";
const KEYS_SEPARATOR_LABEL = ", ";
const PARENT_FOLDER_TOOLTIP = "Parent directory";

const SHORTCUT_LABEL = "Shortcut: ";
const CTRL_KEY_LABEL = "⌘/ctrl-";
const ALT_KEY_LABEL = "alt-";
const SPACE_KEY_LABEL = "space";
const ARROW_LEFT_KEY_LABEL = "left";
const ARROW_RIGHT_KEY_LABEL = "right";
const SIZE_LABEL = "Size: ";
const UNCOMPRESSED_SIZE_LABEL = "Uncompressed size: ";
const COMPRESSED_SIZE_LABEL = "Compressed size: ";
const LAST_MOD_DATE_LABEL = "Last mod. date: ";

const COPY_BUTTON_TOOLTIP = SHORTCUT_LABEL + CTRL_KEY_LABEL + "c";
const CUT_BUTTON_TOOLTIP = SHORTCUT_LABEL + CTRL_KEY_LABEL + "x";
const PASTE_BUTTON_TOOLTIP = SHORTCUT_LABEL + CTRL_KEY_LABEL + "v";
const RENAME_BUTTON_TOOLTIP = SHORTCUT_LABEL + CTRL_KEY_LABEL + "r";
const DELETE_BUTTON_TOOLTIP =
  SHORTCUT_LABEL + ["backspace", "delete"].join(KEYS_SEPARATOR_LABEL);
const CREATE_FOLDER_BUTTON_TOOLTIP = SHORTCUT_LABEL + CTRL_KEY_LABEL + "d";
const ADD_FILES_BUTTON_TOOLTIP = SHORTCUT_LABEL + CTRL_KEY_LABEL + "f";
const IMPORT_ZIP_BUTTON_TOOLTIP = SHORTCUT_LABEL + CTRL_KEY_LABEL + "i";
const EXPORT_ZIP_BUTTON_TOOLTIP = SHORTCUT_LABEL + CTRL_KEY_LABEL + "e";
const BACK_BUTTON_TOOLTIP =
  SHORTCUT_LABEL + ALT_KEY_LABEL + ARROW_LEFT_KEY_LABEL;
const FORWARD_BUTTON_TOOLTIP =
  SHORTCUT_LABEL + ALT_KEY_LABEL + ARROW_RIGHT_KEY_LABEL;

const CREATE_FOLDER_BUTTON_LABEL = "Create directory";
const ADD_FILES_BUTTON_LABEL = "Add files";
const IMPORT_ZIP_BUTTON_LABEL = "Import zip";
const EXPORT_ZIP_BUTTON_LABEL = "Export zip";
const RESET_BUTTON_LABEL = "Reset";
const BACK_BUTTON_LABEL = "<";
const FORWARD_BUTTON_LABEL = ">";
const DOWNLOAD_BUTTON_LABEL = "↵";
const ENTER_FOLDER_BUTTON_LABEL = "↓";
const COPY_BUTTON_LABEL = "Copy";
const CUT_BUTTON_LABEL = "Cut";
const PASTE_BUTTON_LABEL = "Paste";
const RESET_CLIPBOARD_BUTTON_LABEL = "Reset clipboard";
const RENAME_BUTTON_LABEL = "Rename";
const DELETE_BUTTON_LABEL = "Delete";
const ABORT_DOWNLOAD_BUTTON_LABEL = "✕";
const DIALOG_CANCEL_BUTTON_LABEL = "Cancel";

const EXPORT_ZIP_TITLE = "Export zip file";
const EXPORT_ZIP_FILENAME_LABEL = "Filename:";
const EXPORT_ZIP_PASSWORD_LABEL = "Password:";
const EXPORT_ZIP_DIALOG_BUTTON_LABEL = "Export";
const EXTRACT_TITLE = "Extract file";
const EXTRACT_FILENAME_LABEL = "Filename:";
const EXTRACT_PASSWORD_LABEL = "Password:";
const EXTRACT_DIALOG_BUTTON_LABEL = "Extract";
const RENAME_TITLE = "Rename file";
const RENAME_FILENAME_LABEL = "New filename:";
const RENAME_DIALOG_BUTTON_LABEL = "Rename";
const CREATE_FOLDER_TITLE = "Create folder";
const CREATE_FOLDER_NAME_LABEL = "Folder name:";
const CREATE_FOLDER_DIALOG_BUTTON_LABEL = "Create";
const RESET_TITLE = "Reset filesystem";
const RESET_MESSAGE = "Please confirm the reset";
const RESET_DIALOG_BUTTON_LABEL = "Reset";
const DELETE_ENTRY_TITLE = "Delete file";
const DELETE_ENTRY_MESSAGE = "Please confirm the deletion";
const DELETE_ENTRY_DIALOG_BUTTON_LABEL = "Delete";
const ZIP_FILES_DESCRIPTION_LABEL = "Zip files";

export {
  ROOT_ZIP_FILENAME,
  SHORTCUT_LABEL,
  CTRL_KEY_LABEL,
  SPACE_KEY_LABEL,
  ARROW_LEFT_KEY_LABEL,
  ARROW_RIGHT_KEY_LABEL,
  PARENT_FOLDER_TOOLTIP,
  CREATE_FOLDER_BUTTON_TOOLTIP,
  ADD_FILES_BUTTON_TOOLTIP,
  IMPORT_ZIP_BUTTON_TOOLTIP,
  EXPORT_ZIP_BUTTON_TOOLTIP,
  BACK_BUTTON_TOOLTIP,
  FORWARD_BUTTON_TOOLTIP,
  COPY_BUTTON_TOOLTIP,
  CUT_BUTTON_TOOLTIP,
  PASTE_BUTTON_TOOLTIP,
  RENAME_BUTTON_TOOLTIP,
  DELETE_BUTTON_TOOLTIP,
  ROOT_FOLDER_LABEL,
  PARENT_FOLDER_LABEL,
  COPY_BUTTON_LABEL,
  CUT_BUTTON_LABEL,
  PASTE_BUTTON_LABEL,
  RESET_CLIPBOARD_BUTTON_LABEL,
  RENAME_BUTTON_LABEL,
  DELETE_BUTTON_LABEL,
  ABORT_DOWNLOAD_BUTTON_LABEL,
  DOWNLOAD_BUTTON_LABEL,
  ENTER_FOLDER_BUTTON_LABEL,
  BACK_BUTTON_LABEL,
  FORWARD_BUTTON_LABEL,
  CREATE_FOLDER_BUTTON_LABEL,
  ADD_FILES_BUTTON_LABEL,
  IMPORT_ZIP_BUTTON_LABEL,
  EXPORT_ZIP_BUTTON_LABEL,
  RESET_BUTTON_LABEL,
  KEYS_SEPARATOR_LABEL,
  ZIP_FILES_DESCRIPTION_LABEL,
  SIZE_LABEL,
  UNCOMPRESSED_SIZE_LABEL,
  COMPRESSED_SIZE_LABEL,
  LAST_MOD_DATE_LABEL,
  EXPORT_ZIP_TITLE,
  EXPORT_ZIP_FILENAME_LABEL,
  EXPORT_ZIP_PASSWORD_LABEL,
  DIALOG_CANCEL_BUTTON_LABEL,
  EXTRACT_TITLE,
  EXTRACT_FILENAME_LABEL,
  EXTRACT_PASSWORD_LABEL,
  RENAME_TITLE,
  RENAME_FILENAME_LABEL,
  EXPORT_ZIP_DIALOG_BUTTON_LABEL,
  RENAME_DIALOG_BUTTON_LABEL,
  EXTRACT_DIALOG_BUTTON_LABEL,
  CREATE_FOLDER_TITLE,
  CREATE_FOLDER_NAME_LABEL,
  CREATE_FOLDER_DIALOG_BUTTON_LABEL,
  RESET_TITLE,
  RESET_MESSAGE,
  RESET_DIALOG_BUTTON_LABEL,
  DELETE_ENTRY_TITLE,
  DELETE_ENTRY_MESSAGE,
  DELETE_ENTRY_DIALOG_BUTTON_LABEL
};
