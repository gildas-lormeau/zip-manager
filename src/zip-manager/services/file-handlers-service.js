/* global window, launchQueue */

function onOpenWith(callback) {
  if ("launchQueue" in window) {
    launchQueue.setConsumer((launchParams) => {
      getLaunchQueueConsumer(launchParams, callback);
    });
  }
}

async function getLaunchQueueConsumer(launchParams, callback) {
  if (launchParams.files.length) {
    await Promise.all(
      launchParams.files.map(async (handle) => callback(await handle.getFile()))
    );
  }
}

export { onOpenWith };
