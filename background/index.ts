const toggleExtension = (tabid) => {
  chrome.bookmarks.getTree((bookmarks) => {
    chrome.bookmarks.getRecent(20, (recent) => {
      chrome.tabs.sendMessage(tabid, {
        bookmarkdata: bookmarks[0],
        recentbookmarkdata: recent,
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
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // handle search result
  chrome.bookmarks.search(message, function (result) {
    sendResponse(result);
  });

  // handle create
  chrome.bookmarks.create(
    { title: message.title, url: message.url, parentId: message.parentId },
    (response) => {
      sendResponse(response);
    }
  );
  return true;
});
