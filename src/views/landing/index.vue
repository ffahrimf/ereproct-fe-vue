<template>
  <LandingLayout>
    <Hero class="" />
    <div class="flex flex-col space-y-10">
      <About />
      <Advantage />
      <Category />
      <Banner />
      <Step />
      <FAQ />
    </div>
  </LandingLayout>
</template>

<script setup lang="ts">
import LandingLayout from "../../components/landing-layout.vue";
import Hero from "./welcome/hero.vue";
import About from "./welcome/about.vue";
import Advantage from "./welcome/advantage.vue";
import Category from "./welcome/category.vue";
import Banner from "./welcome/banner.vue";
import Step from "./welcome/step.vue";
import FAQ from "./welcome/faq.vue";
</script>
