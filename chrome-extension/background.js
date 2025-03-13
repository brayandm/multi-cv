function getExtensionStorage() {
  chrome.storage.local.get(null, function (result) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "responseExtensionStorage",
          content: result,
        });
      }
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getExtensionStorage") {
    console.log("Received request to get extension storage");
    getExtensionStorage();
  }
});
