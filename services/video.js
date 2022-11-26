import {
  rsRequest
} from "./index"

export function getTopMV(offset = 0, limit = 20) {
  return rsRequest.get({
    url: "/top/mv",
    data: {
      limit,
      offset
    }
  })
}

//获取 mv 播放地址
export function getMVUrl(id) {
  return rsRequest.get({
    url: "/mv/url",
    data: {
      id
    }
  })
}

//可获取不同排行榜数据
export function getMVInfo(mvid) {
  return rsRequest.get({
    url: "/mv/detail",
    data: {
      mvid
    }
  })
}

//获取相关视频
export function getMVRelated(id) {
  return rsRequest.get({
    url: "/related/allvideo",
    data: {
      id
    }
  })
}