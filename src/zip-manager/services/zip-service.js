import { ERR_ENCRYPTED, fs, configure } from "@zip.js/zip.js";

const { FS } = fs;

function createZipFileSystem() {
  return new FS();
}

function passwordNeeded(error) {
  return error.message === ERR_ENCRYPTED;
}

export { createZipFileSystem, configure, passwordNeeded };
