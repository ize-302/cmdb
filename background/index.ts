const toggleExtension = (tabid) => {
  chrome.tabs.sendMessage(tabid, {});
};

const getTrashedBookmarks = () => {
  return chrome.storage.local.get(["cmdb_trashed_bookmarks"]);
};

const trashBookmark = (trash) => {
  return chrome.storage.local.set({ cmdb_trashed_bookmarks: trash });
};

// create bookmark / folder item
// https://developer.chrome.com/docs/extensions/reference/bookmarks/#method-create
const createItem = async (value) => {
  await chrome.bookmarks.create(
    { title: value.title, url: value.url, parentId: value.parentId },
    (response) => response
  );
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
    chrome.bookmarks.getTree((result: any) => {
      sendResponse(result[0]);
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
  if (message.command === "CMDB_DELETE_ITEM") {
    chrome.bookmarks.remove(message.id);
    sendResponse("removed");
  }

  // handle create
  if (message.command === "CMDB_CREATE_ITEM") {
    createItem(message).then((response) => {
      sendResponse(response);
    });
  }

  // handle update
  if (message.command === "CMDB_UPDATE_ITEM") {
    chrome.bookmarks.update(
      message.id,
      { title: message.title, url: message.url },
      (response) => {
        sendResponse(response);
      }
    );
  }

  // handle move bookmark
  if (message.command === "CMDB_MOVE_ITEM") {
    chrome.bookmarks.move(
      message.id,
      { parentId: message.parentId },
      (response) => {
        sendResponse(response);
      }
    );
  }

  // trash deleted bookmarks
  if (message.command === "CMDB_TRASH_DELETED_BOOKMARK") {
    // get previously saved
    getTrashedBookmarks().then((result) => {
      const trash = result.cmdb_trashed_bookmarks || [];
      trash.push(message.data);
      trashBookmark(trash).then(() => {
        sendResponse("saved");
      });
    });
  }

  // get trashed bookmarks
  if (message.command === "CMDB_GET_TRASHED_BOOKMARK") {
    getTrashedBookmarks().then((result) => {
      sendResponse(result.cmdb_trashed_bookmarks);
    });
  }

  // delete trashed bookmark
  if (message.command === "CMDB_DELETE_TRASHED_BOOKMARK") {
    getTrashedBookmarks().then((result) => {
      const filtered = result.cmdb_trashed_bookmarks.filter(
        (bookmark) => bookmark.id !== message.id
      );
      trashBookmark(filtered).then(() => {
        getTrashedBookmarks().then((result) => {
          sendResponse(result.cmdb_trashed_bookmarks);
        });
      });
    });
  }

  return true;
});
