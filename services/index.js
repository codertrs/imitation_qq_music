import {
  baseURL
} from "./config"

class rRequest {

  constructor(baseURL) {
    this.baseURL = baseURL
  }

  request(options) {
    const {
      url
    } = options
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url: this.baseURL + url,
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  get(options) {
    return this.request({
      ...options,
      method: "get"
    })
  }

  post(options) {
    return this.request({
      ...options,
      method: "post"
    })
  }
}

export const rsRequest = new rRequest(baseURL)