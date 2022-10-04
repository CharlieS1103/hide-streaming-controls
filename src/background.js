chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});
const urlArray = [
  "https://www.hulu.com",
  "https://www.peacocktv.com",
  "https://www.youtube.com",
  "https://www.netflix.com",
  "https://www.disneyplus.com",
];

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  // Loop through the array of URLS and check if the current tab is one of them
  let validSite = false;
  for (let i = 0; i < urlArray.length; i++) {
    if (tab.url.startsWith(urlArray[i])) {
      validSite = true;
      break;
    }
  }
  if (validSite) {
    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === "ON" ? "OFF" : "ON";

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === "ON") {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ["styles.css"],
        target: { tabId: tab.id },
      });
    } else if (nextState === "OFF") {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ["styles.css"],
        target: { tabId: tab.id },
      });
    }
  }
});
