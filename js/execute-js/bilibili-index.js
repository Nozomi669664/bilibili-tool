(function () {
  "use strict";
  let styleStr = `
    .home-content {
      width: 1524px !important;
    }
    
    .center-panel {
      width: 1272px !important;
    }
    
    .right-panel {
      // width: 244px !important;
      display: none !important;
    }

    .most-viewed-panel {
      margin-bottom: 0px !important;
    }
    
    .content {
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: space-between !important;
      width:100% !important;
    }
    
    .content .card {
      width: 50% !important;
      height: calc(100% - 8px) !important;
      margin-top: 8px !important;
    }
    
    .new-notice-bar {
      margin-top: 8px !important;
      margin-bottom: 0px !important;
      flex-basis:100% !important;
    }

    .feed-card .tab-bar {
      margin-top: 8px !important;
      margin-bottom: 0px !important;
    }
    
    .loading-content {
      margin-top: 8px !important;
    }

    .content>div{
      width: 632px !important;
    }

    @media screen and (min-width: 1921px) {
      .home-content[data-v-d112ac46] {
        /* width: auto !important;*/
        width: 1524px !important;
      }
    }
    
    @media screen and (min-width: 1921px) {
      .home-content .center-panel[data-v-d112ac46] {
        width: 1272px !important;;
      }
    }
  `
  let body = document.body;
  let styleDom = document.createElement('style');
  styleDom.id = 'tuntun-bilibili-index'
  styleDom.innerHTML = styleStr;
  body.appendChild(styleDom);
})();

