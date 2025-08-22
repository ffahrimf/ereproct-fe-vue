<template>
  <div class="px-10 py-8 mt-[100px]">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg flex items-center justify-between">
        <div>
          <p class="text-sm font-medium mb-4">Proctoring Berlangsung</p>
          <p class="text-2xl text-gray-900">{{ onDutyCount }}</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg flex items-center justify-between">
        <div>
          <p class="text-sm font-medium mb-4">Proctoring Selesai</p>
          <p class="text-2xl text-gray-900">{{ completedCount }}</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg flex items-center justify-between">
        <div>
          <p class="text-sm font-medium mb-4">Total Proctor Terdaftar</p>
          <p class="text-2xl text-gray-900">
            {{ totalProctorCount }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import useApi from "../../composables/use-api";

const api = new useApi();
const onDutyCount = ref<number>(0);
const completedCount = ref<number>(0);
const totalProctorCount = ref<number>(0);

const fetchProctoringStats = async () => {
  try {
    const onDutyRes = await api.get("report?status=ON DUTY");
    if (onDutyRes.data && onDutyRes.data.items) {
      onDutyCount.value = onDutyRes.data.items.length;
    }

    const completedRes = await api.get("report?status=COMPLETED");
    if (completedRes.data && completedRes.data.items) {
      completedCount.value = completedRes.data.items.length;
    }

    const totalProctor = await api.get("proctor?status=ACTIVE");
    if (totalProctor.data && totalProctor.data.items) {
      totalProctorCount.value = totalProctor.data.items.length;
    }
  } catch (error) {
    console.error("Gagal mengambil data statistik proctoring:", error);
  }
};

onMounted(() => {
  fetchProctoringStats();
});
</script>
