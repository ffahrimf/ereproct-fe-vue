<template>
  <button
    @click="$router.push('/report')"
    class="absolute top-10 ml-10 flex items-center gap-2 text-xs active:scale-95"
  >
    <h-icon name="arrow-long-left" size="15" />
    <p>Back</p>
  </button>
  <div
    class="flex p-3 px-10 mt-[100px]"
    v-for="(item, i) in report"
    :key="`item-${i}`"
  >
    <div class="flex gap-3 w-full items-start">
      <div class="w-7/12 flex flex-col gap-3">
        <div class="flex flex-col bg-white pt-3 pb-5 px-4 rounded-md">
          <div>
            <p class="text-xs font-medium text-primary">Setup Report</p>
            <p class="text-lg font-semibold font-inter">
              {{ item.event.code }}
            </p>
          </div>

          <div class="grid grid-cols-12 gap-5 font-inter">
            <div
              class="p-3 col-span-8 flex flex-row gap-5 rounded-xl mt-5 border border-gray-200"
            >
              <div class="flex flex-col font-medium">
                <p class="text-sm">Tanggal</p>
                <p class="text-xs text-gray-500 font-dm-sans">
                  {{ dayjs(item.event.date).format("MMMM D, YYYY") }}
                </p>
              </div>
              <div class="flex items-center">
                <hr class="rotate-90 border border-gray-200 w-9" />
              </div>
              <div class="flex flex-col font-medium">
                <p class="text-sm">Jam Tes</p>
                <p class="text-xs text-gray-500 font-dm-sans">
                  <span>{{ item.event.start_time }}</span> -
                  <span>{{ item.event.finish_time }}</span>
                </p>
              </div>
            </div>

            <div
              class="p-3 col-span-4 flex flex-row gap-5 rounded-xl mt-5 border border-gray-200"
            >
              <div class="flex flex-col font-medium">
                <p>{{ item.event.eventDetails.length }}</p>
                <p class="text-xs text-gray-500 font-dm-sans">Jumlah Peserta</p>
              </div>
            </div>
          </div>

          <div class="mt-5">
            <div class="flex flex-col gap-5">
              <div class="flex flex-row gap-5">
                <h-counter-input
                  v-model="form.number_of_participants_logged_in"
                  :min="0"
                  :max="999"
                  class="grow"
                  :step="1"
                  label="Peserta Login"
                />
                <h-counter-input
                  v-model="form.number_of_participants_only_logged_in"
                  :min="0"
                  class="grow"
                  :max="999"
                  :step="1"
                  label="Peserta Hanya Login"
                />
              </div>
              <div class="flex flex-row gap-5">
                <h-counter-input
                  v-model="form.number_of_participants_completed"
                  :min="0"
                  class="grow"
                  :max="999"
                  :step="1"
                  label="Peserta Selesai"
                />
                <h-counter-input
                  v-model="form.number_of_participants_not_completed"
                  :min="0"
                  :max="999"
                  class="grow"
                  :step="1"
                  label="Peserta Tidak Selesai"
                />
              </div>
            </div>
          </div>
        </div>

        <Violations />
      </div>

      <div class="flex flex-col gap-3 w-5/12">
        <ParticipantNotLoggedIn />
        <Issues />
      </div>
    </div>
  </div>
  <div class="flex items-center gap-2 justify-end px-10">
    <button
      @click="fetchData"
      class="p-2 text-xs gap-1 font-medium rounded-lg active:scale-95 bg-slate-200"
    >
      <h-icon name="arrow-path" size="16" />
    </button>
    <button
      @click="submitReport()"
      class="px-3 py-2 text-xs font-medium rounded-lg bg-primary text-white active:scale-95"
    >
      Submit Report
    </button>
  </div>
  <SubmitReport
    :pocket="pocket"
    :dialog="dialog.submit_report"
    @close="dialog.submit_report = false"
    @refetch="fetchData"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { form, report, resetForm } from "../setup-report/setup";
import useApi from "../../../composables/use-api";
import { useRoute } from "vue-router";
import { ReportIF } from "../report.interface";
import dayjs from "dayjs";
import ParticipantNotLoggedIn from "./participant-not-logged-in.vue";
import Issues from "./issues/issues.vue";
import Violations from "./violation/violations.vue";
import SubmitReport from "./submit-report.vue";

interface DialogIf {
  submit_report: boolean;
}

const route = useRoute();
const code = ref((route.query.code as string) ?? "");
const api = new useApi();
const emit = defineEmits(["close", "refetch"]);
const loading = ref<boolean>(false);
const pocket = ref<any>(null);

const dialog = reactive<DialogIf>({
  submit_report: false
});

const fetchData = async (): Promise<void> => {
  loading.value = true;
  try {
    const res = await api.get(`report?code=${code.value}`);
    const raw: ReportIF[] = res.data?.items ?? [];

    if (raw.length > 0) {
      const item = raw[0];
      report.value = raw;

      form.id = item.id ?? null;
      form.event_id = item.event?.id ?? null;
      form.proctor_id = item.proctor?.id ?? null;
      form.number_of_participants_logged_in =
        item.number_of_participants_logged_in ?? 0;
      form.number_of_participants_only_logged_in =
        item.number_of_participants_only_logged_in ?? 0;
      form.number_of_participants_completed =
        item.number_of_participants_completed ?? 0;
      form.number_of_participants_not_completed =
        item.number_of_participants_not_completed ?? 0;
      form.status = item.status ?? null;
      form.note = item.note ?? null;
    } else {
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const submitReport = () => {
  pocket.value = {
    path: `report/update`,
    value: {
      id: form.id,
      number_of_participants_logged_in: form.number_of_participants_logged_in,
      number_of_participants_only_logged_in:
        form.number_of_participants_only_logged_in,
      number_of_participants_completed: form.number_of_participants_completed,
      number_of_participants_not_completed:
        form.number_of_participants_not_completed,
      status: "REVIEW",
      note: "",
      event: { code: report.value[0].event.code }
    }
  };
  dialog.submit_report = true;
};

onMounted(() => {
  if (code.value) {
    fetchData();
  } else {
    resetForm();
  }
});
</script>
