<template>
  <ProctoringScheduleAssessment v-if="store.role === 'ASSESSMENT'" />
  <ProctoringScheduleProctor v-else-if="store.role === 'PROCTOR'" />
</template>

<script setup lang="ts">
import { mainStore } from "../../store";
import ProctoringScheduleAssessment from "./proctoring-schedule-assessment.vue";
import ProctoringScheduleProctor from "./proctoring-schedule-proctor.vue";

const store = mainStore();
</script>
