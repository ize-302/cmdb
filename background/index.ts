const toggleExtension = (tabid) => {
  chrome.tabs.sendMessage(tabid, {});
};

// toggle extension when extension icon is clicked
chrome.action.onClicked.addListener(function (tab) {
  toggleExtension(tab.id);
});

//  toggle extension when Cmd+B is pressed
chrome.commands.onCommand.addListener((command, tab) => {
  toggleExtension(tab.id);
});

// first time isntlalation
chrome.runtime.onInstalled.addListener(function () {
  alert(
    "You just made the best decision of today, by installing GMass!\n\nWe will now redirect you to your Gmail account so you can get started sending email campaigns inside Gmail."
  );

  chrome.tabs.create({
    url: "https://mail.google.com",
    active: true,
  });

  return false;
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

  // delete a bookmark
  if (message.command === "CMDB_DELETE_BOOKMARK") {
    chrome.bookmarks.remove(message.id);
    sendResponse("removed");
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

  // handle update
  if (message.command === "CMDB_UPDATE_BOOKMARK") {
    chrome.bookmarks.update(
      message.id,
      { title: message.title, url: message.url },
      (response) => {
        sendResponse(response);
      }
    );
  }

  // handle move bookmark
  if (message.command === "CMDB_MOVE_BOOKMARK") {
    chrome.bookmarks.move(
      message.id,
      { parentId: message.parentId },
      (response) => {
        sendResponse(response);
      }
    );
  }

  return true;
});
