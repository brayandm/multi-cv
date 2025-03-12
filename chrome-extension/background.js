function getCookieFromStorage() {
  chrome.storage.local.get("auth_cookie", function (result) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "responseAuthCookie",
          content: result.auth_cookie,
        });
      }
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getAuthCookie") {
    console.log("Received request to get auth_cookie.");
    getCookieFromStorage();
  }
});
