(function () {
  "use strict";
  let bilibiliHomeCssCode = `
    .recommended-swipe {
      display: none !important;
    }

    @media (min-width: 1100px) and (max-width: 1366.9px) {
    .recommend-container__2-line>*:nth-of-type(1n + 8) {
      display: block!important;
    }
    }

    @media (min-width: 1367px) and (max-width: 1700.9px) {
    .recommend-container__2-line>*:nth-of-type(1n + 8) {
      display: block!important;
    }
    }

    @media (min-width: 1701px) and (max-width: 2199.9px) {
    .recommend-container__2-line>*:nth-of-type(1n + 10) {
      display: block!important;
    }
    }



    @media (min-width: 1701px) and (max-width: 2199.9px) {
      .bili-grid {
        grid-template-columns: repeat(5,1fr)!important;
    }
      .recommend-container__2-line {
        grid-column: span 5!important;
        grid-template-columns: repeat(5,1fr)!important;
      }
    }
  `
  chrome.runtime.sendMessage(
    {
      type: 'getDataFromStorage',
      keys: ['isbilibiliHomeStyle'],
    },
    (response) => {
      if (response.isbilibiliHomeStyle) {
        let body = document.body;
        let styleDom = document.createElement('style');
        styleDom.id = 'tuntun-bilibili-home'
        styleDom.innerHTML = bilibiliHomeCssCode;
        body.appendChild(styleDom);
      }
    }
  );
})();
