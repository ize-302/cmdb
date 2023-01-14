const toggleExtension = (tabid) => {
  chrome.tabs.sendMessage(tabid, {});
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
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message === "CMDB_FETCH_BOOKMARKS") {
    chrome.bookmarks.getTree((bookmarks) => {
      sendResponse(bookmarks[0]);
    });
  }

  if (message === "CMDB_FETCH_RECENT_BOOKMARKS") {
    chrome.bookmarks.getRecent(20, (result) => {
      sendResponse(result);
    });
  }

  // handle search result
  if (message.command === "CMDB_SEARCH") {
    chrome.bookmarks.search(message.string, function (result) {
      sendResponse(result);
    });
  }

  // handle create
  if (message.command === "CMDB_CREATE_BOOKMARK") {
    chrome.bookmarks.create(
      { title: message.title, url: message.url, parentId: message.parentId },
      (response) => {
        sendResponse(response);
      }
    );
  }
  return true;
});
