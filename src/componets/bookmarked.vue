<template>
  <section class="all-games">
    <h1 class="all-games-title">Bookmarked Games</h1>
    <p class="all-games-count">
      {{ bookmarkCount }} bookmark<span v-if="bookmarkCount !== 1">s</span>
    </p>

    <div v-if="games.length" class="section-grid">
      <div
        v-for="g in games"
        :key="g.gameId"
        class="game-card"
      >
        <a :href="`/content/${encodeURIComponent(g.gameId)}`">
          <div class="thumb">
            <img :src="g.logoUrl || ''" :alt="g.title" />
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

    <div v-else class="no-results">
      <p>You haven’t bookmarked any games yet.</p>
      <p>Browse the site and tap the bookmark icon on a game to save it here.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const BOOKMARK_KEY = 'be_bookmarks';

const games = ref([]);
const bookmarkIds = ref([]);

function loadIdArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function truncateAtSpace(str, maxLen = 120) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  const truncated = str.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');
  const clean =
    lastSpace > 0 ? truncated.slice(0, lastSpace).trim() : truncated.trim();
  return clean + '...';
}

const bookmarkCount = computed(() => bookmarkIds.value.length);

onMounted(async () => {
  bookmarkIds.value = loadIdArray(BOOKMARK_KEY);

  const res = await fetch('/top500games.json');
  if (!res.ok) {
    console.error('Failed to load top500games.json');
    return;
  }
  const data = await res.json();
  const allGames = data.games ?? data;

  games.value = allGames.filter((g) =>
    bookmarkIds.value.includes(g.gameId),
  );
});
</script>

<style scoped>
.all-games {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.all-games-title {
  font-size: 1.6rem;
  margin-bottom: 0.25rem;
}

.all-games-count {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
}

.no-results {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--color-text-muted);
}

/* cards/grid use your existing global styles:
   .section-grid, .game-card, .thumb, .titleCard, .card-discription */
</style>
