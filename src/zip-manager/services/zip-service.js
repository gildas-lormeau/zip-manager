import { ERR_ENCRYPTED, fs } from "@zip.js/zip.js";

const { FS } = fs;

function createZipFileSystem() {
  return new FS();
}

function passwordNeeded(error) {
  return error.message === ERR_ENCRYPTED;
}

export { createZipFileSystem, passwordNeeded };
