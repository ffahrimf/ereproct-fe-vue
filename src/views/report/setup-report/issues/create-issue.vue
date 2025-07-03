<template>
  <h-dialog :dialog="dialog" @close="handleClose" persistent>
    <div
      class="bg-white rounded-xl shadow-lg h-[75vh] w-[50vw] flex flex-col relative"
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
          Tambah Data Kendala
        </h2>
        <p class="text-[11px] text-gray-500">
          Pilih peserta dan masukkan detail kendala yang terjadi.
        </p>
      </div>

      <div class="flex-1 p-5 overflow-y-auto styled-scroll space-y-4">
        <div
          v-if="issues.length === 0"
          class="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300 rounded-lg"
        >
          <div class="p-8">
            <h-icon
              name="document-plus"
              size="40"
              color="text-gray-400"
              class="inline-flex"
            />
            <h3 class="mt-2 text-base font-medium text-gray-800">
              Belum Ada Kendala
            </h3>
            <p class="mt-1 text-xs text-gray-500">
              Klik tombol "Tambah Kendala" di bawah untuk memulai.
            </p>
          </div>
        </div>

        <div
          v-for="(issue, index) in issues"
          :key="index"
          class="bg-gray-50 border border-gray-200 rounded-lg p-4 relative animate-fade-in"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Peserta Berkendala</label
              >
              <div class="flex items-center gap-2">
                <div class="flex-grow">
                  <h-select
                    placeholder="- Pilih Peserta -"
                    :items="
                      getAvailableParticipants(issue.selected_participant?.id)
                    "
                    item-name="name"
                    item-value="id"
                    return-object
                    :loading="participantState.loading"
                    v-model="issue.selected_participant"
                    @change="onParticipantChange(issue, index)"
                    class="w-full"
                    size-value="text-xs"
                    item-size="text-xs"
                  >
                    <template #search>
                      <h-search-select
                        class="mb-1"
                        size="text-xs"
                        v-model="participantState.q.name"
                        placeholder="Cari nama peserta..."
                      ></h-search-select>
                    </template>
                  </h-select>
                  <h-errs :message="errs['participant_id_' + index]" />
                </div>
                <button
                  @click="removeIssue(index)"
                  class="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors self-start mt-1"
                  title="Hapus Kendala Peserta Ini"
                >
                  <h-icon name="trash" size="16" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Kejadian / Kendala</label
              >
              <h-area
                input-size="text-xs"
                rows="2"
                v-model="issue.issue_type"
                placeholder="Contoh: Kamera peserta berkendala"
              />
              <h-errs :message="errs['issue_type_' + index]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Tindak Lanjut</label
              >
              <h-area
                input-size="text-xs"
                rows="2"
                v-model="issue.issue_action"
                placeholder="Contoh: Membuat room Google Meet"
              />
              <h-errs :message="errs['issue_action_' + index]" />
            </div>
            <div class="">
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Respons Peserta</label
              >
              <h-area
                input-size="text-xs"
                rows="2"
                v-model="issue.participant_issue_response"
                placeholder="Contoh: Peserta join room Google Meet"
              />
              <h-errs :message="errs['participant_issue_response_' + index]" />
            </div>
            <div class="">
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Keterangan</label
              >
              <h-area
                input-size="text-xs"
                v-model="issue.remarks"
                placeholder="Contoh: Peserta melanjutkan tes"
                rows="2"
              />
              <h-errs :message="errs['remarks_' + index]" />
            </div>
          </div>
        </div>
      </div>

      <div
        class="p-4 text-xs bg-white border-t rounded-b-xl border-gray-200 flex justify-between items-center"
      >
        <div>
          <button
            @click="addIssue"
            class="px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
          >
            <h-icon name="plus-circle" size="15" />
            Tambah Kendala
          </button>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="resetForm"
            :disabled="issues.length === 0"
            class="p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs gap-1 font-medium rounded-lg active:scale-95 bg-slate-200"
          >
            <h-icon name="arrow-path" size="16" />
          </button>
          <button
            @click="handleSubmit"
            :disabled="loading || issues.length === 0"
            class="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <h-icon name="check-circle" size="15" />
            Confirm & Simpan
          </button>
        </div>
      </div>
    </div>
  </h-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { form } from "../setup";
import { useToast } from "../../../../composables/use-helper";
import useApi from "../../../../composables/use-api";

interface ParticipantIF {
  id: number;
  name: string;
}
interface Issue {
  participant_id: number | null;
  selected_participant: ParticipantIF | null;
  issue_type: string;
  issue_action: string;
  participant_issue_response: string;
  remarks: string;
}
interface DataParticipantStateIF {
  list: Array<ParticipantIF> | [];
  loading: boolean;
  q: { name: string };
}

const emit = defineEmits(["close", "refetch"]);
const api = new useApi();

const props = defineProps({
  dialog: Boolean
});

const loading = ref<boolean>(false);
const existingIssueParticipantIds = ref<number[]>([]);
const issues = ref<Issue[]>([]);
const errs = reactive<Record<string, string>>({});

const participantState = reactive<DataParticipantStateIF>({
  list: [],
  loading: false,
  q: {
    name: ""
  }
});

const getAvailableParticipants = (
  currentParticipantId: number | null | undefined
) => {
  const selectedInFormIds = issues.value
    .map((issue) => issue.participant_id)
    .filter((id) => id !== currentParticipantId);

  const filteredByName = participantState.list.filter((p) =>
    p.name.toLowerCase().includes(participantState.q.name.toLowerCase())
  );

  return filteredByName.filter(
    (participant) =>
      !selectedInFormIds.includes(participant.id) &&
      !existingIssueParticipantIds.value.includes(participant.id)
  );
};

const getParticipants = (): void => {
  const event_id = form.event_id;
  if (!event_id) return;
  participantState.loading = true;
  api
    .get(`event-detail?event_id=${event_id}`)
    .then((res) => {
      participantState.list = res.data.items.map((i: any) => ({
        id: i.participant.id,
        name: i.participant.name
      }));
    })
    .catch((err) => {
      useToast(err.message || "Gagal memuat daftar peserta.", "error");
    })
    .finally(() => {
      participantState.loading = false;
    });
};

const onParticipantChange = (issue: Issue, index: number) => {
  if (issue.selected_participant) {
    issue.participant_id = issue.selected_participant.id;
    const errorKey = `participant_id_${index}`;
    if (errs[errorKey]) delete errs[errorKey];
  } else {
    issue.participant_id = null;
  }
};

const fetchExistingIssues = async () => {
  if (!form.id) return;
  try {
    const res = await api.get(`report-issue?report_id=${form.id}`);
    existingIssueParticipantIds.value = res.data.items.map(
      (issue: any) => issue.participant.id
    );
  } catch (err: any) {
    useToast(err.message, "error");
  }
};

const addIssue = () => {
  issues.value.push({
    participant_id: null,
    selected_participant: null,
    issue_type: "",
    issue_action: "",
    participant_issue_response: "",
    remarks: ""
  });
};

const removeIssue = (index: number) => {
  issues.value.splice(index, 1);

  delete errs[`participant_id_${index}`];
  delete errs[`issue_type_${index}`];
  delete errs[`issue_action_${index}`];
  delete errs[`participant_issue_response_${index}`];
  delete errs[`remarks_${index}`];
};

const resetForm = () => {
  issues.value = [];
  participantState.q.name = "";
  Object.keys(errs).forEach((key) => delete errs[key]);
};

const handleClose = () => {
  emit("close");
  resetForm();
};

const handleSubmit = async () => {
  Object.keys(errs).forEach((key) => delete errs[key]);
  loading.value = true;

  let allRequestsSucceeded = true;

  for (const [index, issue] of issues.value.entries()) {
    const body = {
      report_id: form.id,
      participant_id: issue.participant_id,
      issue_type: issue.issue_type,
      issue_action: issue.issue_action,
      participant_issue_response: issue.participant_issue_response,
      remarks: issue.remarks
    };
    const req = {
      path: "report-issue/create",
      body: body
    };

    try {
      await api.post(req);
    } catch (err: any) {
      allRequestsSucceeded = false;
      useToast(err.message, "error");

      const requiredErr = err.errors;
      if (requiredErr) {
        for (let key in requiredErr) {
          const newKey = `${key}_${index}`;
          errs[newKey] =
            requiredErr[key].length > 1
              ? requiredErr[key].join(`\n`)
              : requiredErr[key][0];
        }
      }
    }
  }

  loading.value = false;

  if (allRequestsSucceeded) {
    useToast("Semua data kendala berhasil disimpan.", "success");
    emit("refetch");
    handleClose();
  } else {
    useToast(
      "Gagal menyimpan. Harap periksa kembali data yang anda kirimkan.",
      "warning"
    );
  }
};

watch(
  () => props.dialog,
  async (isShown) => {
    if (isShown) {
      resetForm();
      participantState.loading = true;
      await fetchExistingIssues();
      getParticipants();
    }
  }
);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
