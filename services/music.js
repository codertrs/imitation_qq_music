import {
  rsRequest
} from "./index"


//轮播图
export function getMusicBanner(type = 0) {
  return rsRequest.get({
    url: "/banner",
    data: {
      type
    }
  })
}

export function getPlaylistDetail(id) {
  return rsRequest.get({
    url: "/playlist/detail",
    data: {
      id
    }
  })
}

//歌单
export function getSongMenuList(cat = "全部", limit = 6, offset = 0) {
  return rsRequest.get({
    url: "/top/playlist",
    data: {
      cat,
      limit,
      offset
    }
  })
}


  //热门歌单分类
  export function getSongMenuTag() {
    return rsRequest.get({
      url: "/playlist/hot"
    })
  }
  