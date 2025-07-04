<template>
  <h-dialog :dialog="dialog" @close="handleClose" persistent>
    <div
      class="bg-white rounded-xl shadow-lg h-[85vh] w-[55vw] flex flex-col relative"
    >
      <icon-btn
        icon="x-mark"
        @click="handleClose"
        class="absolute top-3 right-3 z-20"
      />

      <h-overlay
        :value="
          loading || participantState.loading || violationTypeState.loading
        "
        absolute
        class="flex items-center justify-center gap-3"
      >
        <spinner />
        <span class="text-white font-medium">Memuat data...</span>
      </h-overlay>

      <div class="p-4 border-b border-gray-200">
        <h2 class="text-base font-inter font-bold text-gray-800">
          Tambah Data Pelanggaran
        </h2>
        <p class="text-[11px] text-gray-500">
          Pilih peserta dan masukkan detail pelanggaran yang terjadi.
        </p>
      </div>

      <div class="flex-1 p-5 overflow-y-auto styled-scroll space-y-4">
        <div
          v-if="violations.length === 0"
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
              Belum Ada Pelanggaran
            </h3>
            <p class="mt-1 text-xs text-gray-500">
              Klik tombol "Tambah Pelanggaran" di bawah untuk memulai.
            </p>
          </div>
        </div>

        <!-- Loop untuk setiap blok form pelanggaran -->
        <div
          v-for="(violation, index) in violations"
          :key="index"
          class="bg-gray-50 border border-gray-200 rounded-lg p-4 relative animate-fade-in"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            <!-- Pemilihan Peserta -->
            <div class="col-span-2">
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Peserta Terindikasi</label
              >
              <div class="flex items-center gap-2">
                <div class="flex-grow">
                  <h-select
                    placeholder="- Pilih Peserta -"
                    :items="
                      getAvailableParticipants(
                        violation.participant_id,
                        violation.participantSearchQuery
                      )
                    "
                    item-name="name"
                    item-value="id"
                    :loading="participantState.loading"
                    v-model="violation.participant_id"
                    class="w-full"
                    size-value="text-xs"
                    item-size="text-xs"
                  >
                    <template #search>
                      <h-search-select
                        class="mb-1"
                        size="text-xs"
                        v-model="violation.participantSearchQuery"
                        placeholder="Cari nama peserta..."
                      ></h-search-select>
                    </template>
                  </h-select>
                  <h-errs :message="errs[`participant_id_${index}`]" />
                </div>
                <button
                  @click="removeViolationBlock(index)"
                  class="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors self-start mt-1"
                  title="Hapus Blok Pelanggaran Ini"
                >
                  <h-icon name="trash" size="16" />
                </button>
              </div>
            </div>

            <!-- Bagian Jenis Pelanggaran (Daftar Dinamis) -->
            <div class="col-span-2 space-y-3 mb-1">
              <label class="block text-xs font-medium text-gray-700 -mb-2"
                >Kejadian / Jenis Pelanggaran</label
              >
              <div
                v-for="(detail, detailIndex) in violation.violation_details"
                :key="detailIndex"
                class="flex items-start gap-2"
              >
                <div class="flex-grow">
                  <h-select
                    placeholder="- Pilih Jenis Pelanggaran -"
                    :items="getAvailableViolationTypes(detail.searchQuery)"
                    item-name="condition"
                    item-value="id"
                    v-model="detail.violation_id"
                    class="w-full"
                    size-value="text-xs"
                    item-size="text-xs"
                  >
                    <template #search>
                      <h-search-select
                        class="mb-1"
                        size="text-xs"
                        v-model="detail.searchQuery"
                        placeholder="Cari jenis pelanggaran..."
                      ></h-search-select>
                    </template>
                  </h-select>
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
                  @click="removeViolationDetail(index, detailIndex)"
                  class="p-2 text-gray-400 hover:text-red-500 rounded-md transition-colors self-start mt-1"
                  title="Hapus Jenis Pelanggaran"
                >
                  <h-icon name="minus-circle" size="16" />
                </button>
              </div>
              <h-errs :message="errs[`violation_details_${index}`]" />
              <button
                @click="addViolationDetail(index)"
                class="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <h-icon name="plus" size="14" />
                Tambah Jenis Pelanggaran
              </button>
            </div>

            <!-- Input lainnya dengan pesan error -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Tindak Lanjut</label
              >
              <h-area
                input-size="text-xs"
                rows="2"
                v-model="violation.violation_action"
              />
              <h-errs :message="errs[`violation_action_${index}`]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Respons Peserta</label
              >
              <h-area
                placeholder="(-) jika kosong"
                input-size="text-xs"
                rows="2"
                v-model="violation.participant_violation_response"
              />
              <h-errs
                :message="errs[`participant_violation_response_${index}`]"
              />
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Keterangan</label
              >
              <h-area
                input-size="text-xs"
                v-model="violation.remarks"
                rows="2"
              />
              <h-errs :message="errs[`remarks_${index}`]" />
            </div>
          </div>
        </div>
      </div>

      <div
        class="p-4 text-xs bg-white border-t rounded-b-xl border-gray-200 flex justify-between items-center"
      >
        <div>
          <button
            @click="addViolationBlock"
            class="px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
          >
            <h-icon name="plus-circle" size="15" />
            Tambah Pelanggaran
          </button>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="handleSubmit"
            :disabled="loading || violations.length === 0"
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
import { form as reportForm } from "../setup";
import { useToast } from "../../../../composables/use-helper";
import useApi from "../../../../composables/use-api";

interface ViolationDetail {
  violation_id: number | null;
  period: number;
  searchQuery: string;
}
interface ViolationForm {
  participant_id: number | null;
  violation_action: string;
  participant_violation_response: string;
  remarks: string;
  violation_details: ViolationDetail[];
  participantSearchQuery: string;
}

const emit = defineEmits(["close", "refetch"]);
const api = new useApi();

const props = defineProps({
  dialog: Boolean
});

const loading = ref<boolean>(false);
const violations = ref<ViolationForm[]>([]);
const errs = reactive<Record<string, string>>({});

const participantState = reactive({ list: [] as any[], loading: false });
const violationTypeState = reactive({ list: [] as any[], loading: false });

const getParticipants = async () => {
  const event_id = reportForm.event_id;
  if (!event_id) return;
  participantState.loading = true;
  try {
    const res = await api.get(`event-detail?event_id=${event_id}`);
    participantState.list = res.data.items.map((i: any) => ({
      id: i.participant.id,
      name: i.participant.name
    }));
  } catch (err: any) {
    useToast(err.message, "error");
  } finally {
    participantState.loading = false;
  }
};

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

const getAvailableParticipants = (
  currentParticipantId: number | null,
  searchQuery: string
) => {
  const selectedIds = violations.value
    .map((v) => v.participant_id)
    .filter((id) => id !== currentParticipantId);

  const availableList = participantState.list.filter(
    (p) => !selectedIds.includes(p.id)
  );

  if (!searchQuery) {
    return availableList;
  }
  return availableList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

const getAvailableViolationTypes = (searchQuery: string) => {
  if (!searchQuery) {
    return violationTypeState.list;
  }
  return violationTypeState.list.filter((v) =>
    v.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

const addViolationBlock = () => {
  violations.value.push({
    participant_id: null,
    violation_action: "",
    participant_violation_response: "",
    remarks: "",

    violation_details: [{ violation_id: null, period: 1, searchQuery: "" }],
    participantSearchQuery: ""
  });
};

const removeViolationBlock = (index: number) => {
  violations.value.splice(index, 1);
  Object.keys(errs).forEach((key) => delete errs[key]);
};

const addViolationDetail = (violationIndex: number) => {
  violations.value[violationIndex].violation_details.push({
    violation_id: null,
    period: 1,
    searchQuery: ""
  });
};

const removeViolationDetail = (violationIndex: number, detailIndex: number) => {
  violations.value[violationIndex].violation_details.splice(detailIndex, 1);
};

const resetForm = () => {
  violations.value = [];
  Object.keys(errs).forEach((key) => delete errs[key]);
};

const handleClose = () => {
  emit("close");
  resetForm();
};

const handleSubmit = async () => {
  Object.keys(errs).forEach((key) => delete errs[key]);

  if (violations.value.length === 0) {
    useToast("Tidak ada data pelanggaran untuk disimpan.", "info");
    return;
  }

  let hasValidationErrors = false;
  violations.value.forEach((violation, index) => {
    if (!violation.participant_id) {
      errs[`participant_id_${index}`] = "Peserta harus dipilih.";
      hasValidationErrors = true;
    }

    const filledDetails = violation.violation_details.filter(
      (d) => d.violation_id
    );
    if (filledDetails.length === 0) {
      errs[`violation_details_${index}`] =
        "Pilih setidaknya satu jenis pelanggaran.";
      hasValidationErrors = true;
    }

    if (!violation.violation_action?.trim()) {
      errs[`violation_action_${index}`] = "Tindak lanjut tidak boleh kosong.";
      hasValidationErrors = true;
    }
    if (!violation.participant_violation_response?.trim()) {
      errs[`participant_violation_response_${index}`] =
        "Respons peserta tidak boleh kosong.";
      hasValidationErrors = true;
    }
    if (!violation.remarks?.trim()) {
      errs[`remarks_${index}`] = "Keterangan tidak boleh kosong.";
      hasValidationErrors = true;
    }
  });

  if (hasValidationErrors) {
    useToast("Harap lengkapi semua data yang wajib diisi.", "warning");
    return;
  }

  loading.value = true;

  const promises = violations.value.map((violation, index) => {
    const body = {
      report_id: reportForm.id,
      participant_id: violation.participant_id,
      violation_action: violation.violation_action,
      participant_violation_response: violation.participant_violation_response,
      remarks: violation.remarks,
      violation_type: violation.violation_details
        .filter((d) => d.violation_id)
        .map((d) => ({
          violation_id: d.violation_id,
          period: d.period
        }))
    };
    return api
      .post({ path: "report-violation/create", body: body })
      .catch((err: any) => {
        const errorKey = `participant_id_${index}`;
        errs[errorKey] = `Gagal menyimpan untuk peserta ini: ${
          err.message || "Error tidak diketahui"
        }`;
        return Promise.reject(err);
      });
  });

  try {
    await Promise.all(promises);
    useToast("Semua data pelanggaran berhasil disimpan.", "success");
    emit("refetch");
    handleClose();
  } catch (error: any) {
    useToast("Beberapa data gagal disimpan, harap periksa kembali.", "warning");
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.dialog,
  async (isShown) => {
    if (isShown) {
      resetForm();
      getParticipants();
      getViolationTypes();
    }
  }
);
</script>
