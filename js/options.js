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
          name: '是否开启动态首页布局优化',
          type: 'switch',
          value: 'isIndex',
          onchange: (e) => {
            this.dataForm.isIndex = e;
            console.log(this.dataForm.isIndex);
            try {
              if (chrome.storage) {
                chrome.storage.local.set({isIndex: e}, () => {
                  // console.log('isIndex is set to ' + e);
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
          value: 'isListenLiveStatus',
          onchange: (e) => {
            this.dataForm.isListenLiveStatus = e;
            console.log(this.dataForm.isListenLiveStatus);
            try {
              if (chrome.storage) {
                chrome.storage.local.set({isListenLiveStatus: e}, () => {
                  // console.log('isListenLiveStatus is set to ' + e);
                });
              }
            } catch (error) {
              console.log('set isListenLiveStatus from chrome storage error', error);
            }
          }
        },
      ],
    }
  },
  methods: {
    btnClick(event) {
      console.log(event); 
    }
  },
  mounted() {
    try {
      if (chrome.storage) {
        chrome.storage.local.get(['isListenLiveStatus', 'isIndex'], (result) => {
          console.log(result);
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
