const App = {
  data() {
    return {
      
    }
  },
  methods: {
    openOptionPage() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('options.html'));
      }
    },
  },
  mounted() {
    
  },
}

const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount("#app");
