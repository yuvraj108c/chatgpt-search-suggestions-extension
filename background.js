// source: https://stackoverflow.com/questions/12357485/cors-chrome-extension-with-manifest-version-2
// Resolved cors issue
chrome.runtime.onMessage.addListener(function (url, sender, onSuccess) {
  fetch(url)
    .then((response) => response.text())
    .then((responseText) => onSuccess(responseText));

  return true; // Will respond asynchronously.
});
