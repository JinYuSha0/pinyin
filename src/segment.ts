import nodejieba from "@node-rs/jieba";
import { load, cut /*, tag */ } from "@node-rs/jieba";
// @ts-ignore
import { Segment, useDefault } from "segmentit";
import type { IPinyinSegment } from "./declare";

let nodeRsJiebaLoaded = false; // @node-rs/jieba 加载词典。
let segmentit: any; // segmentit 加载词典。
let hansIntlSegmenter: any; // Intl.Segmenter

/**
 * TODO: 分词并带词性信息，需要调整 segment_pinyin 方法。
 * 分词并标注词性。
 */
export function segment(hans: string, segment?: IPinyinSegment): string[] {
  // @node-rs/jieba (Rust)
  if (segment === "@node-rs/jieba") {
    if (!nodeRsJiebaLoaded) {
      nodeRsJiebaLoaded = true;
      load();
    }
    return cut(hans, false);
    // return tag(hans);
  }

  // segmentit (Node.js)
  if (segment === "segmentit") {
    if (!segmentit) {
      segmentit = useDefault(new Segment());
    }
    return segmentit.doSegment(hans, {
      simple: true,
    });
  }

  // Intl.Segmenter
  if (segment === "Intl.Segmenter") {
    if (Intl.Segmenter) {
      if (!hansIntlSegmenter) {
        hansIntlSegmenter = new Intl.Segmenter("zh-Hans-CN", {
          granularity: "word",
        });
      }
      return [...hansIntlSegmenter.segment(hans)].map((s) => s.segment);
    }
  }

  // 默认使用 nodejieba (C++)
  // return nodejieba.tag(hans);
  // nodejieba 定义的类型返回值错误，先忽略。
  // @ts-ignore
  return nodejieba.cutSmall(hans, 4);
}
