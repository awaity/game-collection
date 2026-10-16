import { App } from "./app";
import { MiniPlatform } from "@game-collection/platform/mini";
import type { MiniAPI } from "@game-collection/platform/mini";
declare const wx: MiniAPI, tt: MiniAPI, __MINI_TARGET__: "weixin" | "douyin";
new App(new MiniPlatform(__MINI_TARGET__ === "weixin" ? wx : tt));
