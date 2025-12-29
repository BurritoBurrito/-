<template>
  <section class="contact">
    <h1 class="contact-title">Contact Burrito Edition</h1>
    <p class="contact-tagline">
      Questions, bug reports, or game suggestions? Fill out the form below.
    </p>

    <div class="contact-layout">
      <div class="contact-form-embed">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeChxKsi9hAIu3j8J1EGQjRby2MXHbJpc-N9CH731e4AbCcug/viewform?embedded=true"
          width="100%"
          height="962"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        >
          Loading…
        </iframe>
      </div>

      <aside class="contact-info">
        <h2>Note</h2>
        <p class="contact-note">
          Please include game titles, links, or screenshots when reporting
          problems so they're easier to fix.
        </p>
      </aside>
    </div>
  </section>
</template>

<script setup>
// no form logic needed—Google handles it
</script>

<style scoped>
.contact {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.contact-title {
  font-size: 1.8rem;
  margin-bottom: 0.4rem;
}

.contact-tagline {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

.contact-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 1.75rem;
}

.contact-form-embed {
  flex: 1 1 500px;
  padding: 1rem;
  border-radius: 10px;
  background: var(--bg-discription);
  border: 1px solid var(--border);
  box-shadow: 0 12px 28px var(--box-shadow);
  overflow: hidden;
}

.contact-form-embed iframe {
  display: block;
  border: 0;
}

.contact-info {
  flex: 1 1 280px;
  padding: 1rem 1.1rem 1.2rem;
  border-radius: 10px;
  background: var(--bg-discription);
  border: 1px solid var(--border);
  box-shadow: 0 12px 28px var(--box-shadow);
  font-size: 0.9rem;
}

.contact-info h2 {
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
  color: var(--accent-soft);
}

.contact-info ul {
  margin: 0.5rem 0 0.8rem;
  padding-left: 1.1rem;
  list-style: disc;
}

.contact-info li + li {
  margin-top: 0.2rem;
}

.contact-highlight {
  color: var(--accent-soft);
}

.contact-note {
  margin-top: 0.8rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .contact {
    padding-inline: 1rem;
  }

  .contact-form-embed {
    flex: 1 1 100%;
  }
}
</style>
