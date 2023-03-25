import { fs } from "@zip.js/zip.js";

const { FS } = fs;

function createZipFileSystem() {
  return new FS();
}

export { createZipFileSystem };
