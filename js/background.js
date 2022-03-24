chrome.runtime.onInstalled.addListener(function(details) {

});

// 直播状态
let AvALiveStatus = false;
let BellaLiveStatus = false;
let CarolLiveStatus = false;
let DianaLiveStatus = false;
let ElieenLiveStatus = false;

let liveStatus = {
  AvA: false,
  Bella: false,
  Carol: false,
  Diana: false,
  Elieen: false,
}

console.log(API);

const listenLiveRoomStatus = async ({ roomId, name, mid }) => {
  const info = await API.getRoomInfo(roomId);
  if (info) {
    if (info.live_status === 1) {
      // console.log(name);
      if (!liveStatus[name.EN]) {
        let userInfo = await API.getUserInfo(mid);
        console.log(userInfo);
        const notifyOptions = {
          type: 'image',
          title: `${userInfo.name} 开播啦`,
          iconUrl: userInfo.face,
          imageUrl: info.user_cover,
          message: info.title, 
        }
        chrome.notifications.create('kaibo', notifyOptions);
        liveStatus[name.EN] = !liveStatus[name.EN];
      }
    } else {
      if (liveStatus[name.EN]) {
        liveStatus[name.EN] = false;
      }
    }
  }
}

// const notifyOptions1 = {
//   type: 'basic',
//   title: `嘉然开播啦`,
//   iconUrl: '/images/logo.png',
//   message: `嘉然开播啦`, 
// }
// setTimeout(() => {
//   chrome.notifications.create('kaibo', notifyOptions1);
// }, 2000)

setInterval(async () => {
  for (const name in memberInfo) {
    if (Object.hasOwnProperty.call(memberInfo, name)) {
      await listenLiveRoomStatus(memberInfo[name]);
    }
  }
}, 30000);