chrome.action.onClicked.addListener(function (tab: any) {
  chrome.bookmarks.getTree((response) => {
    chrome.tabs.sendMessage(tab.id, { bookmarkdata: response[0] });
  });
});
