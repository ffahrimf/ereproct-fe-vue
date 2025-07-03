<template>
  <h-dialog :dialog="dialog" @close="handleClose" persistent>
    <div
      class="bg-white rounded-xl shadow-lg h-[90vh] w-[50vw] flex flex-col relative"
    >
      <icon-btn
        icon="x-mark"
        @click="handleClose"
        class="absolute top-3 right-3 z-20"
      />

      <h-overlay
        :value="loading || violationTypeState.loading"
        absolute
        class="flex items-center justify-center gap-3"
      >
        <spinner />
      </h-overlay>

      <div class="p-4 border-b border-gray-200">
        <h2 class="text-base font-inter font-bold text-gray-800">
          Update Data Pelanggaran
        </h2>
        <p class="text-[11px] text-gray-500">
          Ubah detail pelanggaran yang terjadi untuk peserta yang dipilih.
        </p>
      </div>

      <div class="flex-1 p-5 overflow-y-auto styled-scroll space-y-4">
        <div
          v-if="form.id"
          class="bg-gray-50 border border-gray-200 rounded-lg p-4 relative"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Peserta</label
              >
              <div
                class="w-full p-2.5 text-xs bg-gray-200 text-gray-800 rounded-md"
              >
                {{ form.participant_name }}
              </div>
            </div>

            <!-- Daftar Jenis Pelanggaran -->
            <div class="col-span-2 space-y-3">
              <label class="block text-xs font-medium text-gray-700 -mb-2"
                >Kejadian / Jenis Pelanggaran</label
              >
              <div
                v-for="(detail, detailIndex) in form.violation_details"
                :key="detailIndex"
                class="flex items-start gap-2"
              >
                <div class="flex-grow">
                  <h-select
                    placeholder="- Pilih Jenis Pelanggaran -"
                    :items="violationTypeState.list"
                    item-name="condition"
                    item-value="id"
                    v-model="detail.violation_id"
                    class="w-full"
                    size-value="text-xs"
                    item-size="text-xs"
                  />
                </div>
                <div class="w-24">
                  <h-input
                    type="number"
                    v-model="detail.period"
                    placeholder="Period"
                    input-size="text-xs"
                    min="1"
                  />
                </div>
                <button
                  @click="removeViolationDetail(detailIndex)"
                  class="p-2 text-gray-400 hover:text-red-500 rounded-md transition-colors self-start mt-1"
                  title="Hapus Jenis Pelanggaran"
                >
                  <h-icon name="minus-circle" size="16" />
                </button>
              </div>
              <button
                @click="addViolationDetail"
                class="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <h-icon name="plus" size="14" />
                Tambah Jenis Pelanggaran
              </button>
            </div>

            <!-- Input lainnya -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Tindak Lanjut</label
              >
              <h-area
                input-size="text-xs"
                rows="2"
                v-model="form.violation_action"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Respons Peserta</label
              >
              <h-area
                input-size="text-xs"
                rows="2"
                v-model="form.participant_violation_response"
              />
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Keterangan</label
              >
              <h-area input-size="text-xs" v-model="form.remarks" rows="2" />
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
import { useToast } from "../../../../composables/use-helper";
import useApi from "../../../../composables/use-api";

const emit = defineEmits(["close", "refetch"]);
const api = new useApi();

const props = defineProps<{
  dialog: boolean;
  violationToEdit: any | null;
}>();

const loading = ref<boolean>(false);
const errs = reactive<Record<string, string>>({});

const violationTypeState = reactive({ list: [] as any[], loading: false });

const form = reactive({
  id: null as number | null,
  participant_name: "",
  violation_action: "",
  participant_violation_response: "",
  remarks: "",
  violation_details: [] as {
    id?: number;
    violation_id: number | null;
    period: number;
  }[]
});

const getViolationTypes = async () => {
  violationTypeState.loading = true;
  try {
    const res = await api.get("violation");
    violationTypeState.list = res.data.items;
  } catch (err: any) {
    useToast(err.message, "error");
  } finally {
    violationTypeState.loading = false;
  }
};

const addViolationDetail = () => {
  form.violation_details.push({
    violation_id: null,
    period: 1
  });
};

const removeViolationDetail = (detailIndex: number) => {
  form.violation_details.splice(detailIndex, 1);
};

const resetForm = () => {
  form.id = null;
  form.participant_name = "";
  form.violation_action = "";
  form.participant_violation_response = "";
  form.remarks = "";
  form.violation_details = [];
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
    violation_action: form.violation_action,
    participant_violation_response: form.participant_violation_response,
    remarks: form.remarks,
    violation_details: form.violation_details
  };

  try {
    await api.post({ path: `report-violation/update`, body: body });
    useToast("Data pelanggaran berhasil di-update.", "success");
    emit("refetch");
    handleClose();
  } catch (err: any) {
    useToast(err.message, "error");
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.dialog,
  (isShown) => {
    resetForm();
    if (isShown) {
      getViolationTypes();
      if (props.violationToEdit) {
        const data = props.violationToEdit;
        form.id = data.id;
        form.participant_name = data.participant.name;
        form.violation_action = data.violation_action;
        form.participant_violation_response =
          data.participant_violation_response;
        form.remarks = data.remarks;

        form.violation_details = data.reportViolationDetails.map((d: any) => ({
          id: d.id,
          violation_id: d.violation.id,
          period: d.period
        }));
      }
    }
  }
);
</script>
