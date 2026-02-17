<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  games: { type: Array, required: true },
});

function getLogoSync(logoUrl){
  return "/imgs/gameLogo/" + logoUrl
}

function truncateAtSpace(text, maxLen = 140) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  const slice = text.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(' ');
  const clean = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim();
  return clean + '...';
}
</script>

<template>
  <section class="all-games">
    <h1 class="gameTitle">All Games</h1>
    <p class="all-games-count">{{ games.length }} games</p>

    <div class="section-grid">
      <div
        v-for="g in games"
        :key="g.gameId"
        class="game-card"
      >
        <a :href="`/content/${encodeURIComponent(g.gameId)}`">
          <div class="thumb">
            <img :src="getLogoSync(g.logoUrl)" :alt="g.title" />
          </div>
        </a>
        <a :href="`/content/${encodeURIComponent(g.gameId)}`">
          <div class="titleCard">{{ g.title }}</div>
          <div class="card-discription">
            {{ truncateAtSpace(g.originalDescription) }}
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
