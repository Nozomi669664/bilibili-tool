const App = {
  data() {
    return {
      counter: 20,
      formOptions: [
        {
          name: '是否开启A-soul成员监控',
        },
        {
          name: '是否开启动态首页布局优化',
        },
      ],
    }
  }
}

const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount("#app");
