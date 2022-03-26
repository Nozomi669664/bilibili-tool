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
const listenLiveRoomStatus = async ({ roomId, name, mid }, memberInfoIndex = '') => {
  const info = await API.getRoomInfo(roomId);
  if (info) {
    // 如果正在开播
    if (info.live_status === 1) {
      // 判断是否为第一次监测到
      // 如果是第一次就提醒并且将对应liveStatus改为true
      if (!liveStatus[name.EN]) {
        // 获取对应用户信息
        let userInfo = await API.getUserInfo(mid);
        // 发送推送提示
        const notifyOptions = {
          type: 'image',
          title: `${userInfo.name} 开播啦`,
          iconUrl: userInfo.face,
          imageUrl: info.user_cover,
          message: info.title, 
        };
        chrome.notifications.create(memberInfoIndex, notifyOptions);
        // 修改liveStatus
        liveStatus[memberInfoIndex] = !liveStatus[memberInfoIndex];
      }
    } else {
      // 如果不在开播并且状态还是true就修改为false
      if (liveStatus[memberInfoIndex]) {
        liveStatus[memberInfoIndex] = false;
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
        await listenLiveRoomStatus(memberInfo[name], name);
      }
    }
  }, 30000);
  // 返回监听任务id，方便用户自定义销毁
  return listenLiveRoomStatusId;
}

function closeSetInterval(id) {
  clearInterval(id);
}

// 当提示信息被点击时
chrome.notifications.onClicked.addListener((e) => {
  // console.log(memberInfo[e]);
  let info = memberInfo[e];
  let createProperties = {
    url: `https://live.bilibili.com/${info.roomId}`,
  };
  chrome.tabs.create(createProperties);
})

// 启动监听任务
let listenId = listenLiveRoomMain();
