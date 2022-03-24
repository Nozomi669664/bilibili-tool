let code = `
(function () {
  "use strict";
  const _historyWrap = function (type) {
    const orig = history[type];
    const e = new Event(type);
    return function () {
			// console.log(111);
      const rv = orig.apply(this, arguments);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };
  history.pushState = _historyWrap("pushState");
  history.replaceState = _historyWrap("replaceState");

  const isAutoWidescreen = false;
  let firstVisible = true;
  const repeat = (time = 0) => {
    // console.log('repeat');
    setTimeout(() => {
      let setting = document.querySelector(
        ".bilibili-player-video-btn-setting"
      );
      if (setting !== null) {
        const event1 = new MouseEvent("mouseover");
        setting.dispatchEvent(event1);
        let btn = document.querySelector(
          ".bilibili-player-video-btn-setting-left-repeat input"
        );
        // console.dir(btn)
        if (!btn.checked) {
          btn.click();
          // console.log('repeat')
        }
        const event2 = new MouseEvent("mouseout");
        setting.dispatchEvent(event2);
        if (firstVisible) {
          firstVisible = !firstVisible;
        }
      }
    }, time);
  };
  const widescreen = (time = 0) => {
    // console.log('widescreen');
    if (isAutoWidescreen) {
      setTimeout(() => {
        let widescreenBtn = document.querySelector(
          ".bilibili-player-video-btn-widescreen"
        );
        widescreenBtn.click();
      }, time);
    }
  };
  window.addEventListener(
    "load",
    async () => {
      repeat(3000);
    },
    false
  );
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && firstVisible) {
      // console.log(document.visibilityState);
      widescreen(1500);
      repeat(3000);
      firstVisible = !firstVisible;
    }
  });
  let preBv = location.pathname;
  // console.log(preBv);
  window.addEventListener("pushState", function (e) {
    const newBv = e.arguments[2].slice(0, 19);
    // console.log("pushState");
    repeat();
    if (preBv !== newBv) {
      widescreen();
      preBv = newBv;
    }
  });
  window.addEventListener("popstate", function (event) {
    repeat();
    widescreen();
  });
})();
`;
let script = document.createElement('script');
script.type = 'module';
script.id = 'tun-video-tool';
script.innerHTML = code;
let scriptTag = document.getElementById('tun-video-tool');
if (scriptTag) document.body.removeChild(scriptTag);
document.body.appendChild(script);
