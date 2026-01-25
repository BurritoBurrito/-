<template>
    <section class="hero">
      <h1 class="hero-title">Discover classic web games</h1>
      <p class="hero-subtitle">
        Hand‑picked Flash and web games from the Burrito Edition archive.
      </p>
    </section>
    <div class="mainView">
        <div class="gameViewWraper">
            <div class="viewHeader">
                <p class="gameGroupTag">Continue Playing</p>
            </div>
            <div class="continuePlaying"></div>
        </div>
        <div class="gameViewWraper">
            <div class="viewHeader">
                <p class="gameGroupTag">Bookmarket Games</p>
                <a href="/content/bookmarked" class="viewAllGamesTag">View all Bookmarked→</a>
            </div>
            <div class="bookmarketedGames"></div>
        </div>
        <div class="sideBysideView">
            <div class="gameViewWarperVertical">
                <div class="viewHeader">
                    <p class="gameGroupTag">New Games</p>
                    <a href="/content/allGames" class="viewAllGamesTag">View all New→</a>
                </div>
                <div class="newGames"></div>
            </div>
            <div class="gameViewWarperVertical">
              <div class="viewHeader">
                <p class="gameGroupTag">Popular Games</p>
                <div class="popular-toggle">
                  <button data-range="today" class="popular-btn">Today</button>
                  <button data-range="week" class="popular-btn popular-btn--active">Week</button>
                  <button data-range="allTime" class="popular-btn">All‑time</button>
                </div>
              </div>
              <div class="popularGames"></div>
            </div>
        </div>
        <div class="gameViewWraper">
            <div class="viewHeader">
                <p class="gameGroupTag">Action Games</p>
                <a href="/tag/Action" class="viewAllGamesTag">View all Action→</a>
            </div>
            <div class="actionTagedGames"></div>
        </div>
        <div class="gameViewWraper">
            <div class="viewHeader">
                <p class="gameGroupTag">Puzzle Games</p>
                <a href="/tag/Puzzle" class="viewAllGamesTag">View all Puzzle→</a>
            </div>
            <div class="puzzleTagedGames"></div>
        </div>
        <div class="gameViewWraper">
            <div class="viewHeader">
                <p class="gameGroupTag">Curated Games For You</p>
                <a href="/content/allGames" class="viewAllGamesTag">View all Curated→</a>
            </div>
            <div class="randomTagedGames"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const getLogoSync = (logoFile) => "/imgs/gameLogo/" + logoFile;

const BOOKMARK_KEY = 'be_bookmarks';
const CONTINUE_KEY = 'be_continue';

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

function extractGameId(path) {
  return path.match(/\/content\/(.+?)\//)?.[1] || path.match(/\/content\/(.+)/)?.[1] || '';
}

async function initHomeSections() {
  const topRes = await fetch('/top500games.json');
  if (!topRes.ok) {
    console.error('Failed to load top500games.json');
    return;
  }
  const topData = await topRes.json();
  const games = topData.games ?? topData;

  let analyticsData = null;
  try {
    const analyticsRes = await fetch('https://analytics.burritoedition.com/top-games.json');
    if (analyticsRes.ok) {
      analyticsData = await analyticsRes.json();
    }
  } catch (e) {
    console.warn('Failed to load analytics top games', e);
  }

  function truncateAtSpace(str, maxLen = 50) {
    if (!str) return '';
    if (str.length <= maxLen) return str;
    const truncated = str.slice(0, maxLen);
    const lastSpace = truncated.lastIndexOf(' ');
    const clean = lastSpace > 0 ? truncated.slice(0, lastSpace).trim() : truncated.trim();
    return clean + '...';
  }

  function renderSection(selector, gamesList, maxItems = 6) {
    const container = document.querySelector(selector);
    if (!container) return;
    const slice = gamesList.slice(0, maxItems);
    container.classList.add('section-grid');
    container.innerHTML = slice.map((g) => `
      <div class="game-card">
        <a href="/content/${encodeURIComponent(g.gameId)}">
          <div class="thumb">
            <img src="${getLogoSync(g.logoUrl)}" alt="${g.title}">
          </div>
        </a>
        <a href="/content/${encodeURIComponent(g.gameId)}">
          <div class="titleCard">${g.title}</div>
          <div class="card-discription">
            ${truncateAtSpace(g.originalDescription)}
          </div>
        </a>
      </div>
    `).join('');
  }

  function renderVertical(selector, gamesList, maxItems = 6) {
    const container = document.querySelector(selector);
    if (!container) return;
    const slice = gamesList.slice(0, maxItems);
    container.classList.add('section-grid');
    container.innerHTML = slice.map((g) => `
      <div class="game-card-fixed">
        <a href="/content/${encodeURIComponent(g.gameId)}">
          <div class="thumb">
            <img src="${getLogoSync(g.logoUrl)}" alt="${g.title}">
          </div>
        </a>
        <a href="/content/${encodeURIComponent(g.gameId)}">
          <div class="titleCard">${g.title}</div>
          <div class="card-discription">
            ${truncateAtSpace(g.originalDescription)}
          </div>
        </a>
      </div>
    `).join('');
  }

  function pickRandom(list, count) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  }

  const bookmarkIds = loadIdArray(BOOKMARK_KEY);
  const continueIds = loadIdArray(CONTINUE_KEY);

  const bookmarkedGames = games.filter((g) => bookmarkIds.includes(g.gameId));
  const continuePlayingGames = games.filter((g) => continueIds.includes(g.gameId));

  function hideSectionIfEmpty(selector, gamesList) {
    if (gamesList.length) return;
    const container = document.querySelector(selector);
    if (!container) return;
    container.classList.add('section-grid');
    container.innerHTML = '<p>No games yet.</p>';
  }

  const newGames = games.slice(-6);
  const actionGames = games.filter((g) => (g.tags || []).includes('Action'));
  const puzzleGames = games.filter((g) => (g.tags || []).includes('Puzzle'));
  const randomGames = pickRandom(games, 20);

  hideSectionIfEmpty('.continuePlaying', continuePlayingGames);
  hideSectionIfEmpty('.bookmarketedGames', bookmarkedGames);

  if (continuePlayingGames.length) {
    renderSection('.continuePlaying', continuePlayingGames);
  }
  if (bookmarkedGames.length) {
    renderSection('.bookmarketedGames', bookmarkedGames);
  }

  renderVertical('.newGames', newGames);
  renderSection('.actionTagedGames', actionGames);
  renderSection('.puzzleTagedGames', puzzleGames);
  renderSection('.randomTagedGames', randomGames);

  // --- Popular slider logic ---
  function getPopularList(rangeKey) {
    if (!analyticsData || !analyticsData[rangeKey]) {

      return games.slice(0, 6);
    }
    const list = analyticsData[rangeKey]
      .slice()  // shallow copy before sort
      .sort((a, b) => b.views - a.views);
    const mapped = list.map((item) => {
      const gameId = extractGameId(item.path);
      const game = games.find((g) => g.gameId === gameId);
      return game ? { ...game, views: item.views } : null;
    }).filter(Boolean);
    return mapped.slice(0, 6);
  }

  function renderPopular(rangeKey) {
    const popularList = getPopularList(rangeKey);
    renderVertical('.popularGames', popularList);
  }

  // Initial state: today
  renderPopular('week');

  const toggleContainer = document.querySelector('.popular-toggle');
  if (toggleContainer) {
    toggleContainer.addEventListener('click', (evt) => {
      const btn = evt.target.closest('.popular-btn');
      if (!btn) return;
      const range = btn.getAttribute('data-range');
      if (!range) return;
      toggleContainer.querySelectorAll('.popular-btn').forEach((b) => {
        b.classList.toggle('popular-btn--active', b === btn);
      });
      renderPopular(range);
    });
  }
}

onMounted(() => {
  initHomeSections().catch((err) => {
    console.error('Failed to init home sections', err);
  });

  setTimeout(() => {
    document.querySelector('.mainView')?.style.removeProperty('will-change');
    document.querySelector('.site-footer')?.style.removeProperty('will-change');
    document.querySelector('.hero')?.style.removeProperty('will-change');
  }, 5000);
});
</script>
