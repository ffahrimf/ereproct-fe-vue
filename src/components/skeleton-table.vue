<template>
  <tr v-for="i in 3" :key="`th-${i}`">
    <td
      v-for="j in col"
      :key="`tr-${j}`"
      class="py-1 px-3"
      :class="i == 1 ? 'pt-3' : i == 3 ? 'pb-3' : ''"
    >
      <div class="p-3 bg-slate-200 animate-pulse rounded-lg"></div>
    </td>
  </tr>
</template>
<script lang="ts" setup>
defineProps({
  col: Number,
});
</script>
