<template>
  <ReportListProctor v-if="store.role === 'PROCTOR'" />
  <ReportListResearch v-else-if="store.role === 'RESEARCH'" />
</template>

<script setup lang="ts">
import { mainStore } from "../../store";
import ReportListProctor from "./report-proctor.vue";
import ReportListResearch from "./report-research.vue";

const store = mainStore();
</script>
