(() => {
  "use strict";

  const API = {
    TRUE_STATUS: 200,
    Post: async (props) => {
      const { url, params = {}, headers = {}, option = {} } = props;
      let res = await fetch(url, {
        method: 'post',
        headers: {
          ...headers
        },
        body: JSON.stringify({
          ...params
        }),
        ...option,
      });
      if (res.status === API.TRUE_STATUS) {
        return (await res.json());
      } else {
        return {
          data: {
            msg: 'fail',
          },
        }
      }
    },
    // 通过视频地址获取短链
    getShortUrl: async (url) => {
      let baseUrl = 'https://api.bilibili.com/x/share/click';
      let paramsData = {
        build: 6180000,
        buvid: 'test',
        oid: url,
        platform: 'android',
        share_channel: 'COPY',
        share_id: 'public.webview.0.0.pv',
        share_mode: 3
      }
      try {
        let res = await API.Post({
          url: baseUrl,
          params: {
            ...paramsData,
          },
          headers: {
            'Content-Type': 'application/json',
          },
          option: {
            credentials: 'omit',
          }
        });
        return res.data;
      } catch (error) {
        console.log('getShortUrl', error);
      }
    },
  }

  const shareShort = (time = 0, shortUrl = '') => {
    setTimeout(async () => {
      //创建文本框，获得短链
      let shareUl = document.querySelector(".share-address>ul");
      let shareLi = document.createElement('li');
      shareUl.append(shareLi);
      shareLi.innerHTML = '<span class= "name">视频短链</span><input id="link3" type="text" name><span class="btn">复制</span>';
      let shortInput = document.querySelector("#link3");
      shortInput.value = shortUrl;

      let style = document.createElement('style');
      style.innerHTML = `
        .van-message-show {
          transform:translateY(-25px);
          transition: opacity .3s,transform .3s;
          transition-timing-function:ease,ease;
          transition-property:opacity,transform;
          transition-duration:0.3s,0.3s;
        }
      `;
      document.querySelector('body').append(style);

      //绑定复制事件
      let copyBtn = shareLi.querySelector(".btn");
      copyBtn.addEventListener('click', () => {
        shortInput.select();
        navigator.clipboard.writeText(shortInput.value).then(() => {
          onCopyBtnClick(shortInput.getBoundingClientRect().top);
        })
      })
    }, time);
  }
  // 点击复制按钮
  const onCopyBtnClick = (top = 1000) => {
    let pop = document.createElement('div');
    pop.innerHTML = '已成功复制到剪切板';
    pop.className = 'van-message';
    pop.style = `
      position: absolute;
      left: 234px;
      top: ${top + window.pageYOffset - 20}px;
      z-index: 3000;
    `;
    document.body.appendChild(pop);
    setTimeout(() => {
      pop.classList.add('van-message-show');
      setTimeout(() => {
        document.body.removeChild(pop);
      }, 1500)
    }, 10)
  }
  window.addEventListener(
    "load",
    async () => {
      let fullUrl = location.origin + location.pathname;
      chrome.runtime.sendMessage(
        {
          type: 'getShortUrl',
          url: fullUrl,
        },
        (response) => {
          shareShort(1500, response.content);
        }
      );
    },
    false
  );
})();
