<template>
  <section class="about">
    <h1 class="about-title">About Burrito Edition</h1>
    <p class="about-tagline">
      Classic browser games, served fresh.
    </p>

    <div class="about-grid">
      <div class="about-card">
        <h2>What this is</h2>
        <p>
          Burrito Edition is a home for classic Flash and web games that would
          otherwise disappear as old technologies fade out.
        </p>
        <p>
          The goal is to keep them playable in a modern browser with clean,
          fast loading and no sketchy downloads.
        </p>
      </div>

      <div class="about-card">
        <h2>How it works</h2>
        <p>
          Games are loaded from a curated JSON catalog and played through an
          emulator layer (like Ruffle) or other web‑friendly runtimes.
        </p>
        <p>
          Bookmarks, continue‑playing, and tags all live in the browser so your
          library feels personal without needing an account.
        </p>
      </div>

      <div class="about-card">
        <h2>What you can do</h2>
        <ul class="about-list">
          <li>Browse games by tags, popularity, or curated rows.</li>
          <li>Bookmark favorites and pick up where you left off.</li>
          <li>Discover random picks when you just want “something fun”.</li>
        </ul>
      </div>

      <div class="about-card">
        <h2>Support & feedback</h2>
        <p>
          Found a broken game, missing thumbnail, or something that should be
          preserved next?
        </p>
        <p>
          Reach out via the site footer links or the Burrito Edition Discord
          and share titles, files, or suggestions.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// no logic needed right now; static page
</script>

<style scoped>
.about {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.about-title {
  font-size: 1.8rem;
  margin-bottom: 0.4rem;
}

.about-tagline {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

.about-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem 1.5rem;
}

.about-card {
  flex: 1 1 min(100%, 420px);
  border-radius: 10px;
  padding: 1rem 1.1rem 1.1rem;
  background: var(--bg-discription);
  border: 1px solid var(--border);
  box-shadow: 0 12px 28px var(--box-shadow);
}

.about-card h2 {
  font-size: 1.1rem;
  margin-bottom: 0.6rem;
  color: var(--accent-soft);
}

.about-card p {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  color: var(--color-text-main);
}

.about-list {
  list-style: disc;
  padding-left: 1.1rem;
  font-size: 0.9rem;
  color: var(--color-text-main);
}

.about-list li + li {
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .about {
    padding-inline: 1rem;
  }

  .about-card {
    flex: 1 1 100%;
  }
}
</style>
