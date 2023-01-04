chrome.action.onClicked.addListener(function (tab: any) {
  chrome.bookmarks.getTree((bookmarks) => {
    chrome.bookmarks.getRecent(20, (recent) => {
      chrome.tabs.sendMessage(tab.id, {
        bookmarkdata: bookmarks[0],
        recentbookmarkdata: recent,
      });
    });
  });
});
