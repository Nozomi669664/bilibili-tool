
(function () {
  "use strict";
  let preBv = location.pathname;
  let firstVisible = true;

  const repeat = (time = 0) => {
    setTimeout(() => {
      let setting = document.querySelector(
        '.bilibili-player-video-btn-setting'
      );
      if (setting !== null) {
        const event1 = new MouseEvent('mouseover');
        setting.dispatchEvent(event1);
        let btn = document.querySelector(
          '.bilibili-player-video-btn-setting-left-repeat input'
        );
        if (!btn.checked) {
          btn.click();
        }
        const event2 = new MouseEvent('mouseout');
        setting.dispatchEvent(event2);
        if (firstVisible) {
          firstVisible = !firstVisible;
        }
      }
    }, time);
  };
  const widescreen = (time = 0) => {
    // console.log('widescreen');
    setTimeout(() => {
      let widescreenBtn = document.querySelector(
        '.bilibili-player-video-btn-widescreen'
      );
      if (widescreenBtn) {
        widescreenBtn.click();
      }
    }, time);
  };

  chrome.runtime.sendMessage(
    {
      type: 'getDataFromStorage',
      keys: ['isVideoLoop', 'isAutoWidescreen'],
    },
    (response) => {
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible' && firstVisible) {
          if (response.isAutoWidescreen) {
            widescreen(1500);
          }
          if(response.isVideoLoop) {
            repeat(3000);
          }
          firstVisible = !firstVisible;
        }
      });
      window.addEventListener('pushState', function (e) {
        // console.log('pushState');
        const newBv = location.pathname;
        if(response.isVideoLoop) {
          repeat();
        }
        if (preBv !== newBv) {
          if (response.isAutoWidescreen) {
            widescreen();
          }
          preBv = newBv;
        }
      });
      window.addEventListener('popstate', function (event) {
        const newBv = location.pathname;
        if(response.isVideoLoop) {
          repeat();
        }
        if (preBv !== newBv) {
          if (response.isAutoWidescreen) {
            widescreen();
          }
          preBv = newBv;
        }
      });
    }
  );

  window.addEventListener(
    'load',
    async () => {
      chrome.runtime.sendMessage(
        {
          type: 'getDataFromStorage',
          keys: ['isVideoLoop', 'isAutoWidescreen'],
        },
        (response) => {
          // console.log(response)
          if(response.isVideoLoop) {
            repeat(3000);
          }
          if(response.isAutoWidescreen) {
            widescreen(1500);
          }
        }
      );
    },
    false
  );
})();

let historyEvent = `
  const _historyWrap = function (type) {
    const orig = history[type];
    const e = new Event(type);
    return function () {
      const rv = orig.apply(this, arguments);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };
  history.pushState = _historyWrap('pushState');
  history.replaceState = _historyWrap('replaceState');
`

let script = document.createElement('script');
script.type = 'module';
script.id = 'tun-historyEvent';
script.innerHTML = historyEvent;
let scriptTag = document.getElementById('tun-historyEvent');
if (scriptTag) document.body.removeChild(scriptTag);
document.body.appendChild(script);
