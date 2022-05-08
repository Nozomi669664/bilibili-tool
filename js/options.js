const App = {
  data() {
    return {
      counter: 20,
      dataForm: {
        isListenLiveStatus: false,
        isIndex: false,
        isVideoLoop: false,
        isAutoWidescreen: false,
        isbilibiliHomeStyle: false,
      },
      addlistenMid: '',
      membersInfo: [],
      selectedLiver: [],
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
                  // this.dataForm.isIndex = e;
                });
              }
            } catch (error) {
              console.log('set isIndex from chrome storage error', error);
            }
          }
        },
        {
          name: '是否开启B站首页布局优化',
          type: 'switch',
          value: 'isbilibiliHomeStyle',
          tooltip: '隐藏主页左侧推荐，将推荐视频统一拓展为展示10个',
          isDivider: true,
          onchange: (e) => {
            try {
              if (chrome.storage) {
                chrome.storage.local.set({isbilibiliHomeStyle: e}, () => {
                  // this.dataForm.isbilibiliHomeStyle = e;
                });
              }
            } catch (error) {
              console.log('set isbilibiliHomeStyle from chrome storage error', error);
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
          type: 'table',
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
    // 封装ElMessage
    message (msg = '', type = 'info') {
      ElementPlus.ElMessage({
        showClose: true,
        message: msg,
        type: type,
        center: true,
      })
    },
    // 获取并更新监听成员信息
    updateMembersInfo () {
      chrome.storage.local.get(['membersInfo'], (result) => {
        this.membersInfo = result.membersInfo;
      });
    },
    // 侧边栏点击事件
    menuItemClick (e) {
      this.centerContentTitle = e;
      let jumpArr = document.querySelector(`div[id=${e}]`);
      jumpArr.parentElement.scrollIntoView({
        behavior: 'smooth',
      });
    },
    // 添加监听项事件
    async addListenClick (e) {
      try {
        if (this.membersInfo.every((item) => {
          return item.mid !== parseInt(this.addlistenMid.trim());
        })) {
          if (this.addlistenMid.trim() === '') {
            this.message('不能为空', 'warning');
            return;
          }
          const data = await API.getUserInfo(this.addlistenMid.trim());
          if (data && data.live_room) {
            const roomid = data.live_room.roomid;
            const name = data.name;
            const mid = data.mid;
            this.membersInfo.push({
              name,
              roomId: roomid,
              mid: mid,
            });
            chrome.storage.local.set({
              membersInfo: Array.from(this.membersInfo),
            }, () => {
              this.message('添加成功', 'success');
            });
          } else if (!data) {
            this.message('没有这个用户', 'error');
          } else {
            this.message('该用户没有直播间', 'error');
          }
        } else {
          this.message('已经添加过', 'error');
        }
      } catch (error) {
        console.log(error, '添加错误');
        this.message('添加错误', 'error');
      }
    },
    // 监听项选中事件
    liverSelectionChange (selectedData) {
      this.selectedLiver = selectedData;
    },
    // 移除已选监听
    deleteLiver (e) {
      if (this.selectedLiver.length !== 0) {
        const deleteLiverMids = this.selectedLiver.map(item => item.mid);
        const newMembersInfo = this.membersInfo.filter((item) => {
          if (deleteLiverMids.indexOf(item.mid) !== -1) {
            return false;
          }
          return true;
        });
        chrome.storage.local.set({
          membersInfo: newMembersInfo,
        }, () => {
          this.membersInfo = newMembersInfo;
          this.message('移除成功', 'success');
        });
      } else {
        this.message('所选项为空', 'warning');
      }
    }
  },
  mounted() {
    try {
      if (chrome.storage) {
        // 初始化表单内容
        chrome.storage.local.get([...Object.keys(this.dataForm)], (result) => {
          Object.keys(result).forEach((key) => {
            if (result[key] !== undefined) {
              this.dataForm[key] = result[key];
            }
          });
        });
        // 获取并更新监听成员信息
        this.updateMembersInfo();
      }
    } catch (error) {
      console.log('get from chrome storage error', error);
    }
  },
}

const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount("#app");
