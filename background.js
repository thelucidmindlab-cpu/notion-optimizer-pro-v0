// 后台脚本
chrome.runtime.onInstalled.addListener(() => {
    console.log('Notion Performance Optimizer installed');
});

// 处理扩展图标点击
chrome.action.onClicked.addListener((tab) => {
    chrome.action.openPopup();
});
