<script setup>
import { computed, ref, onMounted } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  hub: {
    type: Object,
    required: true
  },
  games: {
    type: Array,
    required: true
  }
});

const adSlotId = 'div-gpt-ad-1769091989764-0';
const hasRequestedAd = ref(false);

onMounted(() => {
  if (!window.googletag || hasRequestedAd.value) return;
  hasRequestedAd.value = true;

  window.googletag.cmd.push(function () {
    window.googletag.display(adSlotId);
  });
});

const introHtml = computed(() => {
  if (props.hub.rawMarkdown) {
    return marked(props.hub.rawMarkdown, { 
      breaks: true,
      gfm: true
    });
  }
  return props.hub.introHtml || '';
});

const visibleCount = ref(60);

const filteredGames = computed(() => {
  let list = props.games || [];

  if (props.hub.gameIds && props.hub.gameIds.length > 0) {
    const idSet = new Set(props.hub.gameIds);
    list = list.filter((g) => idSet.has(g.id));
  } else if (props.hub.tagFilters && props.hub.tagFilters.length > 0) {
    const tagSet = new Set(
      props.hub.tagFilters.map((t) => String(t).toLowerCase())
    );
    list = list.filter(
      (g) =>
        g.tags &&
        g.tags.some((t) => tagSet.has(String(t).toLowerCase()))
    );
  }

  return list;
});

const visibleGames = computed(() =>
  filteredGames.value.slice(0, visibleCount.value)
);

const canLoadMore = computed(
  () => visibleCount.value < filteredGames.value.length
);

function loadMore() {
  visibleCount.value += 60;
}

const goToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.location.hash = sectionId;
};

const truncateToWords = (text) => {
  const words = text.split(' ');
  if (words.length <= 50) return text;
  return words.slice(0, 50).join(' ') + '...';
};

</script>

<template>
  <main class="mainView">
    <!-- Main hero / intro -->
    <header class="hero">
      <p v-if="hub.heroTag" class="gameGroupTag">
        {{ hub.heroTag }}
      </p>

      <!-- One H1 per hub page -->
      <h1 class="gameTitle">
        {{ hub.title }}
      </h1>

      <p class="hero-subtitle">
        {{ hub.heroSubtitle || hub.description }}
      </p>

      <p v-if="hub.mainKeyword" class="viewHeader">
        <span style="margin-left:1rem;">
          Focus keyword:
          <strong>{{ hub.mainKeyword }}</strong>
        </span>
        <span class="viewAllGamesTag" @click="goToSection('game-section')" role="link">
          {{ filteredGames.length }} games in this collection
        </span>
      </p>
    </header>

    <!-- Simple GAM banner -->
    <section class="hub-banner-ad">
      <div class="hub-banner-ad-inner">
        <div
          :id="adSlotId"
          style="min-width:300px; min-height:50px;"
        ></div>
      </div>
    </section>

    <!-- Markdown body / guide content -->
    <section v-if="introHtml" class="all-games">
      <div class="descriptionbox" style="margin-bottom: 2rem;">
        <div style="padding: 1.25rem 1.5rem 1.5rem;">
          <article class="md-content">
            <!-- Now renders rawMarkdown too! -->
            <div v-html="introHtml"></div>
          </article>
        </div>
      </div>
    </section>

    <!-- Simple GAM banner -->
    <section class="hub-banner-ad">
      <div class="hub-banner-ad-inner">
        <div
          :id="adSlotId"
          style="min-width:300px; min-height:50px;"
        ></div>
      </div>
    </section>

    <!-- Main game list -->
    <section class="all-games">
      <header>
        <h2 class="all-games-title" id="game-section">
          Browse {{ hub.heroTag || 'unblocked' }} Games Collection
        </h2>
        <p class="all-games-count">
          Showing {{ visibleGames.length }} of
          {{ filteredGames.length }} browser games.
        </p>
      </header>

      <div class="section-grid" itemscope itemtype="https://schema.org/ItemList">
        <meta itemprop="name" :content="hub.title" />
        <meta itemprop="numberOfItems" :content="filteredGames.length.toString()" />
      
        <article
          v-for="(game, index) in visibleGames"
          :key="game.id"
          class="game-card hub-card"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <meta itemprop="position" :content="(index + 1).toString()" />
      
          <a :href="game.url" class="thumb hub-thumb" itemprop="url">
            <img
              :src="game.thumb ? `/imgs/gameLogo/${game.thumb.split('/').pop()}` : '/fallback-thumb.png'"
              :alt="game.title"
              loading="lazy"
              itemprop="image"
            />
          </a>
        
          <div class="card-content hub-card-content" itemprop="item" itemscope itemtype="https://schema.org/VideoGame">
            <a :href="game.url">
              <h3 class="titleCard hub-title" itemprop="name">
                {{ game.title }}
              </h3>
            </a>
          
            <p class="card-discription hub-desc" itemprop="description">
              {{ truncateToWords(
                game.shortDescription ||
                'Play this free browser game online with no downloads needed.'
              ) }}
            </p>
          
            <nav
              v-if="game.tags && game.tags.length"
              class="tags-list hub-tags"
              aria-label="Game tags"
            >
              <span
                v-for="tag in game.tags.slice(0, 4)"
                :key="tag"
                class="tag-chip"
              >
                {{ tag }}
              </span>
            </nav>
          </div>
        </article>
      </div>

      <div
        v-if="canLoadMore"
        style="display:flex; justify-content:center; margin-top:1.5rem;"
      >
        <button class="actionBtn" type="button" @click="loadMore">
          Load more games
        </button>
      </div>
    </section>

  </main>
</template>

<style scoped>
  .section-grid .hub-card {
    flex: 0 1 calc(45% - 0.75rem);
  }

  .section-grid .hub-thumb {
    width: 50%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: 6px;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .section-grid .hub-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .hub-card-content {
    width: 50%;
  }

  .hub-banner-ad {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .hub-banner-ad-inner {
    width: 100%;
    max-width: 1000px;
    display: flex;
    justify-content: center;
  }

</style>