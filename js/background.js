chrome.runtime.onInstalled.addListener(function(details) {

});

// 直播状态
let liveStatus = {
  AvA: false,
  Bella: false,
  Carol: false,
  Diana: false,
  Elieen: false,
}

// 监听A-soul member开播
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

// 监听进程
const listenLiveRoomMain = () => {
  console.log('开始监听直播间');
  let listenLiveRoomStatusId = setInterval(async () => {
    for (const name in memberInfo) {
      if (Object.hasOwnProperty.call(memberInfo, name)) {
        await listenLiveRoomStatus(memberInfo[name]);
      }
    }
  }, 30000);
  return listenLiveRoomStatusId;
}

function closeSetInterval(id) {
  clearInterval(id);
}

let listenId = listenLiveRoomMain();
