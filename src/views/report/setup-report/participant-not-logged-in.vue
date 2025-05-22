<template>
  <div class="bg-white rounded-md pt-3 pb-5 px-4">
    <p class="text-xl font-medium">{{ data.length }}</p>

    <div class="flex items-center justify-between">
      <p class="text-xs font-medium text-gray-500 font-dm-sans">
        Peserta Tidak Login
      </p>
      <button class="p-0.5 border border-gray-200 rounded-md">
        <h-icon name="plus" size="15" color="text-gray-700" />
      </button>
    </div>

    <div
      v-for="(item, i) in data"
      :key="`item-${i}`"
      class="mt-3 border border-gray-200 rounded-lg flex justify-between p-3"
    >
      <p class="text-xs">{{ item.participant.name }}</p>
      <button class="mr-1" @click="deleteParticipantNotLoggedIn(item.id)">
        <h-icon name="trash" size="15" color="text-red-500" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useQuery, useToast } from "../../../composables/use-helper";
import useApi from "../../../composables/use-api";
import { ReportIF } from "../report.interface";
import { ParticipantIF } from "../../../interface/area.interface";
import { form } from "./setup";

interface ParticipantNotLoggedInIF {
  id?: number | null;
  report: ReportIF;
  participant: ParticipantIF;
}

interface QueryIf {
  page: number;
  limit: number;
  report_id: number | null;
  participant_id: number | null;
}

const loading = ref<Boolean>(false);
const api = new useApi();
const data = ref<ParticipantNotLoggedInIF[] | []>([]);

const query = reactive<QueryIf>({
  page: 1,
  limit: 10,
  report_id: null,
  participant_id: null
});

const getParticipantNotLoggedIn = (): void => {
  loading.value = true;
  const report_id = form.id ?? null;
  query.report_id = report_id;
  const q = useQuery(query);
  api.get(`participant-not-logged-in${q}`).then((res) => {
    const raw: ParticipantNotLoggedInIF[] | [] = res.data.items;
    data.value = raw;
    loading.value = false;
  });
};

const deleteParticipantNotLoggedIn = (id: any): void => {
  loading.value = true;
  let req = {
    path: `participant-not-logged-in/delete/${id}`,
    body: {}
  };
  api
    .post(req)
    .then(() => {
      useToast("Berhasil menghapus peserta", "success");
      getParticipantNotLoggedIn();
      loading.value = false;
    })
    .catch((err) => {
      useToast(err.message, "error");
      loading.value = false;
      getParticipantNotLoggedIn();
    });
};

onMounted(() => {
  getParticipantNotLoggedIn();
});
</script>
