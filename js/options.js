const App = {
  data() {
    return {
      counter: 20,
      dataForm: {
        isListenLiveStatus: false,
        isIndex: false,
        isVideoLoop: false,
        isAutoWidescreen: false,
      },
      formOptions: [
        {
          type: 'title',
          name: '常规设置'
        },
        {
          name: '是否开启动态首页布局优化',
          type: 'switch',
          value: 'isIndex',
          tooltip: '隐藏原版右侧热门话题，将动态显示变更为双列',
          isDivider: false,
          onchange: (e) => {
            try {
              if (chrome.storage) {
                chrome.storage.local.set({isIndex: e}, () => {
                  // console.log('成功');
                  // this.dataForm.isIndex = e;
                });
              }
            } catch (error) {
              console.log('set isIndex from chrome storage error', error);
            }
          }
        },
        {
          name: '是否开启A-soul成员直播监控',
          type: 'switch',
          isDivider: true,
          value: 'isListenLiveStatus',
          tooltip: '每30s监测一次',
          onchange: (e) => {
            try {
              if (chrome.storage) {
                chrome.storage.local.set({isListenLiveStatus: e}, () => {
                  // this.dataForm.isListenLiveStatus = e;
                });
              }
            } catch (error) {
              console.log('set isListenLiveStatus from chrome storage error', error);
            }
          }
        },
        {
          type: 'title',
          name: '视频设置'
        },
        {
          name: '是否开启默认洗脑循环',
          type: 'switch',
          isDivider: false,
          value: 'isVideoLoop',
          onchange: (e) => {
            try {
              if (chrome.storage) {
                chrome.storage.local.set({isVideoLoop: e}, () => {
                  // this.dataForm.isVideoLoop = e;
                });
              }
            } catch (error) {
              console.log('set isVideoLoop from chrome storage error', error);
            }
          }
        },
        {
          name: '是否开启默认宽屏',
          type: 'switch',
          isDivider: true,
          value: 'isAutoWidescreen',
          onchange: (e) => {
            try {
              if (chrome.storage) {
                chrome.storage.local.set({isAutoWidescreen: e}, () => {
                  // this.dataForm.isAutoWidescreen = e;
                });
              }
            } catch (error) {
              console.log('set isAutoWidescreen from chrome storage error', error);
            }
          }
        },
        {
          type: 'title',
          name: '直播设置'
        },
      ],
      centerContentTitle: '常规设置',
      menuOptions: [
        {
          name: '常规设置',
        },
        {
          name: '视频设置',
        },
        {
          name: '直播设置',
        },
      ],
    }
  },
  methods: {
    btnClick (event) {
      console.log(event); 
    },
    menuItemClick (e) {
      this.centerContentTitle = e;
      let jumpArr = document.querySelector(`div[id=${e}]`);
      jumpArr.parentElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  },
  mounted() {
    try {
      if (chrome.storage) {
        chrome.storage.local.get([...Object.keys(this.dataForm)], (result) => {
          Object.keys(result).forEach((key) => {
            if (result[key] !== undefined) {
              this.dataForm[key] = result[key];
            }
          });
        });
      }
    } catch (error) {
      console.log('get from chrome storage error', error);
    }
  },
}

const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount("#app");
