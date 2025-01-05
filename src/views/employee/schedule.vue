<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[500px] flex flex-col h-[97vh] relative"
    >
      <div class="py-2 px-6 border-b flex items-center justify-end">
        <icon-btn icon="x-mark" @click="closeDialog" />
      </div>
      <div class="flex-1 overflow-y-auto">
        <div class="mb-3 p-5 bg-slate-50">
          <div class="flex items-center gap-3">
            <h-avatar :size="40" :src="pocket.photo"></h-avatar>
            <div class="flex flex-col">
              <h4 class="font-medium">{{ pocket.name }}</h4>
              <p class="text-xs">NIK: {{ pocket.nik }}</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col px-5 mb-3">
          <h5 class="text-sm text-gray-500">Nama Jadwal</h5>
          <h4 class="font-bold">Jadwal Bulan November 2024</h4>
        </div>
        <div class="px-5 text-sm">
          <h5 class="text-gray-500">Shift</h5>
          <div class="flex flex-col gap-1">
            <div class="bg-slate-50 rounded-md p-3">
              <p><strong>dayoff</strong> (00:00 - 00:00 WIB)</p>
            </div>
            <div class="bg-slate-50 rounded-md p-3">
              <p><strong>dayoff</strong> (00:00 - 00:00 WIB)</p>
            </div>
          </div>
        </div>
      </div>

      <div class="py-3 px-6 border-t flex items-center justify-end">
        <h-btn class="px-3 py-2" @click="closeDialog">Tutup</h-btn>
      </div>
      <h-overlay
        :value="loading"
        absolute
        class="flex items-center justify-center gap-3"
      >
        <spinner />
      </h-overlay>
    </div>
  </h-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";

interface QueryIf {
  user_id: number | null;
}

const emit = defineEmits(["close", "refetch"]);
const loading = ref<boolean>(false);

const props = defineProps({
  dialog: Boolean,
  pocket: null
});

const query = reactive<QueryIf>({
  user_id: null
});

watch(
  () => props.pocket,
  (pocket) => {
    if (pocket) {
      query.user_id = pocket.id;
    }
  }
);

const closeDialog = () => {
  emit("close");
};
</script>
