// 成员列表信息
const memberInfo = {
  AvA: {
    name: {
      CN: '向晚',
      EN: 'AvA',
    },
    mid: '672346917',
    roomId: '22625025',
  },
  Bella: {
    name: {
      CN: '贝拉',
      EN: 'Bella',
    },
    mid: '672353429',
    roomId: '22632424',
  },
  Carol: {
    name: {
      CN: '珈乐',
      EN: 'Carol',
    },
    mid: '351609538',
    roomId: '22634198',
  },
  Diana: {
    name: {
      CN: '嘉然',
      EN: 'Diana',
    },
    mid: '672328094',
    roomId: '22637261',
  },
  Elieen: {
    name: {
      CN: '乃琳',
      EN: 'Elieen',
    },
    mid: '672342685',
    roomId: '22625027',
  },
}

const Tool = {
  // 大数转万
  formatBigNumber: (num) => {
    return num > 10000 ? `${(num / 10000).toFixed(2)}万` : num
  },
  // 字符串转DOM
  s2d: (string) => {
    return new DOMParser().parseFromString(string, 'text/html').body
      .childNodes[0]
  },
  // 发布时间格式化
  diffTime: (time) => {
    let upDate = new Date(parseInt(time, 10) * 1000);
    let nowDate = new Date();
    let nowTime = nowDate.getTime(),
        upTime = upDate.getTime(),
        Day = 24 * 60 * 60 * 1000,
        Hours = 60 * 60 * 1000,
        Minutes = 60 * 1000,
        diffDay = parseInt((nowTime - upTime) / Day),
        diffHours = parseInt((nowTime - upTime) / Hours),
        diffMinutes = Math.floor((nowTime - upTime) / Minutes);
    if(diffDay != 0 && diffDay < 7) {
      if ( diffDay === 1 ) {
        return '昨天'
      }
      return diffDay + '天前';
    }
    else if(diffDay === 0 && diffHours != 0) {
      return diffHours + '小时前';
    }
    else if(diffDay === 0 && diffHours === 0 && diffMinutes != 0) {
      return diffMinutes + '分钟前';
    }
    else if (diffDay === 0 && diffHours === 0 && diffMinutes === 0) {
      return '刚刚';
    }
    else {
      let month = upDate.getMonth() + 1;
      let day = upDate.getDate();
      if (nowDate.getFullYear() !== upDate.getFullYear()) {
        return `${upDate.getFullYear()}-${month < 10 ? 0 : ''}${month}-${day < 10 ? 0 : ''}${day}`
      }
      return `${month < 10 ? 0 : ''}${month}-${day < 10 ? 0 : ''}${day}`
    }    
  },
  // 判断发布时间与现在时间是否过长
  isTimeTooLate: (time, rangeDay = 30) => {
    let day = parseInt(rangeDay, 10);
    if (day === 0) {
      return false;
    }
    let upData = new Date(parseInt(time, 10) * 1000);
    let nowTime = new Date().getTime(),
        upTime = upData.getTime(),
        Day = 24 * 60 * 60 * 1000,
        diffDay = parseInt((nowTime - upTime) / Day);
    if (diffDay > day) {
      return true;
    }
    return false;
  },
  English2Chinese: (EnglishName) => {
    for (const name in memberInfo) {
      if (Object.hasOwnProperty.call(memberInfo, name)) {
        if (name === EnglishName) {
          return memberInfo[name].name;
        }
      }
    }
  }
}

const API = {
  // 封装get方法
  Get: async (props) => {
    const { url: baseUrl, params = {} } = props;
    let pStr = Object.keys(params).map((key) => {
      return `${key}=${params[key]}`;
    }).join('&');
    let url = `${baseUrl}${pStr !== '' ? '?' : ''}${pStr}`;
    try {
      let res = await fetch(url, {
        credentials: "include"
      });
      return (await res.json()).data;
    } catch (error) {
      console.error('Get Error', error);
    }
  },
  // 通过关键词获取视频数据
  getLiver: async (num = 0) => {
    try {
      let params = {};
      if (num !== 0) {
        params = {
          size: num
        }
      }
      let res = await API.Get({
        url: 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users',
        params,
      });
      return res;
    } catch (error) {
      console.log('getLiver', error);
    }
  },
  getCard: async (mid) => {
    try {
      let res = await API.Get({
        url: 'https://api.bilibili.com/x/web-interface/card',
        params: {
          mid,
          photo: 'true',
        },
      });
      return res;
    } catch (error) {
      console.log('getCard', error);
    }
  },
  getRoomInfo: async (roomId) => {
    try {
      let res = await API.Get({
        url: 'https://api.live.bilibili.com/room/v1/Room/get_info',
        params: {
          id: roomId
        }
      });
      return res
    } catch (error) {
      console.log('getRoomInfo', error);
    }
  },
  getUserInfo: async (mid) => {
    try {
      let res = await API.Get({
        url: 'http://api.bilibili.com/x/space/acc/info',
        params: {
          mid: mid
        }
      });
      return res
    } catch (error) {
      console.log('getRoomInfo', error);
    }
  }
}
