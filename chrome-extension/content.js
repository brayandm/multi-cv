const isIframe = window.self !== window.top;

shouldInject = false;

isMultiCvIFrame = false;
isMultiCvWebsite = false;

if (
  isIframe &&
  (window.location.href.includes("https://dev.multicv.space") ||
    window.location.href.includes("https://multicv.space"))
) {
  shouldInject = true;
  isMultiCvIFrame = true;
}

if (
  !isIframe &&
  (window.location.href.includes("https://dev.multicv.space") ||
    window.location.href.includes("https://multicv.space"))
) {
  isMultiCvWebsite = true;
}

if (!isIframe) {
  shouldInject = true;
}

if (shouldInject) {
  const hostList = ["linkedin.com", "infojobs.net"];
  const IFRAME_WIDTH = "360px";

  if (isMultiCvIFrame || isMultiCvWebsite) {
    window.addEventListener("message", (event) => {
      if (event.data.action == "setValue") {
        const key = event.data.key;
        const value = event.data.value;

        chrome.storage.local.set({ key: value }, function () {
          window.postMessage(
            {
              action: "responsesetValue",
              content: 200,
            },
            event.origin
          );
        });
      }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "responseExtensionStorage") {
        const token = request.content;

        window.postMessage({
          action: "responseExtensionStorage",
          content: token,
        });
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        chrome.runtime.sendMessage({ action: "getExtensionStorage" });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.addEventListener("message", (event) => {
      if (event.data.action == "applicationStarted") {
        console.log("Message received from iframe");
        chrome.runtime.sendMessage({ action: "getExtensionStorage" });
      }
    });
  }

  const button = (() => {
    const button = document.createElement("div");
    button.classList.add("multicv-button");
    button.innerText = "◀";
    return button;
  })();

  const iframe = (() => {
    const iframe = document.createElement("iframe");
    iframe.classList.add("multicv-iframe");
    iframe.style.right = `-${IFRAME_WIDTH}`;
    iframe.style.width = IFRAME_WIDTH;
    iframe.src = "https://multicv.space";
    return iframe;
  })();

  const tooltip = (() => {
    const tooltip = document.createElement("div");
    tooltip.classList.add("multicv-tooltip");
    tooltip.innerText = "Summarize and generate CV for this position!";

    const arrow = document.createElement("div");
    arrow.classList.add("multicv-tooltip-arrow");

    tooltip.appendChild(arrow);
    return tooltip;
  })();

  (() => {
    if (hostList.some((host) => window.location.hostname.includes(host))) {
      document.body.appendChild(button);
      document.body.appendChild(iframe);
      document.body.appendChild(tooltip);

      let isIframeOpen = false;

      button.addEventListener("mouseenter", () => {
        button.style.right = isIframeOpen
          ? `calc(${IFRAME_WIDTH} - 15px)`
          : "0px";
      });

      button.addEventListener("mouseleave", () => {
        button.style.right = isIframeOpen
          ? `calc(${IFRAME_WIDTH} - 10px)`
          : "-5px";
      });

      button.addEventListener("click", () => {
        if (isIframeOpen) {
          iframe.style.right = `-${IFRAME_WIDTH}`;
          button.style.right = "0px";
          button.innerText = "◀";
        } else {
          iframe.style.right = "0";
          button.style.right = `calc(${IFRAME_WIDTH} - 5px)`;
          button.innerText = "▶";
        }
        isIframeOpen = !isIframeOpen;
      });

      const showTooltip = () => {
        setTimeout(() => {
          tooltip.style.opacity = "1";
          tooltip.style.display = "flex";

          setTimeout(() => {
            tooltip.style.opacity = "0";
            tooltip.style.display = "none";
          }, 5000);
        }, 1000);
      };

      const observer = new MutationObserver(() => {
        if (button.innerText !== "◀") {
          tooltip.style.opacity = "0";
          tooltip.style.display = "none";
        }
      });

      observer.observe(button, { childList: true, subtree: true });

      let previousUrl = null;

      const observerUrl = new MutationObserver(() => {
        const currentUrl = window.location.origin + window.location.pathname;

        if (
          currentUrl.includes("linkedin.com/jobs/collections/recommended") &&
          button.innerText === "◀" &&
          currentUrl !== previousUrl
        ) {
          showTooltip();
          previousUrl = currentUrl;
        }
      });

      observerUrl.observe(document.body, { childList: true, subtree: true });
    }
  })();
}
