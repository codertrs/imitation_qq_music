import {rsRequest} from "./index"

export function getSongDetail(ids){
  return rsRequest.get({
    url:"/song/detail",
    data:{
      ids
    }
  })
}

export function getSongLyric(id){
  return rsRequest.get({
    url:"/lyric",
    data:{
      id
    }
  })
}