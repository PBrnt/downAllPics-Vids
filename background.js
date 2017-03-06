"use strict";
/**
 * @author Paul Bournat
 * @version 1.0
 */

 chrome.browserAction.onClicked.addListener(getAllTabs);

/**
 * Get all the tabs of the current window
 */
function getAllTabs() {
  chrome.tabs.query({currentWindow: true}, downloadTheirContent);
}

/**
 * For each tab the content is downloaded if image or video
 * Every name conflict is automatically handled by the browser to make it unique
 * @param {Tab[]} tabs
 */
function downloadTheirContent(tabs) {
  const CODE = "document.contentType;";
  const OPTIONS = {"url": null, "conflictAction": "uniquify"}
  let urls = [];

  for (let tab of tabs) {
    if (urls.indexOf(tab.url) === -1) {
      urls.push(tab.url);

      chrome.tabs.executeScript(tab.id, {"code": CODE}, function (contentType) {
        if (contentType && !chrome.runtime.lastError) {
          let type = contentType[0].slice(0, contentType[0].indexOf('/'));

          if (["image", "video"].indexOf(type) !== -1) {
            OPTIONS.url = tab.url;
            chrome.downloads.download(OPTIONS);
          }
        }
      });
    }
  }
}
