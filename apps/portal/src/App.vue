<script setup lang="ts">
import { ref } from "vue";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronDown,
  Clock3,
  Gamepad2,
  Github,
  Hand,
  Keyboard,
  Monitor,
  MousePointer2,
  Play,
  Smartphone,
  Volume2,
} from "lucide-vue-next";
import { games, gameHref, assetHref } from "./catalog";

const expanded = ref<string | null>(null);
const toggleGuide = (slug: string) => {
  expanded.value = expanded.value === slug ? null : slug;
};
</script>

<template>
  <a class="skip-link" href="#games">跳到游戏列表</a>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="./" aria-label="开局游戏厅首页">
        <span class="brand-icon"
          ><Gamepad2 :size="25" :stroke-width="2" aria-hidden="true"
        /></span>
        <span class="brand-name">开局<span>小游戏，大快乐。</span></span>
      </a>
      <nav class="top-nav" aria-label="主导航">
        <a class="active" href="#games">游戏大厅</a>
        <a class="how-link" href="#how-to">怎么玩</a>
        <a
          class="github-link"
          href="https://github.com/awaity/game-collection"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="在 GitHub 查看项目源码（新窗口）"
          ><Github :size="19" aria-hidden="true" /><span>GitHub</span
          ><ArrowUpRight :size="13" class="external-icon" aria-hidden="true"
        /></a>
      </nav>
    </header>

    <main>
      <section class="intro" aria-labelledby="page-title">
        <div class="intro-copy">
          <h1 id="page-title">休息一下，<br class="mobile-break" />开一局。</h1>
          <p>
            广告里的小游戏，这次真的能玩。<br
              class="mobile-break"
            />选一款，马上开局。
          </p>
        </div>
        <div class="intro-note">
          <span class="note-dot"></span><span>免安装，点开即玩</span>
          <div class="device-icons" role="img" aria-label="支持手机和电脑">
            <Smartphone :size="17" aria-hidden="true" /><span>/</span
            ><Monitor :size="18" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="games" class="games-section" aria-labelledby="games-title">
        <div class="section-heading">
          <h2 id="games-title">挑一款喜欢的</h2>
          <span
            >{{ games.length }} 款小游戏
            <ArrowDown :size="14" aria-hidden="true"
          /></span>
        </div>
        <div class="games-grid">
          <article
            v-for="(game, index) in games"
            :key="game.slug"
            :class="['game-card', `theme-${game.theme}`]"
            :aria-labelledby="`${game.slug}-title`"
          >
            <a
              class="game-cover"
              :href="gameHref(game.slug)"
              :aria-label="`开始玩${game.title}`"
            >
              <img
                :src="assetHref(game.cover)"
                :alt="game.coverAlt"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                width="840"
                height="630"
                :style="{ objectPosition: game.coverPosition }"
              />
              <span class="cover-badge"><span></span>{{ game.badge }}</span>
              <span class="cover-caption">实机画面</span>
              <span class="cover-play" aria-hidden="true"
                ><Play :size="22" fill="currentColor"
              /></span>
            </a>
            <div class="game-info">
              <div class="game-title-row">
                <h3 :id="`${game.slug}-title`">{{ game.title }}</h3>
                <span class="game-time"
                  ><Clock3 :size="13" aria-hidden="true" />{{
                    game.duration
                  }}</span
                >
              </div>
              <p class="game-subtitle">{{ game.subtitle }}</p>
              <p class="game-description">{{ game.description }}</p>
              <ul class="game-tags" aria-label="游戏特点">
                <li v-for="tag in game.tags" :key="tag">{{ tag }}</li>
              </ul>
              <div class="game-actions">
                <a class="play-button" :href="gameHref(game.slug)"
                  ><Play
                    :size="15"
                    fill="currentColor"
                    aria-hidden="true"
                  />开始游戏</a
                >
                <button
                  type="button"
                  class="guide-button"
                  :aria-expanded="expanded === game.slug"
                  :aria-controls="`${game.slug}-guide`"
                  @click="toggleGuide(game.slug)"
                >
                  玩法说明<ChevronDown
                    :size="16"
                    :class="{ rotated: expanded === game.slug }"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div
                v-show="expanded === game.slug"
                :id="`${game.slug}-guide`"
                class="game-guide"
              >
                <p>
                  <Smartphone :size="17" aria-hidden="true" /><span
                    ><strong>手机</strong>{{ game.controls.touch }}</span
                  >
                </p>
                <p>
                  <Keyboard :size="17" aria-hidden="true" /><span
                    ><strong>电脑</strong>{{ game.controls.keyboard }}</span
                  >
                </p>
                <p class="game-tip">{{ game.tip }}</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="how-to" class="how-to" aria-labelledby="how-to-title">
        <div class="how-heading">
          <h2 id="how-to-title">不用研究，直接上手。</h2>
          <p>两款游戏都会自动开火，你只需要负责走位。</p>
        </div>
        <div class="how-grid">
          <div class="how-item">
            <span class="how-icon"><Hand :size="22" aria-hidden="true" /></span>
            <div>
              <h3>手机左右拖动</h3>
              <p>一根手指，升级、躲避、清场。</p>
            </div>
          </div>
          <div class="how-item">
            <span class="how-icon"
              ><MousePointer2 :size="22" aria-hidden="true"
            /></span>
            <div>
              <h3>电脑鼠标或键盘</h3>
              <p>拖动鼠标，或使用 A / D、方向键。</p>
            </div>
          </div>
          <div class="how-item">
            <span class="how-icon"
              ><Volume2 :size="22" aria-hidden="true"
            /></span>
            <div>
              <h3>按自己的节奏玩</h3>
              <p>随时暂停、静音，失手了就再来一局。</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>
        <Gamepad2 :size="17" aria-hidden="true" />开局游戏厅<span
          >认真做一点好玩的。</span
        >
      </p>
      <a
        href="https://github.com/awaity/game-collection"
        target="_blank"
        rel="noopener noreferrer"
        >项目与更新<ArrowUpRight :size="14" aria-hidden="true"
      /></a>
    </footer>
  </div>
</template>
