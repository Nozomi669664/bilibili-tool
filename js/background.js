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

// 监听A-soul member开播(新)
const listenLiveRoomStatus = async (info) => {
  if (info) {
    // 获取英文名
    let name = membersInfo.find((item) => {
      return item.roomId === info.room_id;
    }).name.EN;
    // 如果监控列表无此项，则添加并设置值为false
    if (liveStatus[name] == undefined) {
      liveStatus[name] = false;
    }
    // 如果正在开播
    if (info.live_status === 1) {
      // 判断是否为第一次监测到
      // 如果是第一次就提醒并且将对应liveStatus改为true
      if (!liveStatus[name]) {
        // 发送推送提示
        const notifyOptions = {
          type: 'image',
          title: `${info.uname} 开播啦`,
          iconUrl: info.face,
          imageUrl: info.cover_from_user,
          message: info.title, 
        };
        chrome.notifications.create(`${name}-${(new Date()).getTime()}`, notifyOptions);
        // 修改liveStatus
        liveStatus[name] = !liveStatus[name];
      }
    } else {
      // 如果不在开播并且状态还是true就修改为false
      if (liveStatus[name]) {
        liveStatus[name] = false;
      }
    }
  }
}

// 监听进程(新)
const listenLiveRoomMain = async (time = 30000) => {
  console.log('开始监听直播间');
  let listenLiveRoomStatusId = setInterval(async () => {
    let midArr = membersInfo.map((member) => (member.mid));
    let info = await API.getStatusZInfoByUids(midArr);
    if (info.msg === 'fail') {
      console.error('getStatusZInfoByUids请求失败');
      return;
    }
    for (const key in info) {
      if (Object.hasOwnProperty.call(info, key)) {
        const item = info[key];
        listenLiveRoomStatus(item);
      }
    }
  }, time);
  // 返回监听任务id，方便用户自定义销毁
  return listenLiveRoomStatusId;
}

// 停止监听直播间
const closeSetInterval = (id) => {
  clearInterval(id);
  console.log('停止监听直播间');
}

// 当提示信息被点击时
chrome.notifications.onClicked.addListener((e) => {
  let name = e.split('-')[0];
  let roomId = membersInfo.find((item) => {
    return item.name.EN === name;
  }).roomId;
  let createProperties = {
    url: `https://live.bilibili.com/${roomId}`,
  };
  chrome.tabs.create(createProperties);
})

// 启动监听任务
let listenId = listenLiveRoomMain();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  setTimeout(async () => {
    if (request.type === 'getShortUrl') {
      let data = await API.getShortUrl(request.url);
      sendResponse({
        content: data.content || '',
      });
    }
  }, 0)
  return true;
});
