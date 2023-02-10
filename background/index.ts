const toggleExtension = (tabid) => {
  chrome.tabs.sendMessage(tabid, {});
};

const getTrashedBookmarks = () => {
  return chrome.storage.local.get(["cmdb_trashed_bookmarks"]);
};

const trashBookmark = (trash) => {
  return chrome.storage.local.set({ cmdb_trashed_bookmarks: trash });
};

// toggle extension when extension icon is clicked
chrome.action.onClicked.addListener(function (tab) {
  toggleExtension(tab.id);
});

//  toggle extension when Cmd+B is pressed
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "open-cmdb") {
    toggleExtension(tab.id);
  }
});

// Open on install
chrome.runtime.onInstalled.addListener((object) => {
  chrome.tabs.create({ url: "https://cmdb.ize-302.dev/welcome.html" });
});

// Receive messages
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.command === "CMDB_CLOSE_APP") {
    const { tab } = sender;
    toggleExtension(tab?.id);
  }

  if (message === "CMDB_FETCH_BOOKMARKS") {
    chrome.bookmarks.getTree((result: any) => {
      sendResponse(result[0]);
    });
  }

  if (message.command === "CMDB_FETCH_BOOKMARS_BY_FOLDER") {
    chrome.bookmarks.getSubTree(message.id, (result: any) => {
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
  if (message.command === "CMDB_DELETE_BOOKMARK") {
    getTrashedBookmarks().then((response) => {
      const trash = response.cmdb_trashed_bookmarks || []; // retrieve trash
      for (let i = 0; i < message.bookmarks.length; i++) {
        // only save urls
        if (message.bookmarks[i].url) {
          trash.push(message.bookmarks[i]);
          trashBookmark(trash); // update trash
        }
        chrome.bookmarks.remove(message.bookmarks[i].id, () => {
          if (i === message.bookmarks.length - 1) {
            sendResponse("deleted");
          }
        });
      }
    });
  }

  // handle create
  if (message.command === "CMDB_CREATE_BOOKMARK") {
    chrome.bookmarks.create(
      {
        title: message.title,
        url: message.url,
        parentId: message.parentId,
        index: message.index,
      },
      (response) => sendResponse(response)
    );
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
    // determine where to create restored bookmark
    const checkParent = (parentId) => {
      const findParent = message.folders.find(
        (folder) => folder.id === parentId
      );
      return findParent ? findParent.id : null;
    };
    // create bookmark
    for (let i = 0; i < message.bookmarks.length; i++) {
      chrome.bookmarks.create(
        {
          title: message.bookmarks[i].title,
          url: message.bookmarks[i].url,
          parentId: checkParent(message.bookmarks[i].parentId),
          index: message.bookmarks[i].index,
        },
        (response) => response
      );

      // update trash
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
