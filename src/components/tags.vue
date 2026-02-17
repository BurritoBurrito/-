<template>
    <div class="mainView">
        <div class="gameViewWraper">
            <p class="gameTitle">{{currentTag}} Games</p>
            <div class="tagGames"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  currentTag: { type: String, required: true },
});

const getLogoSync = (logoFile) => {
  if (!logoFile) return '/fallback-logo.png';
  return "/imgs/gameLogo/" + logoFile
};

async function initHomeSections() {
  const res = await fetch('/top500games.json');
  if (!res.ok) {
    console.error('Failed to load top500games.json');
    return;
  }
  const data = await res.json();
  const games = data.games ?? data;
  console.log(games);

  function truncateAtSpace(str, maxLen = 50) {
    if (str.length <= maxLen) return str;
    const truncated = str.slice(0, maxLen);
    const lastSpace = truncated.lastIndexOf(' ');
    const clean = lastSpace > 0 ? truncated.slice(0, lastSpace).trim() : truncated.trim();
    return clean + '...';
  }

  function renderSection(selector, gamesList) {
    const container = document.querySelector(selector);
    if (!container) return;

    container.classList.add('section-grid');

    container.innerHTML = gamesList
      .map(
        (g) => `
        <div class="game-card">
          <a href="/content/${encodeURIComponent(g.gameId)}">
            <div class="thumb">
              <img src="${getLogoSync(g.logoUrl)}" alt="${g.title}">
            </div>
          </a>
          <a href="/content/${encodeURIComponent(g.gameId)}">
            <div class="titleCard">${g.title}</div>
            <div class="card-discription">${truncateAtSpace(g.originalDescription)}</div>
          </a>
        </div>
      `,
      )
      .join('');
  }

  const tagGames = games.filter((g) =>
    (g.tags || []).includes(props.currentTag),
  );

  renderSection('.tagGames', tagGames);
}

onMounted(() => {
  initHomeSections().catch((err) => {
    console.error('Failed to init home sections', err);
  });
});
</script>