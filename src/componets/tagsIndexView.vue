<!-- src/components/TagStacks.vue -->
<script setup>
const props = defineProps({
  games: { type: Array, required: true },
});

const getLogoSync = (logoFile) => {
  if (!logoFile) return '/fallback-logo.png';
  return "/imgs/gameLogo/" + logoFile
};

const tagMap = props.games.reduce((map, game) => {
  (game.tags || []).forEach((tag) => {
    if (!map[tag]) map[tag] = [];
    map[tag].push(game);
  });
  return map;
}, {});

function sampleGames(arr, n) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}
</script>

<template>
  <section class="tag-stacks">
    <a
      v-for="(tagGames, tag) in tagMap"
      :key="tag"
      class="tag-stack-card"
      :href="`/tag/${encodeURIComponent(tag)}`"
    >
      <div class="covers">
        <div
          v-for="(game, index) in sampleGames(tagGames, 5)"
          :key="game.gameId"
          class="cover"
          :style="{ '--offset': index }"
        >
          <img
            :src="getLogoSync(game.logoUrl)"
            :alt="game.title"
            loading="lazy"
          />
        </div>

        <div class="count-badge">
          {{ tagGames.length }}
        </div>
      </div>

      <div class="tag-footer">
        <span class="tag-name">{{ tag }}</span>
        <span class="tag-extra">View all games →</span>
      </div>
    </a>
  </section>
</template>

