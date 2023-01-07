import { createRoot } from "react-dom/client";
import App from "../src/App";

let show = false;
let searchresult: any[] = [];

// Make sure the element that you want to mount the app to has loaded. You can
// also use `append` or insert the app using another method:
// https://developer.mozilla.org/en-US/docs/Web/API/Element#methods
//
// Also control when the content script is injected from the manifest.json:
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#run_time

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  const handleSearch = async (str: string) => {
    await chrome.runtime.sendMessage(str, (result) => {
      searchresult = result;
    });
    console.log(searchresult);
  };

  if (msg.bookmarkdata) {
    show = !show;

    const ext_container_elem = document.getElementsByClassName(
      "ext-container-border"
    )[0];

    const body = document.querySelector("body");
    const html = document.querySelector("html");
    if (show) {
      const app = document.createElement("div");
      app.id = "root";
      if (body) {
        body.prepend(app);
      }
      if (html) {
        html.style.overflow = "hidden";
      }
      let root = createRoot(document.getElementById("root") as HTMLElement);
      root.render(
        <App
          bookmarkdata={msg.bookmarkdata}
          recentbookmardata={msg.recentbookmarkdata}
          handleSearch={handleSearch}
          searchresult={searchresult}
        />
      );

      if (ext_container_elem) {
        ext_container_elem.classList.add("ext-container-show");
        ext_container_elem.classList.remove("ext-container-hide");
      }
    } else {
      if (html) {
        html.style.overflow = "auto";
      }
      ext_container_elem.classList.add("ext-container-hide");
      ext_container_elem.classList.remove("ext-container-show");

      setTimeout(() => {
        const div_root = document.getElementById("root");
        div_root?.remove();
      }, 100);
    }
  }
});
