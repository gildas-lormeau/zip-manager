/* global self, process, URL, Response, caches */
/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  MAINPAGE_REDIRECT_PATH,
  SHARED_FILES_RELATIVE_PATH,
  SHARED_FILES_CACHE_ID,
  SHARED_FILES_FORM_PATH
} from "./zip-manager/business/constants.js";

clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
self.skipWaiting();

registerRoute(SHARED_FILES_RELATIVE_PATH, getSharedFiles, "GET");
registerRoute(SHARED_FILES_RELATIVE_PATH, setSharedFiles, "POST");

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
