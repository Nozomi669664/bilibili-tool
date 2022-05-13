(function () {
  'use strict';
  const API = {
    // 封装get方法
    Get: async (props) => {
      const { url: baseUrl, params = {} } = props;
      let pStr = Object.keys(params).map((key) => {
        return `${key}=${params[key]}`;
      }).join('&');
      let url = `${baseUrl}${pStr !== '' ? '?' : ''}${pStr}`;
      try {
        let res = await fetch(url, {
          credentials: "include"
        });
        return (await res.json()).data;
      } catch (error) {
        console.error('Get Error', error);
      }
    },
    // 通过关键词获取视频数据
    getLiver: async (num = 0) => {
      try {
        let params = {};
        if (num !== 0) {
          params = {
            size: num
          }
        }
        let res = await API.Get({
          url: 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users',
          params,
        });
        return res;
      } catch (error) {
        console.log('getLiver', error);
      }
    },
    getCard: async (mid) => {
      try {
        let res = await API.Get({
          url: 'https://api.bilibili.com/x/web-interface/card',
          params: {
            mid,
            photo: 'true',
          },
        });
        return res;
      } catch (error) {
        console.log('getCard', error);
      }
    }
  }

  const Tool = {
    // 大数转万
    formatBigNumber: (num) => {
      return num > 10000 ? `${(num / 10000).toFixed(2)}万` : num
    },
    // 字符串转DOM
    s2d: (string) => {
      return new DOMParser().parseFromString(string, 'text/html').body
        .childNodes[0]
    },
  }

  const getListItemTemplete = (prop) => {
    return `
      <div class="bili-dyn-live-users__item">
        <a href="${prop.link}" target="_blank" style="display: flex">
          <div class="bili-dyn-live-users__item__left">
            <div class="bili-dyn-live-users__item__face-container">
              <div class="bili-dyn-live-users__item__face">
                <div class="bili-awesome-img" style="background-image: url(${prop.face.slice(6)}@47w_47h_1c.webp);">
                </div>
              </div>
            </div>
          </div>
          <div class="bili-dyn-live-users__item__right">
            <div class="bili-dyn-live-users__item__uname bili-ellipsis">
              ${prop.uname}
            </div>
            <div class="bili-dyn-live-users__item__title bili-ellipsis">
              ${prop.title}
            </div>
          </div>
        </a>
      </div>
    `
  }

  const getCardTemplete = async (params) => {
    const {mid, x, y} = params;
    let data = await API.getCard(mid);
    let card = data.card;
    return `
      <div data-v-6c7ff250="" class="userinfo-wrapper" style="top: ${x}px; left: ${y}px">
        <div data-v-1b335720="" data-v-6c7ff250="" class="userinfo-content">
          <!---->
          <div data-v-1b335720="" class="bg" style="
              background-image: url('${data.space.l_img.slice(5)}@120h.webp');
            "></div>
          <a data-v-1b335720="" href="//space.bilibili.com/${mid}/dynamic" target="_blank" class="face">
            <img
              data-v-1b335720="" src="${card.face.slice(5)}@50w_50h_1c.webp" />
            ${card.official_verify.type !== -1 ? `<div data-v-1b335720="" class="verify-box type-${card.official_verify.type}"></div>` : ''}
          </a>
          <div data-v-1b335720="" class="info">
            <p data-v-1b335720="" class="user">
              <a data-v-1b335720="" target="_blank" href="//space.bilibili.com/${mid}/dynamic" class="name ${card.vip.status === 0 ? '' : 'vip'}"
              ${card.vip.status === 0 ? '' : 'style="color: rgb(251, 114, 153)"'}>${card.name}</a>
              <!----><a data-v-1b335720="" target="_blank" href="//www.bilibili.com/html/help.html#k_5"><img
                  data-v-1b335720=""
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI+SURBVHgB7ZcxbNNAFIb/M0lKsSNgadaSmVZstExIBQmkimaFDgixIhqYEDMgJpoCY1GnlhkhYAkrYu8e5mRBiDptCM31Xlq7cc7xpXGU1NL7Flt353vvv3v33hlgGIZhGIZhEovAGPizeHtFShQxIBJYu/jlW4neUxgDyoGCWrppDIiAXFKPoIDfi7euW8K6jxEgIadJBWFdykPYtvmbWhWtWk1r9wUIiFUp5RWMEHI++/Z93+N3Hj/C/q9KcA7/TeICRkw/Kx8Y7+jjrbBJs+sbOP/5K+xXr2Fisvi0PTb7YSPUIWsq157PWXuHzJ0CBkW6LlrVqtauHWJhO7ByucPOmVmYSF2e8R09k8/j//Z2oD+9cONoPtXftf2dtFSM/334ACfFQsJJvICx1IEwKHQn7i737KcQa34va+2nSICNs/eWI8e4SkT3GeMQGhaUJps/f2jt6blrkfViqAJSV+e1LabU2g/S3cFuaVWfc302UkDsECLDHhNLhcBBpCKXnps/HlutYdjEFlB/+SJQIekgUvEiIRn19KAMsvdxE8PGGEKTxSdaG8VrY2vzsLyrzOA+f9a+dngV/Jxa+U7I+XrpDaKgNBpmSzgOYgnILNwMbW+Wy/7NMEyER0Ot+t6WeeUpznvZimLgEOq+GXoiOsPJ6HzdRVy0HSBHdtV2i6lcz48odLqzjfctiaAz0KtydrJfqRhtmWyGhtA/g+EoyPHGCQ5rHFuEL4B+lIWUK0gAEuITGIZhGIZhmORzAFVa0dNZxTNHAAAAAElFTkSuQmCC"
                  class="level" /></a>
                  <span data-v-1b335720="" class="vip-label" style="
                  background-color: rgb(251, 114, 153);
                  color: rgb(255, 255, 255);
                "><span data-v-1b335720="" class="label-size">年度大会员</span></span>
            </p>
            <p data-v-1b335720="" class="social">
              <a data-v-1b335720="" href="//space.bilibili.com/7706705/fans/follow" target="_blank"><span data-v-1b335720=""
                  class="follow">281</span><span data-v-1b335720="" class="label">关注</span></a><a data-v-1b335720=""
                href="//space.bilibili.com/7706705/fans/fans" target="_blank"><span data-v-1b335720=""
                  class="fans">48.5万</span><span data-v-1b335720="" class="label">粉丝</span></a><span data-v-1b335720=""><span
                  data-v-1b335720="" class="like">202.3万</span><span data-v-1b335720="" class="label">获赞</span></span>
            </p>
            <p data-v-1b335720="" class="verify-desc">
              <i data-v-1b335720="" class="verify-icon type--0"></i><span data-v-1b335720="">bilibili个人认证：bilibili
                直播高能主播</span>
            </p>
            <p data-v-1b335720="" class="sign">
              ${card.sign}
            </p>
          </div>
          <div data-v-1b335720="" class="btn-box">
            <a data-v-1b335720="" class="like liked"><span data-v-1b335720="">已关注</span></a><a data-v-1b335720=""
              href="//message.bilibili.com/#whisper/mid7706705" target="_blank" class="message">发消息</a>
          </div>
        </div>
      </div>
    `
  }

  const init = async (isReflash = false) => {
    let firstGet = await API.getLiver();
    let liverNum = firstGet.count;
    if (isReflash || liverNum > 10) {
      let liveUpListDom = document.querySelector('.bili-dyn-live-users__body');
      if (liveUpListDom) {
        liveUpListDom.innerHTML = '';
        let allLiver = await API.getLiver(liverNum);
        // let addLiverItem = allLiver.items.slice(10);
        allLiver.items.forEach(item => {
          if (liveUpListDom !== null) {
            liveUpListDom.appendChild(Tool.s2d(getListItemTemplete(item)));
          }
        });
        document.querySelector('.bili-dyn-live-users__title span').innerHTML = `(${allLiver.items.length})`
      }
    }
  }

  const addRefleshBtn =  () => {
    const header = document.querySelector('.bili-dyn-live-users__header');
    const more = document.querySelector('.bili-dyn-live-users__more');
    const refleshBtn = Tool.s2d(`
      <button style="background: white; color: #99a2aa; cursor: pointer; border: #99a2aa;font-size: 12px;">刷新</button>
    `);
    try {
      header.insertBefore(refleshBtn, more);
      refleshBtn.addEventListener('click', async () => {
        refleshBtn.innerHTML = '正在刷新';
        await init(true);
        refleshBtn.innerHTML = '刷新';
      });
      refleshBtn.onmouseover = () => {
        refleshBtn.style.color = '#00a1d6';
      }
      refleshBtn.onmouseout  = () => {
        refleshBtn.style.color = '#99a2aa';
      }
    } catch (error) {
      console.log(error);
    }
  }
 
  window.addEventListener(
    'load',
    async () => {
      await init();
      addRefleshBtn();
    },
  )
})();