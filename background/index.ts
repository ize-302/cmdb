const toggleExtension = (tabid) => {
  chrome.bookmarks.getTree((bookmarks) => {
    chrome.bookmarks.getRecent(20, (recent) => {
      chrome.bookmarks.search("next", (searchresult) => {
        chrome.tabs.sendMessage(tabid, {
          bookmarkdata: bookmarks[0],
          recentbookmarkdata: recent,
          searchresult: searchresult,
        });
      });
    });
  });
};

// toggle extension when extension icon is clicked
chrome.action.onClicked.addListener(function (tab: any) {
  toggleExtension(tab.id);
});

//  toggle extension when Cmd+B is pressed
chrome.commands.onCommand.addListener((command, tab) => {
  toggleExtension(tab.id);
});

// Receive messages
chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  sendResponse({ data: { sender, message } });
  return true;
});
