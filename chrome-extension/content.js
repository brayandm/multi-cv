const hostList = ["linkedin.com", "infojobs.net"];
const IFRAME_WIDTH = "360px";

console.log("MultiCV extension loaded");

window.addEventListener("message", (event) => {
  if (event.origin !== "https://multicv.space") return;

  if (event.data.type == "set_auth_cookie") {
    chrome.storage.local.set({ auth_cookie: event.data.content }, function () {
      window.postMessage(
        {
          type: "response_set_auth_cookie",
          content: 200,
        },
        event.origin
      );
    });
  }
});

const button = (() => {
  const button = document.createElement("div");
  button.classList.add("custom-button");
  button.innerText = "◀";
  return button;
})();

const iframe = (() => {
  const iframe = document.createElement("iframe");
  iframe.classList.add("custom-iframe");
  iframe.style.right = `-${IFRAME_WIDTH}`;
  iframe.style.width = IFRAME_WIDTH;
  iframe.src = "https://multicv.space";
  return iframe;
})();

const tooltip = (() => {
  const tooltip = document.createElement("div");
  tooltip.classList.add("custom-tooltip");
  tooltip.innerText = "Summarize and generate CV for this position!";

  const arrow = document.createElement("div");
  arrow.classList.add("tooltip-arrow");

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
