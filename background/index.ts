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

  if (message.command === "CMDB_FETCH_BOOKMARS_BY_FOLDER") {
    chrome.bookmarks.getChildren(message.id, (result: any) => {
      sendResponse(result);
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
    getTrashedBookmarks().then((response) => {
      const trash = response.cmdb_trashed_bookmarks || []; // retrieve trash
      for (let i = 0; i < message.bookmarks.length; i++) {
        trash.push(message.bookmarks[i]);
        trashBookmark(trash); // update trash
        chrome.bookmarks.remove(message.bookmarks[i].id, () => {
          if (i === message.bookmarks.length - 1) {
            sendResponse("deleted");
          }
        });
      }
    });
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
    for (let i = 0; i < message.bookmarks.length; i++) {
      chrome.bookmarks.move(
        message.bookmarks[i].id,
        { parentId: message.parentId },
        (response) => {
          if (i === message.bookmarks.length - 1) {
            sendResponse(response);
          }
        }
      );
    }
  }

  // get trashed bookmarks
  if (message.command === "CMDB_GET_TRASHED_BOOKMARK") {
    getTrashedBookmarks().then((result) => {
      sendResponse(result.cmdb_trashed_bookmarks || []);
    });
  }

  // delete trashed bookmark
  if (message.command === "CMDB_DELETE_TRASHED_BOOKMARK") {
    for (let i = 0; i < message.bookmarks.length; i++) {
      getTrashedBookmarks().then((response) => {
        const trash = response.cmdb_trashed_bookmarks || []; // retrieve trash
        const results = trash.filter(
          ({ id: id1 }) => !message.bookmarks.some(({ id: id2 }) => id2 === id1)
        );
        if (i === message.bookmarks.length - 1) {
          trashBookmark(results);
          sendResponse(results);
        }
      });
    }
  }

  // restore trashed bookmark
  if (message.command === "CMDB_RESTORE_TRASHED_BOOKMARK") {
    for (let i = 0; i < message.bookmarks.length; i++) {
      createItem(message.bookmarks[i]);
    }
    // sendResponse(message.bookmarks);
    for (let i = 0; i < message.bookmarks.length; i++) {
      getTrashedBookmarks().then((response) => {
        const trash = response.cmdb_trashed_bookmarks || []; // retrieve trash
        const results = trash.filter(
          ({ id: id1 }) => !message.bookmarks.some(({ id: id2 }) => id2 === id1)
        );
        if (i === message.bookmarks.length - 1) {
          trashBookmark(results);
          sendResponse(results);
        }
      });
    }
  }

  // empty trash
  if (message.command === "CMDB_EMTPY_TRASH") {
    trashBookmark([]).then(() => {
      getTrashedBookmarks().then((result) => {
        sendResponse(result.cmdb_trashed_bookmarks);
      });
    });
  }

  return true;
});
