const hostList = ["linkedin.com", "infojobs.net"];

(() => {
  if (hostList.some((host) => window.location.hostname.includes(host))) {
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

    const iframe = document.createElement("iframe");
    iframe.src = "http://localhost:3000";
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.right = "-310px";
    iframe.style.width = "300px";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.zIndex = "10000";
    iframe.style.transition = "right 0.3s ease";

    document.body.appendChild(button);
    document.body.appendChild(iframe);

    let isIframeOpen = false;

    button.addEventListener("mouseenter", () => {
      if (!isIframeOpen) {
        button.style.right = "0px";
      } else {
        button.style.right = "285px";
      }
    });

    button.addEventListener("mouseleave", () => {
      if (!isIframeOpen) {
        button.style.right = "-5px";
      } else {
        button.style.right = "290px";
      }
    });

    button.addEventListener("click", () => {
      if (isIframeOpen) {
        iframe.style.right = "-310px";
        button.style.right = "0";
        button.innerText = "◀";
      } else {
        iframe.style.right = "0";
        button.style.right = "295px";
        button.innerText = "▶";
      }
      isIframeOpen = !isIframeOpen;
    });
  }
})();
