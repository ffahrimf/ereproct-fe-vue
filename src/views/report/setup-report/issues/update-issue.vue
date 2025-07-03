<template>
  <h-dialog :dialog="dialog" @close="handleClose" persistent>
    <div
      class="bg-white rounded-xl shadow-lg h-min-[92vh] w-[50vw] flex flex-col relative"
    >
      <icon-btn
        icon="x-mark"
        @click="handleClose"
        class="absolute top-3 right-3 z-20"
      />

      <h-overlay
        :value="loading"
        absolute
        class="flex items-center justify-center gap-3"
      >
        <spinner />
      </h-overlay>

      <div class="p-4 border-b border-gray-200">
        <h2 class="text-base font-inter font-bold text-gray-800">
          Update Data Kendala
        </h2>
        <p class="text-[11px] text-gray-500">
          Ubah detail kendala yang terjadi untuk peserta yang dipilih.
        </p>
      </div>

      <div class="flex-1 p-5 overflow-y-auto styled-scroll space-y-4">
        <div
          v-if="form.id"
          class="bg-gray-50 border border-gray-200 rounded-lg p-4 relative"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Peserta Berkendala</label
              >
              <div
                class="w-full p-3 text-xs bg-gray-200 text-gray-800 rounded-md"
              >
                {{ form.participant_name }}
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Kejadian / Kendala</label
              >
              <h-area
                input-size="text-xs"
                rows="2"
                v-model="form.issue_type"
                placeholder="Contoh: Kamera peserta berkendala"
              />
              <h-errs :message="errs.issue_type" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Tindak Lanjut</label
              >
              <h-area
                input-size="text-xs"
                rows="2"
                v-model="form.issue_action"
                placeholder="Contoh: Membuat room Google Meet"
              />
              <h-errs :message="errs.issue_action" />
            </div>
            <div class="">
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Respons Peserta</label
              >
              <h-area
                input-size="text-xs"
                rows="2"
                v-model="form.participant_issue_response"
                placeholder="Contoh: Peserta join room Google Meet"
              />
              <h-errs :message="errs.participant_issue_response" />
            </div>
            <div class="">
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Keterangan</label
              >
              <h-area
                input-size="text-xs"
                v-model="form.remarks"
                placeholder="Contoh: Peserta melanjutkan tes"
                rows="2"
              />
              <h-errs :message="errs.remarks" />
            </div>
          </div>
        </div>
      </div>

      <div
        class="p-4 text-xs bg-white border-t rounded-b-xl border-gray-200 flex justify-end items-center"
      >
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <h-icon name="check-circle" size="15" />
          Update & Simpan
        </button>
      </div>
    </div>
  </h-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { form as reportForm } from "../setup"; // Ganti nama biar ga konflik
import { useToast } from "../../../../composables/use-helper";
import useApi from "../../../../composables/use-api";
import { IssueIF } from "../../../../interface/area.interface";

const emit = defineEmits(["close", "refetch"]);
const api = new useApi();

const props = defineProps<{
  dialog: boolean;
  issueToEdit: IssueIF | null; // Prop untuk menerima data yg akan diedit
}>();

const loading = ref<boolean>(false);
const errs = reactive<Record<string, string>>({});

// Kita pakai satu objek 'form', bukan array 'issues'
const form = reactive({
  id: null as number | null,
  participant_id: null as number | null,
  participant_name: "",
  issue_type: "",
  issue_action: "",
  participant_issue_response: "",
  remarks: ""
});

const resetForm = () => {
  form.id = null;
  form.participant_id = null;
  form.participant_name = "";
  form.issue_type = "";
  form.issue_action = "";
  form.participant_issue_response = "";
  form.remarks = "";
  Object.keys(errs).forEach((key) => delete errs[key]);
};

const handleClose = () => {
  emit("close");
};

const handleSubmit = async () => {
  if (!form.id) return;

  Object.keys(errs).forEach((key) => delete errs[key]);
  loading.value = true;

  const body = {
    id: form.id,
    report_id: reportForm.id,
    participant_id: form.participant_id,
    issue_type: form.issue_type,
    issue_action: form.issue_action,
    participant_issue_response: form.participant_issue_response,
    remarks: form.remarks
  };

  try {
    await api.post({
      path: `report-issue/update`,
      body: body
    });
    useToast("Data kendala berhasil di-update.", "success");
    emit("refetch");
    handleClose();
  } catch (err: any) {
    useToast(err.message, "error");
    const requiredErr = err.errors;
    if (requiredErr) {
      for (let key in requiredErr) {
        errs[key] = requiredErr[key][0];
      }
    }
  } finally {
    loading.value = false;
  }
};

// Watcher untuk mengisi form saat dialog dibuka dengan data dari prop
watch(
  () => props.dialog,
  (isShown) => {
    resetForm();
    if (isShown && props.issueToEdit) {
      const data = props.issueToEdit;
      form.id = data.id;
      form.participant_id = Number(data.participant.id);
      form.participant_name = data.participant.name;
      form.issue_type = data.issue_type;
      form.issue_action = data.issue_action;
      form.participant_issue_response = data.participant_issue_response;
      form.remarks = data.remarks;
    }
  }
);
</script>
