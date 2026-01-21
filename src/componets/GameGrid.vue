<template>
  <div class="player-wrapper">
    <div class="alsoPlay-wrapper">
      <p>Also Play</p>
      <div class="alsoplay-wrappering-wrap">
        <button class="alsoPlay-arrow left" type="button">‹</button>
        <div class="alsoPlay also-play-carousel"></div>
        <button class="alsoPlay-arrow right" type="button">›</button>
      </div>
    </div>

    <div class="gameTitle">{{ currentGame.title }}</div>
    <div id="container" class="gameContainer"></div>

    <div class="buttonBox">
      <button class="actionBtn" id="bookmarkBtn" @click="bookmark">
        <span class="material-symbols-outlined">
          {{ iconText }}
        </span>
      </button>
      <button class="actionBtn" @click="toggleFullscreen">
        <span class="material-symbols-outlined">fullscreen</span>
      </button>
    </div>

    <div class="tags-section">
      <div class="tags-list">
        <span
          v-for="tag in currentGame.tags"
          :key="tag"
          class="tag-chip"
          @click="goToTag(tag)"
          role="link"
          tabindex="0"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="descriptionbox">
      <div v-html="formattedDescription"></div>
      <div class="game-meta">
        <div v-if="currentGame.series" class="meta-item">
          <span class="label">Series:</span>     {{ currentGame.series }}
        </div>
        <div class="meta-item">
          <span class="label">Developer:</span> {{ currentGame.developer }}
        </div>
        <div class="meta-item">
          <span class="label">Publisher:</span> {{ currentGame.publisher }}
        </div>
        <div class="meta-item">
          <span class="label">Play Mode:</span> {{ currentGame.playMode }}
        </div>
        <div class="meta-item">
          <span class="label">Platform:</span> {{ currentGame.platform }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

// props
const props = defineProps({
  currentGame: { type: Object, required: true },
});

const goToTag = (tag) => {
  window.location.href = `/tag/${encodeURIComponent(tag)}`;
};

const currentId = props.currentGame.gameId;

/* ----------------- LOCAL STORAGE HELPERS ----------------- */

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

function saveIdArray(key, arr) {
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

function isBookmarked(id) {
  const ids = loadIdArray(BOOKMARK_KEY);
  return ids.includes(id);
}

function toggleBookmarkId(id) {
  const ids = loadIdArray(BOOKMARK_KEY);
  const idx = ids.indexOf(id);
  if (idx !== -1) {
    ids.splice(idx, 1);
  } else {
    ids.push(id);
  }
  saveIdArray(BOOKMARK_KEY, ids);
}

function addToContinue(id) {
  const ids = loadIdArray(CONTINUE_KEY);
  if (!ids.includes(id)) {
    ids.unshift(id);
    saveIdArray(CONTINUE_KEY, ids);
  }
}

/* ----------------- UI STATE ----------------- */

const state = ref(0); // 0 idle, 1 hover-add, 2 hover-remove

const iconText = computed(() => {
  const bookmarked = isBookmarked(currentId);
  if (!bookmarked && state.value === 1) return 'bookmark_add';
  if (bookmarked && state.value === 2) return 'bookmark_remove';
  return bookmarked ? 'bookmark_added' : 'bookmark';
});

const formattedDescription = computed(() => {
  const desc = props.currentGame?.originalDescription;
  if (!desc) return '';
  return desc
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length)
    .map((p) => `<p>${p}</p>`)
    .join('');
});

/* --------------- HTML5 GAME LOADER --------------- */

function loadHTML5GameFromFolder(gameUrl, container) {
  // Normalize: ensure it’s an absolute URL under /html5
  let src = gameUrl || '';
  
  // If launchCommand is just a folder name like "cookieclicker"
  if (!src.startsWith('/')) {
    // Prefix with /html5/
    src = `/html5/${src}`;
  }

  // If it doesn’t end with .html or slash, assume folder and add trailing slash
  const lower = src.toLowerCase();
  if (!lower.endsWith('.html') && !lower.endsWith('/')) {
    src = src + '/';
  }

  // Optional: if you *always* use index.html, you can force it:
  if (lower.endsWith('/')) src = src + 'index.html';

  container.innerHTML = '';

  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.allowFullscreen = true;

  container.appendChild(iframe);
}

/* ----------------- RUFFLE LOADER ----------------- */

async function loadRuffle() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/js/ruffle/ruffle.js';
    script.async = true;
    script.onload = () => {
      window.RufflePlayer = window.RufflePlayer || {};
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function initFlashPlayer() {
  if (props.currentGame.platform !== 'Flash') return;

  if (!window.RufflePlayer || typeof window.RufflePlayer.newest !== 'function') {
    await loadRuffle();
  }

  window.RufflePlayer.config = {
    publicPath: '/js/ruffle/',
    polyfills: true,
    autoplay: 'on',
    unmuteOverlay: 'hidden',
    backgroundColor: null,
    wmode: 'window',
    letterbox: 'fullscreen',
    warnOnUnsupportedContent: false,
    contextMenu: true,
    showSwfDownload: false,
    maxExecutionDuration: { secs: 15, nanos: 0 },
    logLevel: 'error',
    menu: true,
    salign: '',
    scale: 'showAll',
    forceScale: false,
    quality: 'high',
    splashScreen: true,
  };

  const ruffle = window.RufflePlayer.newest();
  const player = ruffle.createPlayer();
  const container = document.getElementById('container');
  if (!container) return;

  const zipUrl = props.currentGame.launchCommand;

  try {
    const resp = await fetch(zipUrl);
    if (!resp.ok) throw new Error('Failed to load game ZIP');

    const zipArrayBuffer = await resp.arrayBuffer();
    const zip = await JSZip.loadAsync(zipArrayBuffer);

    const swfEntry = Object.values(zip.files).find((f) =>
      f.name.toLowerCase().endsWith('.swf'),
    );
    if (!swfEntry) {
      console.error('No SWF file found in ZIP');
      return;
    }

    const swfBuffer = await swfEntry.async('arraybuffer');
    const blob = new Blob([swfBuffer], {
      type: 'application/x-shockwave-flash',
    });
    const swfUrl = URL.createObjectURL(blob);

    container.appendChild(player);
    player.style.width = '100%';
    player.style.height = '100%';
    player.load(swfUrl);
  } catch (e) {
    console.error('Failed to load ZIP or SWF from ZIP', e);
  }
}

/* ----------------- BOOKMARK & FULLSCREEN ----------------- */

function bookmark(event) {
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  if (!bookmarkBtn) return;

  const currentlyBookmarked = isBookmarked(currentId);
  toggleBookmarkId(currentId);

  if (currentlyBookmarked) {
    bookmarkBtn.classList.remove('bookmarketed');
  } else {
    bookmarkBtn.classList.add('bookmarketed');
  }

  state.value = 0;
  event?.preventDefault();
}

function toggleFullscreen() {
  const container = document.getElementById('container');
  const iframe = container?.querySelector('iframe');
  const canvas = container?.querySelector('canvas');

  const target = iframe || canvas || container;
  if (!target) return;

  if (!document.fullscreenElement) {
    target.requestFullscreen().catch((err) => {
      console.error('Failed to enable fullscreen:', err);
    });
  } else {
    document.exitFullscreen();
  }
}

/* ----------------- CONTINUE PLAYING TIMER ----------------- */

let continueTimer = null;

function startContinueTimer() {
  continueTimer = setTimeout(() => {
    addToContinue(currentId);
  }, 5000);
}

/* ----------------- ALSO PLAY CAROUSEL ----------------- */

function getRelatedGames(allGames, currentId, maxResults = 10) {
  const current = allGames.find((g) => g.gameId === currentId);
  if (!current) return [];

  const series = (current.series || '').trim();
  const tagSet = new Set((current.tags || []).map((t) => t.toLowerCase()));

  let related = allGames.filter(
    (g) =>
      g.gameId !== current.gameId &&
      series &&
      g.series &&
      g.series.trim().toLowerCase() === series.toLowerCase(),
  );

  if (related.length < maxResults) {
    const alreadyIds = new Set(related.map((g) => g.gameId));
    const tagMatches = allGames.filter((g) => {
      if (g.gameId === current.gameId || alreadyIds.has(g.gameId)) return false;
      const gTags = (g.tags || []).map((t) => t.toLowerCase());
      return gTags.some((t) => tagSet.has(t));
    });

    tagMatches.sort((a, b) => {
      const sharedA = (a.tags || []).filter((t) => tagSet.has(t.toLowerCase()))
        .length;
      const sharedB = (b.tags || []).filter((t) => tagSet.has(t.toLowerCase()))
        .length;
      return sharedB - sharedA;
    });

    related = related.concat(tagMatches);
  }

  return related.slice(0, maxResults);
}

function renderAlsoPlay(containerSelector, gamesList) {
  const container = document.querySelector(containerSelector);
  if (!container || !gamesList.length) return;

  container.classList.add('also-play-carousel');
  
  container.innerHTML = gamesList
    .map(
      (g) => `
      <a class="also-play-item" href="/content/${encodeURIComponent(g.gameId)}">
        <div class="also-play-thumb">
          <img src="${g.logoUrlResolved || '/fallback-logo.png'}" alt="${g.title}">
        </div>
        <div class="also-play-title">${g.title}</div>
      </a>
    `
    )
    .join('');

  const scroller = document.querySelector('.alsoPlay');
  const leftBtn = document.querySelector('.alsoPlay-arrow.left');
  const rightBtn = document.querySelector('.alsoPlay-arrow.right');
  if (!scroller || !leftBtn || !rightBtn) return;

  const scrollAmount = 240;

  leftBtn.addEventListener('click', () => {
    scroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

const getLogo = (logoFile) => {
  return "/imgs/gameLogo/" + logoFile
};

async function initAlsoPlay() {
  try {
    const res = await fetch('/top500games.json');
    if (!res.ok) {
      console.error('Failed to load top500games.json');
      return;
    }
    const data = await res.json();
    const games = data.games ?? data;

    const relatedGames = getRelatedGames(games, currentId, 12);

    const gamesWithLogos = await Promise.all(
      relatedGames.map(async (g) => {
        const resolved = await getLogo(g.logoUrl);
        return {
          ...g,
          logoUrlResolved: resolved,
        };
      })
    );

    renderAlsoPlay('.alsoPlay', gamesWithLogos);
  } catch (e) {
    console.error('initAlsoPlay failed', e);
  }
}

/* ----------------- LIFECYCLE ----------------- */

onMounted(async () => {
  const container = document.getElementById('container');
  if (!container) return;

  if (props.currentGame.platform === 'Flash') {
    await initFlashPlayer();
  } else if (props.currentGame.platform === 'HTML5') {
    const gameUrl = props.currentGame.launchCommand;
    loadHTML5GameFromFolder(gameUrl, container);
  }

  const bookmarkBtn = document.getElementById('bookmarkBtn');
  if (bookmarkBtn) {
    if (isBookmarked(currentId)) {
      bookmarkBtn.classList.add('bookmarketed');
    }

    bookmarkBtn.addEventListener('mouseover', () => {
      const bookmarked = isBookmarked(currentId);
      state.value = bookmarked ? 2 : 1;
    });

    bookmarkBtn.addEventListener('mouseout', () => {
      state.value = 0;
    });
  }

  await initAlsoPlay();
  startContinueTimer();
});

onBeforeUnmount(() => {
  if (continueTimer) {
    clearTimeout(continueTimer);
    continueTimer = null;
  }
});
</script>