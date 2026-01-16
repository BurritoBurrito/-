<!-- src/components/GameSearch.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  gameLogos: { type: Object, required: false }
});

function searchGameLogos(id) {
  const matchingKey = Object.keys(props.gameLogos || {}).find(key => 
    key.endsWith(id)
  );
  return matchingKey || "/fallback-logo.png";
}

const getLogoSync = (logoFile) => {
  if (!logoFile) return '/fallback-logo.png';
  return searchGameLogos(logoFile) || '/fallback-logo.png';
};

const searchQuery = ref('');
const allGames = ref([]);

function truncateAtSpace(text, maxLen = 70) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  const slice = text.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(' ');
  const clean = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim();
  return clean + '...';
}

onMounted(async () => {
  const res = await fetch('/top500games.json');
  const data = await res.json();
  allGames.value = data.games || data;
});

function sampleRandom(arr, n) {
  const copy = arr.slice();               
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

const filteredGames = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();

  if (!q) {
    return sampleRandom(allGames.value, 12);
  }

  return allGames.value.filter((g) => {
    const title = (g.title || '').toLowerCase();
    const desc = (g.originalDescription || '').toLowerCase();
    const dev = (g.developer || '').toLowerCase();
    const tags = (g.tags || []).join(' ').toLowerCase();
    return (
      title.includes(q) ||
      desc.includes(q) ||
      dev.includes(q) ||
      tags.includes(q)
    );
  });
});


</script>

<template>
  <section class="search-section">
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search games by title, tag, or description..."
      />
    <span class="search-count">
      {{ searchQuery.trim() ? filteredGames.length : allGames.length }} results
    </span>

    </div>

    <div class="section-grid"  v-if="filteredGames.length">
      <div
        v-for="g in filteredGames"
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
    <div class="no-results" v-else>
        <p>No games found. Try another title, tag, or developer.</p>
        <img src="/src/assets/imgs/favicon/burritoCrying.png">
    </div>

  </section>
</template>