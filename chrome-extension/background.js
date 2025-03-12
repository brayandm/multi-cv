function setCookieFromStorage() {
  chrome.storage.local.get("auth_cookie", function (result) {
    if (result.auth_cookie) {
      chrome.cookies.set(
        {
          url: "https://multicv.space",
          name: result.auth_cookie.name,
          value: result.auth_cookie.value,
          expirationDate: result.auth_cookie.expiration_date,
          secure: true,
          domain: "multicv.space",
          path: "/",
        },
        function (cookie) {
          if (!cookie) {
            console.error("Failed to set cookie.");
          } else if (chrome.runtime.lastError) {
            console.error(
              "Error setting the cookie:",
              chrome.runtime.lastError
            );
          } else {
            console.log("Cookie set successfully:", cookie);
          }
        }
      );
    } else {
      console.warn("No auth_cookie found in storage.local.");
    }
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.auth_cookie) {
    console.log("auth_cookie changed, updating the cookie...");
    setCookieFromStorage();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setAuthCookie") {
    console.log("Received request to set auth cookie from content script.");
    setCookieFromStorage();
  }
});

setCookieFromStorage();
