<template>
  <div class="rounded-md bg-white pt-3 pb-5 px-4 min-h-[90px] w-full">
    <div class="flex items-center justify-between">
      <p class="text-xs font-medium text-gray-500 font-dm-sans">
        Indikasi Pelanggaran
      </p>
      <button
        @click="dialog.create = true"
        class="p-0.5 border border-gray-200 rounded-md"
      >
        <h-icon name="plus" size="15" color="text-gray-700" />
      </button>
    </div>
    <hr class="mt-2" />

    <div
      v-for="reportViolation in data"
      :key="reportViolation.id"
      class="mt-3 text-[11px] border border-gray-200 rounded-lg flex flex-col gap-2 p-3 relative"
    >
      <div class="flex justify-between items-center">
        <p class="font-medium">{{ reportViolation.participant.name }}</p>
        <h-menu arrow closeOnClick>
          <template #default="">
            <h-icon name="ellipsis-horizontal" size="15"></h-icon>
          </template>
          <template #item>
            <div class="text-[11px]">
              <button
                @click="handleOpenUpdateDialog(reportViolation)"
                class="py-1 px-2 hover:bg-slate-50 text-gray-700 font-medium rounded flex items-center gap-2 w-full outline-none"
              >
                <p>Update</p>
              </button>
              <button
                @click="onDelete(reportViolation.id)"
                class="py-1 px-2 hover:bg-slate-50 text-red-500 font-medium rounded flex items-center gap-2 w-full outline-none"
              >
                <p>Delete</p>
              </button>
            </div>
          </template>
        </h-menu>
      </div>

      <div class="grid grid-cols-12 items-start gap-y-1 text-gray-700">
        <p class="col-span-3">Kejadian</p>
        <div class="col-span-9 flex flex-col gap-0.5 mb-1">
          <div class="flex items-start gap-0.5">
            <span class="mr-1">:</span>
            <div class="-mt-1 flex flex-col gap-1">
              <div
                terlihat
                menggunakan
                HP
                saat
                proses
                tes.
                v-for="detail in reportViolation.reportViolationDetails"
                :key="detail.id"
                class="flex items-start gap-1"
              >
                <span
                  class="text-[10px] px-2.5 py-1.5 text-stone-500 bg-stone-50 font-medium inline-flex rounded-lg"
                >
                  {{ detail.period }}x
                </span>
                <button
                  @click="toggleExpand(detail)"
                  :class="getViolationClasses(detail.violation.level)"
                  class="text-[10px] px-2.5 py-1.5 font-medium inline-flex rounded-lg text-left"
                >
                  <p
                    class="cursor-pointer"
                    :class="{ 'line-clamp-1': !detail.isExpanded }"
                  >
                    {{ detail.violation.condition }}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>

        <p class="col-span-3">Tindaklanjut</p>
        <div class="col-span-9 flex items-start gap-0.5">
          <span class="mr-1">:</span>
          <p class="break-words whitespace-pre-line">
            {{ reportViolation.violation_action }}
          </p>
        </div>

        <p class="col-span-3">Respon Peserta</p>
        <div class="col-span-9 flex items-start gap-0.5">
          <span class="mr-1">:</span>
          <p class="break-words whitespace-pre-line">
            {{ reportViolation.participant_violation_response }}
          </p>
        </div>

        <p class="col-span-3">Keterangan</p>
        <div class="col-span-9 flex items-start gap-0.5">
          <span class="mr-1">:</span>
          <p class="break-words whitespace-pre-line">
            {{ reportViolation.remarks }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <CreateViolation
    :dialog="dialog.create"
    @close="dialog.create = false"
    @refetch="getViolations"
  />
  <UpdateViolation
    :dialog="dialog.update"
    :violationToEdit="violationToEdit"
    @close="dialog.update = false"
    @refetch="getViolations"
  />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import CreateViolation from "./create-violation.vue";
import UpdateViolation from "./update-violation.vue";
import { form } from "../setup";
import useApi from "../../../../composables/use-api";
import { useToast } from "../../../../composables/use-helper";

interface DialogIf {
  create: boolean;
  update: boolean;
}

const loading = ref<boolean>(false);
const api = new useApi();
const data = ref<any[]>([]);
const violationToEdit = ref<any | null>(null);

const dialog = reactive<DialogIf>({
  create: false,
  update: false
});

const getViolations = (): void => {
  loading.value = true;
  const q = form.id;
  api.get(`report-violation?report_id=${q}`).then((res) => {
    const processedData = res.data.items.map((report: any) => {
      if (
        report.reportViolationDetails &&
        Array.isArray(report.reportViolationDetails)
      ) {
        report.reportViolationDetails.forEach((detail: any) => {
          detail.isExpanded = false;
        });
      }
      return report;
    });
    data.value = processedData;
    loading.value = false;
  });
};

const getViolationClasses = (level: string): string => {
  if (level === "Berat") {
    return "text-red-500 bg-red-50";
  }
  if (level === "Sedang") {
    return "text-yellow-500 bg-yellow-50";
  }
  return "text-blue-500 bg-blue-50";
};

const handleOpenUpdateDialog = (violationData: any) => {
  violationToEdit.value = violationData;
  dialog.update = true;
};

const toggleExpand = (detail: any) => {
  detail.isExpanded = !detail.isExpanded;
};

const onDelete = (item: number) => {
  loading.value = true;
  api
    .post({
      path: `report-violation/delete/${item}`,
      body: {}
    })
    .then((res) => {
      useToast(res.title ?? "Pelanggaran Berhasil Terhapus!", "success");
      loading.value = false;
      getViolations();
    })
    .catch((err) => {
      useToast(err.message, "error");
      getViolations();
      loading.value = false;
    });
};

onMounted(() => {
  getViolations();
});
</script>
