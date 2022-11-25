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

export function getMVUrl(id) {
  return rsRequest.get({
    url: "/mv/url",
    data: {
      id
    }
  })
}

export function getMVInfo(mvid) {
  return rsRequest.get({
    url: "/mv/detail",
    data: {
      mvid
    }
  })
}

export function getMVRelated(id) {
  return rsRequest.get({
    url: "/related/allvideo",
    data: {
      id
    }
  })
}