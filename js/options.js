const App = {
  data() {
    return {
      counter: 20,
      dataForm: {
        isListenLiveStatus: false,
        isIndex: false,
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
          name: '是否开启A-soul成员监控',
          type: 'switch',
          isDivider: true,
          value: 'isListenLiveStatus',
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
        chrome.storage.local.get(['isListenLiveStatus', 'isIndex'], (result) => {
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
