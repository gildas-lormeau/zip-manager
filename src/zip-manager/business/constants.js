const ACTION_KEY = " ";
const ENTER_KEY = "Enter";
const TAB_KEY = "Tab";
const CUT_KEY = "x";
const COPY_KEY = "c";
const EXTRACT_KEY = "Enter";
const RENAME_KEY = "r";
const PASTE_KEY = "v";
const CREATE_FOLDER_KEY = "d";
const ADD_FILES_KEY = "f";
const IMPORT_ZIP_KEY = "i";
const EXPORT_ZIP_KEY = "e";
const HIGHLIGHT_ALL_KEY = "a";
const DELETE_KEYS = ["Backspace", "Delete"];
const DOWN_KEY = "ArrowDown";
const UP_KEY = "ArrowUp";
const LEFT_KEY = "ArrowLeft";
const RIGHT_KEY = "ArrowRight";
const PAGE_UP_KEY = "PageUp";
const PAGE_DOWN_KEY = "PageDown";
const HOME_KEY = "Home";
const END_KEY = "End";
const BACK_KEY = "ArrowLeft";
const FORWARD_KEY = "ArrowRight";
const DEFAULT_MIME_TYPE = "application/octet-stream";
const OPTIONS_DEFAULT_SKIN = "skin-default";
const OPTIONS_DOS_SKIN = "skin-dos";
const DEFAULT_OPTIONS = {
  accentColor: "#FF672E",
  skin: OPTIONS_DEFAULT_SKIN,
  hideNavigationBar: false,
  hideDownloadManager: false,
  hideInfobar: false,
  bufferedWrite: true,
  checkSignature: false,
  keepOrder: true,
  maxWorkers: 2,
  chunkSize: 512 * 1024,
  promptForExportPassword: true,
  defaultExportPassword: "",
  zoomFactor: 100
};
const ZIP_EXTENSION = ".zip";
const ZIP_EXTENSIONS = [
  ZIP_EXTENSION,
  ".docx",
  ".epub",
  ".jar",
  ".odp",
  ".ods",
  ".odt",
  ".pptx",
  ".xlsx",
  ".key",
  ".pages",
  ".numbers",
  ".apk",
  ".ipa"
];
const ZIP_EXTENSIONS_ACCEPT = {
  "application/zip": [ZIP_EXTENSION],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx"
  ],
  "application/epub+zip": [".epub"],
  "application/java-archive": [".jar"],
  "application/vnd.oasis.opendocument.presentation": [".odp"],
  "application/vnd.oasis.opendocument.spreadsheet": [".ods"],
  "application/vnd.oasis.opendocument.text": [".odt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx"
  ],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx"
  ],
  "application/vnd.apple.keynote": [".key"],
  "application/vnd.apple.pages": [".pages"],
  "application/vnd.apple.numbers": [".numbers"],
  "application/vnd.android.package-archive": [".apk"],
  "application/x-ios-app": [".ipa"]
};
const ZIP_EXTENSIONS_ACCEPT_STRING = ZIP_EXTENSIONS.join(",");
const LONG_TOUCH_DELAY = 750;
const CREATE_FOLDER_BUTTON_NAME = "create-folder-button";
const ADD_FILES_BUTTON_NAME = "add-files-button";
const IMPORT_ZIP_BUTTON_NAME = "import-zip-button";
const EXPORT_ZIP_BUTTON_NAME = "export-zip-button";
const COPY_BUTTON_NAME = "copy-button";
const CUT_BUTTON_NAME = "cut-button";
const PASTE_BUTTON_NAME = "paste-button";
const EXTRACT_BUTTON_NAME = "extract-button";
const HIGHLIGHT_ALL_BUTTON_NAME = "select-all";
const RENAME_BUTTON_NAME = "rename-button";
const DELETE_BUTTON_NAME = "delete-entry-button";
const BACK_BUTTON_NAME = "back-button";
const FORWARD_BUTTON_NAME = "forward-button";
const OPTIONS_KEY_NAME = "options";
const FONT_SIZE_PROPERTY_NAME = "font-size";
const NO_ENTRIES_CUSTOM_PROPERTY_NAME = "--message-drag-and-drop-entries";
const FOLDER_SEPARATOR_CUSTOM_PROPERTY_NAME = "--folder-separator";
const FOLDER_SEPARATOR = "/";
const APP_CLASSNAME = "main-container";
const INFOBAR_HIDDEN_CLASSNAME = "hidden-footer";
const DOWNLOAD_MANAGER_HIDDEN_CLASSNAME = "hidden-downloads";
const APP_LOADING_ATTRIBUTE_NAME = "app-loading";
const LOW_RES_FFT = 32;
const HIGH_RES_FFT = 128;
const FFT_RESOLUTIONS = {
  [OPTIONS_DEFAULT_SKIN]: HIGH_RES_FFT,
  [OPTIONS_DOS_SKIN]: LOW_RES_FFT
};

export {
  ACTION_KEY,
  ENTER_KEY,
  TAB_KEY,
  CUT_KEY,
  COPY_KEY,
  EXTRACT_KEY,
  RENAME_KEY,
  PASTE_KEY,
  CREATE_FOLDER_KEY,
  ADD_FILES_KEY,
  IMPORT_ZIP_KEY,
  EXPORT_ZIP_KEY,
  HIGHLIGHT_ALL_KEY,
  DELETE_KEYS,
  DOWN_KEY,
  UP_KEY,
  LEFT_KEY,
  RIGHT_KEY,
  PAGE_UP_KEY,
  PAGE_DOWN_KEY,
  HOME_KEY,
  END_KEY,
  BACK_KEY,
  FORWARD_KEY,
  DEFAULT_MIME_TYPE,
  DEFAULT_OPTIONS,
  ZIP_EXTENSION,
  ZIP_EXTENSIONS,
  ZIP_EXTENSIONS_ACCEPT,
  ZIP_EXTENSIONS_ACCEPT_STRING,
  LONG_TOUCH_DELAY,
  CREATE_FOLDER_BUTTON_NAME,
  ADD_FILES_BUTTON_NAME,
  IMPORT_ZIP_BUTTON_NAME,
  EXPORT_ZIP_BUTTON_NAME,
  COPY_BUTTON_NAME,
  CUT_BUTTON_NAME,
  PASTE_BUTTON_NAME,
  EXTRACT_BUTTON_NAME,
  HIGHLIGHT_ALL_BUTTON_NAME,
  RENAME_BUTTON_NAME,
  DELETE_BUTTON_NAME,
  BACK_BUTTON_NAME,
  FORWARD_BUTTON_NAME,
  OPTIONS_KEY_NAME,
  FONT_SIZE_PROPERTY_NAME,
  NO_ENTRIES_CUSTOM_PROPERTY_NAME,
  FOLDER_SEPARATOR_CUSTOM_PROPERTY_NAME,
  FOLDER_SEPARATOR,
  APP_CLASSNAME,
  INFOBAR_HIDDEN_CLASSNAME,
  DOWNLOAD_MANAGER_HIDDEN_CLASSNAME,
  APP_LOADING_ATTRIBUTE_NAME,
  OPTIONS_DEFAULT_SKIN,
  OPTIONS_DOS_SKIN,
  FFT_RESOLUTIONS
};
