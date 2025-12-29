<template>
  <section class="error-404">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page Not Found</h2>
      <p class="error-message">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div class="error-actions">
        <a href="/" class="btn-primary">Go Home</a>
        <a href="/content/search" class="btn-secondary">Search Games</a>
      </div>

      <div class="error-suggestions">
        <p>Or try one of these:</p>
        <ul>
          <li><a href="/content/allGames">Browse All Games</a></li>
          <li><a href="/tag">Browse by Tags</a></li>
          <li><a href="/aboutUs">About Us</a></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
// optional: log 404 for analytics
if (typeof window !== 'undefined') {
  console.warn('404 - Page not found:', window.location.pathname);
}
</script>

<style scoped>
.error-404 {
  max-width: 700px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  text-align: center;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.error-code {
  font-size: 6rem;
  font-weight: 900;
  line-height: 1;
  margin: 0;
  color: var(--accent);
}

.error-title {
  font-size: 1.8rem;
  margin: 0;
}

.error-message {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 400px;
}

.error-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.65rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s ease-out;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg);
}

.btn-primary:hover {
  background: var(--accent-soft);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--bg-discription);
  color: var(--color-text-main);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.error-suggestions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  width: 100%;
  max-width: 300px;
}

.error-suggestions p {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.6rem;
}

.error-suggestions ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.error-suggestions a {
  font-size: 0.9rem;
  color: var(--accent-soft);
  text-decoration: none;
}

.error-suggestions a:hover {
  text-decoration: underline;
  color: var(--accent);
}

@media (max-width: 600px) {
  .error-code {
    font-size: 4.5rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
