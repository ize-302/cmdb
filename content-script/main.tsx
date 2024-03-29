import { createRoot } from "react-dom/client";
import App from "../src/App";

let show = false;

// Make sure the element that you want to mount the app to has loaded. You can
// also use `append` or insert the app using another method:
// https://developer.mozilla.org/en-US/docs/Web/API/Element#methods
//
// Also control when the content script is injected from the manifest.json:
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#run_time

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  show = !show;

  const ext_container_elem =
    document.getElementsByClassName("cmdb-animated-bg")[0];

  const html = document.querySelector("html");
  if (show) {
    const app = document.createElement("cmdb");
    app.id = "root";
    if (html) {
      html.append(app);
    }
    if (html) {
      html.style.overflow = "hidden";
    }
    let root = createRoot(
      document.getElementsByTagName("cmdb")[0] as HTMLElement
    );
    root.render(<App />);

    if (ext_container_elem) {
      ext_container_elem?.classList.add("cmdb-show");
      ext_container_elem?.classList.remove("cmdb-hide");
    }
  } else {
    if (html) {
      html.style.overflow = "auto";
    }
    ext_container_elem?.classList.add("cmdb-hide");
    ext_container_elem?.classList.remove("cmdb-show");

    setTimeout(() => {
      const div_root = document.getElementsByTagName("cmdb")[0];
      div_root?.remove();
    }, 100);
  }
});
