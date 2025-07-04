<template>
  <div class="bg-white rounded-md min-h-[225px] pt-3 pb-5 px-4">
    <div class="flex items-center justify-between">
      <p class="text-xs font-medium text-gray-500 font-dm-sans">
        Kendala Peserta
      </p>
      <button
        v-if="store.role === 'PROCTOR'"
        @click="dialog.create = true"
        class="p-0.5 border border-gray-200 rounded-md"
      >
        <h-icon name="plus" size="15" color="text-gray-700" />
      </button>
    </div>
    <hr class="mt-2" />
    <div
      v-for="(item, i) in data"
      :key="`item-${i}`"
      class="mt-3 text-[11px] border border-gray-200 rounded-lg flex flex-col gap-2 p-3 relative"
    >
      <div class="flex justify-between items-center">
        <p class="font-medium">{{ item.participant.name }}</p>
        <h-menu v-if="store.role === 'PROCTOR'" arrow closeOnClick>
          <template #default="">
            <h-icon name="ellipsis-horizontal" size="15"></h-icon>
          </template>
          <template #item>
            <div class="text-[11px]">
              <button
                @click="handleOpenUpdate(item)"
                class="py-1 px-2 hover:bg-slate-50 text-gray-700 font-medium rounded flex items-center gap-2 w-full outline-none"
              >
                <p>Update</p>
              </button>
              <button
                @click="onDelete(item.id)"
                class="py-1 px-2 hover:bg-slate-50 text-red-500 font-medium rounded flex items-center gap-2 w-full outline-none"
              >
                <p>Delete</p>
              </button>
            </div>
          </template>
        </h-menu>
      </div>

      <div class="grid grid-cols-12 gap-y-1 text-gray-700">
        <p class="col-span-4">Kejadian</p>
        <p class="col-span-1">:</p>
        <p class="col-span-7 break-words whitespace-pre-line">
          {{ item.issue_type }}
        </p>

        <p class="col-span-4">Tindaklanjut</p>
        <p class="col-span-1">:</p>
        <p class="col-span-7 break-words whitespace-pre-line">
          {{ item.issue_action }}
        </p>

        <p class="col-span-4">Respon Peserta</p>
        <p class="col-span-1">:</p>
        <p class="col-span-7 break-words whitespace-pre-line">
          {{ item.participant_issue_response }}
        </p>

        <p class="col-span-4">Keterangan</p>
        <p class="col-span-1">:</p>
        <p class="col-span-7 break-words whitespace-pre-line">
          {{ item.remarks }}
        </p>
      </div>
    </div>
  </div>

  <CreateIssue
    :dialog="dialog.create"
    @close="dialog.create = false"
    @refetch="getIssue"
  />

  <UpdateIssue
    :dialog="dialog.update"
    :issue-to-edit="selectedIssue"
    @close="handleCloseUpdate"
    @refetch="getIssue"
  />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { IssueIF } from "../../../../interface/area.interface";
import useApi from "../../../../composables/use-api";
import { form } from "../setup";
import { useToast } from "../../../../composables/use-helper";

import CreateIssue from "./create-issue.vue";
import UpdateIssue from "./update-issue.vue";
import { mainStore } from "../../../../store";

interface DialogIf {
  create: boolean;
  update: boolean;
}

const loading = ref<Boolean>(false);
const data = ref<IssueIF[] | []>([]);
const store = mainStore();
const api = new useApi();

const selectedIssue = ref<IssueIF | null>(null);

const dialog = reactive<DialogIf>({
  create: false,
  update: false
});

const getIssue = (): void => {
  loading.value = true;
  const q = form.id;
  api.get(`report-issue?report_id=${q}`).then((res) => {
    data.value = res.data.items;
    loading.value = false;
  });
};

const handleOpenUpdate = (item: IssueIF) => {
  selectedIssue.value = item;
  dialog.update = true;
};

const handleCloseUpdate = () => {
  dialog.update = false;
  selectedIssue.value = null;
};

const onDelete = (item: number) => {
  loading.value = true;
  api
    .post({
      path: `report-issue/delete/${item}`,
      body: {}
    })
    .then((res) => {
      useToast(res.title ?? "Kendala Berhasil Terhapus!", "success");
      loading.value = false;
      getIssue();
    })
    .catch((err) => {
      useToast(err.message, "error");
      getIssue();
      loading.value = false;
    });
};

onMounted(() => {
  getIssue();
});
</script>
