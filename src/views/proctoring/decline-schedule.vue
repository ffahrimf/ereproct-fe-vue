<template>
  <h-dialog :dialog="dialog">
    <div
      class="rounded-2xl flex items-center flex-col bg-white w-[400px] p-3 pb-5 relative"
    >
      <div class="w-full mt-2 mb-5 px-2">
        <h-area
          v-model="form.note"
          row="3"
          placeholder="Ketik alasan penolakan..."
        ></h-area>

        <h-errs :message="errs.note" />
      </div>

      <div class="w-full flex text-sm justify-end gap-3 px-2">
        <button
          @click="closeDialog"
          class="py-1.5 px-6 font-medium text-slate-900 border-solid border-2 border-gray-200 hover:bg-slate-500/20 active:bg-slate-500/50 rounded-lg outline-none"
        >
          Cancel
        </button>

        <button
          class="py-1.5 px-6 font-medium text-white border-solid bg-[#0E1D54] hover:bg-[#0C1A4B] active:bg-[#0C1A4B] rounded-lg outline-none"
          @click="declineSchedule"
        >
          Confirm
        </button>
      </div>
      <div
        v-if="loading"
        class="overlayed absolute w-full h-full bg-white top-0 left-0 rounded-lg flex justify-center items-center"
      >
        <spinner size="30px" />
        <p class="text-base text-center font-bold text-slate-700 ml-3">
          Loading...
        </p>
      </div>
    </div>
  </h-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import useApi from "../../composables/use-api";
import { useFilterProperties, useToast } from "../../composables/use-helper";

interface DeclineSchedule {
  id: number | null;
  event_id: number | null;
  proctor_id: number | null;
  number_of_participants: number;
  number_of_participants_logged_in: number;
  number_of_participants_only_logged_in: number;
  // number_of_participants_not_logged_in: number;
  number_of_participants_completed: number;
  number_of_participants_not_completed: number;
  status: string | null;
  note: string | null;
}

const emit = defineEmits(["close", "refetch"]);
const api = new useApi();
const errs = reactive<{ note?: string }>({});
const loading = ref(false);

const props = defineProps({
  dialog: Boolean,
  pocket: null
});

const form = reactive<Partial<DeclineSchedule>>({});

const resetForm = () => {
  form.id = null;
  form.event_id = null;
  form.proctor_id = null;
  form.number_of_participants = 0;
  form.number_of_participants_logged_in = 0;
  form.number_of_participants_only_logged_in = 0;
  // form.number_of_participants_not_logged_in = 0;
  form.number_of_participants_completed = 0;
  form.number_of_participants_not_completed = 0;
  form.status = null;
  form.note = null;
  errs.note = "";
};

const closeDialog = () => {
  emit("close");
  resetForm();
};

const declineSchedule = (): void => {
  errs.note = "";
  if (!form.note || form.note.trim() === "") {
    errs.note = "Alasan penolakan harus diisi";
    return;
  }

  loading.value = true;

  let body = useFilterProperties(form);

  const req = {
    path: props.pocket.path,
    body: body
  };

  api
    .post(req)
    .then(() => {
      useToast("Jadwal proctoring berhasil ditolak", "success");
      emit("close");
      emit("refetch");
      loading.value = false;
    })
    .catch((err) => {
      useToast(err.message, "error");
      loading.value = false;
    });
};

watch(
  () => props.dialog,
  (isOpen) => {
    if (isOpen && props.pocket?.value) {
      const newVal = props.pocket.value;
      form.id = newVal.id;
      form.event_id = newVal.event.id;
      form.proctor_id = newVal.proctor.id;
      form.number_of_participants = newVal.number_of_participants;
      form.number_of_participants_logged_in =
        newVal.number_of_participants_logged_in;
      form.number_of_participants_only_logged_in =
        newVal.number_of_participants_only_logged_in;
      // form.number_of_participants_not_logged_in =
      // newVal.number_of_participants_not_logged_in;
      form.number_of_participants_completed =
        newVal.number_of_participants_completed;
      form.number_of_participants_not_completed =
        newVal.number_of_participants_not_completed;
      form.status = "DECLINED";
      form.note = "";
    }
  }
);
</script>

<style scoped>
@keyframes swing {
  20% {
    transform: rotate3d(0, 0, 1, 15deg);
  }

  40% {
    transform: rotate3d(0, 0, 1, -10deg);
  }

  60% {
    transform: rotate3d(0, 0, 1, 5deg);
  }

  80% {
    transform: rotate3d(0, 0, 1, -5deg);
  }

  to {
    transform: rotate3d(0, 0, 1, 0deg);
  }
}

.icon {
  animation: swing 1s ease-in-out;
}
</style>
