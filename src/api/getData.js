import { get } from "./http.js";

export function topfreeapplications(params) {
  // 免费最多app列表
  return get(
    `https://itunes.apple.com/hk/rss/topfreeapplications/limit=${params}/json`
  );
}
export function topgrossingapplications(params) {
  // 顶部推荐app列表
  return get(
    `https://itunes.apple.com/hk/rss/topgrossingapplications/limit=${params}/json`
  );
}
export function lookup(params) {
  // 获取详细信息
  return get(`https://itunes.apple.com/hk/lookup?id=${params}`);
}
