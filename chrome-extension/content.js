(() => {
    if (window.location.hostname.includes("linkedin.com")) {
        const iframe = document.createElement("iframe");
        iframe.src = "http://localhost:3000";
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.right = "0";
        iframe.style.width = "300px";
        iframe.style.height = "100vh";
        iframe.style.border = "none";
        iframe.style.zIndex = "10000";

        document.body.appendChild(iframe);
    }
})();
