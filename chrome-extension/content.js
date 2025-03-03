const hostList = ["linkedin.com", "infojobs.net"];
const IFRAME_WIDTH = "440px";

const button = (() => {
  const button = document.createElement("div");

  button.innerText = "◀";
  button.style.position = "fixed";
  button.style.top = "50%";
  button.style.right = "-5px";
  button.style.width = "45px";
  button.style.height = "80px";
  button.style.background = "#0073b1";
  button.style.color = "#fff";
  button.style.borderRadius = "10px 0 0 10px";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.paddingRight = "5px";
  button.style.justifyContent = "center";
  button.style.cursor = "pointer";
  button.style.fontSize = "16px";
  button.style.zIndex = "9999";
  button.style.transition = "right 0.3s ease";

  return button;
})();

const iframe = (() => {
  const iframe = document.createElement("iframe");

  iframe.src = "https://multicv.space";
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.right = `-${IFRAME_WIDTH}`;
  iframe.style.width = IFRAME_WIDTH;
  iframe.style.height = "100vh";
  iframe.style.border = "none";
  iframe.style.zIndex = "10000";
  iframe.style.transition = "right 0.3s ease";

  return iframe;
})();

const tooltip = (() => {
  const tooltip = document.createElement("div");
  tooltip.innerText = "Summarize and generate CV for this position!";
  tooltip.style.position = "fixed";
  tooltip.style.display = "none";
  tooltip.style.alignItems = "center";
  tooltip.style.justifyContent = "center";
  tooltip.style.top = "calc(50% - 100px)";
  tooltip.style.right = "60px";
  tooltip.style.width = "200px";
  tooltip.style.height = "100px";
  tooltip.style.padding = "10px 15px";
  tooltip.style.background = "#fff";
  tooltip.style.color = "#000";
  tooltip.style.borderRadius = "8px";
  tooltip.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
  tooltip.style.fontSize = "14px";
  tooltip.style.fontWeight = "bold";
  tooltip.style.zIndex = "10001";
  tooltip.style.opacity = "0";
  tooltip.style.transition = "opacity 0.3s ease";
  tooltip.style.cursor = "pointer";
  tooltip.style.textAlign = "center";

  const arrow = document.createElement("div");
  arrow.style.position = "absolute";
  arrow.style.right = "-10px";
  arrow.style.bottom = "-18px";
  arrow.style.transform = "translateY(-50%)";
  arrow.style.width = "0";
  arrow.style.rotate = "45deg";
  arrow.style.height = "0";
  arrow.style.borderLeft = "30px solid #fff";
  arrow.style.borderTop = "10px solid transparent";
  arrow.style.borderBottom = "10px solid transparent";

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
          setTimeout(() => tooltip.remove(), 300);
        }, 5000);
      }, 1000);
    };

    if (
      window.location.href.includes("linkedin.com/jobs/collections/recommended")
    ) {
      showTooltip();
    }
  }
})();
