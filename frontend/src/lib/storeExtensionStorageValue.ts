export const storeExtensionStorageValue = (
  key: string,
  value: unknown,
  callback?: () => void
) => {
  window.postMessage({
    action: "setValue",
    key: key,
    value: value,
  });

  window.addEventListener("message", (event) => {
    if (
      event.data.action === "responseSetValue" &&
      event.data.content === 200
    ) {
      if (callback) {
        callback();
      }
    }
  });
};
