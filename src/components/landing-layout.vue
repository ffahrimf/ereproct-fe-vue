<template>
  <div class="antialiased">
    <Header />
    <slot></slot>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Header from "../components/header/header.vue";
import Footer from "../components/footer.vue";
</script>
