<script setup>
import { string } from 'astro/zod';

const { logoSrc } = defineProps({
  logoSrc: {
    type: String,
  }
});
</script>


<template>
  <nav class="top-nav">
    <div class="logoBox">
      <a href="/">
        <div class="contentLogoBox">
          <img
            class="logoImage"
            v-if="logoSrc"
            :src="logoSrc"
            alt="Burrito Edition logo"
            width="60"
            height="90"
            decoding="async"
          >
          <div class="textlogobox">
            <a href="/" class="logo logoPlateTop">Burrito</a>
            <a href="/" class="logo logoPlateWord">Edition</a>
          </div>
        </div>
        <div class="plate"></div>
      </a>
    </div>
    <div class="nav-links">
      <a href="/" class="nav-link">Home</a>
      <a href="/content/allGames" class="nav-link">All Games</a>
      <a href="/tag" class="nav-link">Tags</a>
      <a href="/content/search" class="nav-link">Search</a>
    </div>
  </nav>
</template>