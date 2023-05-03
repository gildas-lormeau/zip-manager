/* global self, URL, Response, caches */
/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  MAINPAGE_REDIRECT_PATH,
  SHARED_FILES_RELATIVE_PATH,
  SHARED_FILES_CACHE_ID,
  SHARED_FILES_FORM_PATH,
  MIDI_TRACKS_PATH,
  MIDI_TRACK_PATH_REGEXP,
  MUSIC_FILE_CONTENT_TYPES
} from "./zip-manager/business/constants.js";
importScripts("./assets/lib/zip-no-worker-inflate.min.js");

clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
self.skipWaiting();

registerRoute(SHARED_FILES_RELATIVE_PATH, getSharedFiles, "GET");
registerRoute(SHARED_FILES_RELATIVE_PATH, setSharedFiles, "POST");
registerRoute(MIDI_TRACK_PATH_REGEXP, getMusicTrack, "GET");

async function setSharedFiles({ event }) {
  const formData = await event.request.formData();
  const cache = await caches.open(SHARED_FILES_CACHE_ID);
  await cache.put(
    new URL(SHARED_FILES_FORM_PATH, self.location).href,
    new Response(formData)
  );
  return Response.redirect(MAINPAGE_REDIRECT_PATH, 303);
}

function getSharedFiles({ event }) {
  event.respondWith(getSharedFilesResponse());
}

async function getSharedFilesResponse() {
  const cache = await caches.open(SHARED_FILES_CACHE_ID);
  const response = await cache.match(SHARED_FILES_FORM_PATH);
  if (response) {
    await cache.delete(SHARED_FILES_FORM_PATH);
    return response;
  }
}

async function getMusicTrack({ event }) {
  const zipReader = new zip.ZipReader((await fetch(MIDI_TRACKS_PATH)).body);
  const entries = await zipReader.getEntries();
  const fileEntryIndex = Number(event.request.url.match(/\d+$/)[0]);
  const fileEntry = entries[fileEntryIndex];
  const contentType = MUSIC_FILE_CONTENT_TYPES.find((info) =>
    fileEntry.filename.endsWith(info.extension)
  ).type;
  const data = await fileEntry.getData(new zip.BlobWriter(contentType));
  await zipReader.close();
  return new Response(data);
}
