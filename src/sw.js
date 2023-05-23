/* global self, URL, Response, caches, importScripts, zip */
/* eslint-disable no-restricted-globals */

import { cacheNames, clientsClaim } from "workbox-core";
import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  getCacheKeyForURL
} from "workbox-precaching";
import { registerRoute } from "workbox-routing";

import {
  MAINPAGE_REDIRECT_PATH,
  SHARED_FILES_RELATIVE_PATH,
  SHARED_FILES_CACHE_ID,
  SHARED_FILES_FORM_PATH
} from "./zip-manager/services/share-target-service-constants.js";
import {
  MUSIC_TRACKS_PATH,
  MUSIC_TRACK_PATH_REGEXP,
  MUSIC_TRACK_INDEX_REGEXP,
  MUSIC_FILE_CONTENT_TYPES
} from "./zip-manager/services/music-service-constants.js";

const GET_REQUEST = "GET";
const POST_REQUEST = "POST";

importScripts("./assets/lib/zip-no-worker-inflate.min.js");
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
self.skipWaiting();
registerRoute(SHARED_FILES_RELATIVE_PATH, getSharedFiles, GET_REQUEST);
registerRoute(SHARED_FILES_RELATIVE_PATH, setSharedFiles, POST_REQUEST);
registerRoute(MUSIC_TRACK_PATH_REGEXP, getMusicTrack, GET_REQUEST);
clientsClaim();

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
  const cache = await caches.open(cacheNames.precache);
  const response = await cache.match(getCacheKeyForURL(MUSIC_TRACKS_PATH));
  const zipReader = new zip.ZipReader(response.body);
  const entries = await zipReader.getEntries();
  const fileEntryIndex = Number(
    event.request.url.match(MUSIC_TRACK_INDEX_REGEXP)[0]
  );
  const fileEntry = entries[fileEntryIndex];
  const contentType = MUSIC_FILE_CONTENT_TYPES.find((info) =>
    fileEntry.filename.endsWith(info.extension)
  ).type;
  const data = await fileEntry.getData(new zip.BlobWriter(contentType));
  await zipReader.close();
  return new Response(data);
}
