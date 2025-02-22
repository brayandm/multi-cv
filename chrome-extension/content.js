const hostList = ["linkedin.com", "infojobs.net"];

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

    iframe.src = "http://localhost:3000";
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.right = "-310px";
    iframe.style.width = "300px";
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
    tooltip.style.top = "50%";
    tooltip.style.width = "300px";
    tooltip.style.height = "200px";
    tooltip.style.right = "20px";
    tooltip.style.textAlign = "center";
    tooltip.style.background = "#fff";
    tooltip.style.color = "#0073b1";
    tooltip.style.padding = "10px 15px";
    tooltip.style.borderRadius = "8px";
    tooltip.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.2)";
    tooltip.style.fontSize = "14px";
    tooltip.style.fontWeight = "bold";
    tooltip.style.zIndex = "10001";
    tooltip.style.opacity = "0";
    tooltip.style.transition = "opacity 0.3s ease";
    tooltip.style.cursor = "pointer";

    return tooltip;
})();

(() => {
    if (hostList.some((host) => window.location.hostname.includes(host))) {
        document.body.appendChild(button);
        document.body.appendChild(iframe);
        document.body.appendChild(tooltip);

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

        const showTooltip = () => {
            setTimeout(() => {
                tooltip.style.opacity = "1";

                setTimeout(() => {
                    tooltip.style.opacity = "0";
                    setTimeout(() => tooltip.remove(), 300);
                }, 5000);
            }, 1000);
        };

        if (
            window.location.href.includes(
                "linkedin.com/jobs/collections/recommended",
            )
        ) {
            showTooltip();
        }
    }
})();
