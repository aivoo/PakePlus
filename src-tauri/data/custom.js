console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
)

// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true });

// ==UserScript==
// @name         全功能助手 (注入安全版)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  设置Cookie和LocalStorage，并使用混合模式隐藏通知。注入安全。
// @match        *://*/*
// @grant        none
// @run-at       document-start 
// ==/UserScript==

// 使用 document-start 注入，配合 DOMContentLoaded 事件，确保在最早时机准备好，并在 DOM 可用时立即执行。
document.addEventListener('DOMContentLoaded', () => {
    'use-strict';

    console.log('DOM 已就绪，全功能助手开始执行...');

    // ==================================================
    // ==== 添加Cookie (Set Cookie) ====
    // ==================================================
    
    console.log('正在尝试设置Cookie...');
    document.cookie = "session_id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNWJhMmYzNzQ2YWU0MGUzYmMzZWRhNGYyNjNhNzI2NSIsImlhdCI6MTc1MzM0NDYwOCwidXNlcl9pZCI6IjMxMDQxOTY2MzAyODkzMjM2MyIsIm5hbWUiOiJhYWFhYWEiLCJlbWFpbCI6Imx1Y2t5ZWZ2Z2pAMTY2OTg1Lnh5eiIsImdpdmVuX25hbWUiOm51bGwsImZhbWlseV9uYW1lIjpudWxsLCJuaWNrbmFtZSI6ImFhYWFhYSIsImF2YXRhciI6IiJ9.j4jSsjmh7s2GQ3cVfVkFq8q8hL8E5dWmH48WLRNTAHw; path=/";
    console.log('✅ Cookie "session_id" 已设置。');


    // ==================================================
    // ==== 设置 Local Storage (Set Local Storage) ====
    // ==================================================

    console.log('正在尝试设置 Local Storage...');
    const localStorageKey = 'usage_info';
    const localStorageValue = '{"$typeName":"user.v1.GetAvailableCreditsResponse","totalCredits":10086,"freeCredits":10086}';
    localStorage.setItem(localStorageKey, localStorageValue);
    console.log(`✅ Local Storage 已设置: Key='${localStorageKey}'。`);


    // ==================================================
    // ==== 屏蔽元素 (Block Elements) ====
    // ==================================================

    console.log('▶️ 多功能隐藏脚本 (混合模式) 已启动...');

    const accountSuspendedText = '账户已被暂停使用';
    const mainContainerSelector = '.absolute.z-\\[1000\\].pointer-events-auto';
    const userBlockedText = 'user is blocked';

    const checkAndHideElements = () => {
        // ... (内部逻辑和之前完全一样，无需改动)
        const heading = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.trim() === accountSuspendedText);
        if (heading) {
            const dialogDiv = heading.closest('div[role="dialog"]');
            if (dialogDiv && dialogDiv.style.display !== 'none') {
                console.log('检测到“账户暂停”弹窗，准备隐藏...');
                dialogDiv.style.display = 'none';
                console.log('  - 已隐藏弹窗主体。');
                const parentContainer = dialogDiv.parentElement;
                if (parentContainer && parentContainer.matches(mainContainerSelector)) {
                    const backgroundDiv = parentContainer.querySelector(':scope > div.w-full.h-full');
                    if (backgroundDiv) {
                        backgroundDiv.style.display = 'none';
                        console.log('  - 已隐藏背景遮罩。');
                    }
                }
            }
        }
        const blockedTextDiv = Array.from(document.querySelectorAll('div')).find(div => div.textContent.trim() === userBlockedText);
        if (blockedTextDiv) {
            const notificationLi = blockedTextDiv.closest('li');
            if (notificationLi && notificationLi.style.display !== 'none') {
                console.log('检测到 "user is blocked" 通知，准备隐藏...');
                notificationLi.style.display = 'none';
                console.log('  - 已隐藏通知li元素。');
            }
        }
    };

    let pollCount = 0;
    const maxPolls = 25;
    console.log('🚀 启动为期5秒的高频轮询...');
    const initialPollInterval = setInterval(() => {
        pollCount++;
        checkAndHideElements();
        if (pollCount >= maxPolls) {
            clearInterval(initialPollInterval);
            console.log('🏁 高频轮询结束，转为MutationObserver长期监测模式。');
        }
    }, 200);

    const observer = new MutationObserver(checkAndHideElements);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    checkAndHideElements();
});