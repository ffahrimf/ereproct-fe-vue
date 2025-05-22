<template>
  <h-dialog :dialog="dialog">
    <div
      class="rounded-2xl flex items-center flex-col bg-white w-[400px] p-3 py-5 relative"
    >
      <div class="flex w-full px-2 items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">Assign Proctoring to</p>
        <button @click="closeDialog">
          <h-icon name="x-mark" class="text-stone-700" size="16" />
        </button>
      </div>
      <div class="w-full mt-5 mb-5 px-2">
        <h-select
          placeholder="- Pilih Proctor -"
          :items="proctor.list"
          item-name="name"
          item-value="id"
          return-object
          :loading="proctor.loading"
          v-model="proctor.selected"
          @change="onProctorChange"
        >
          <template #search>
            <h-search
              class="mb-1"
              v-model="proctor.q.name"
              @keyup="proctor.loading = true"
              placeholder="Search..."
              @search="getProctor"
            ></h-search>
          </template>
        </h-select>
      </div>
      <div class="inline-flex justify-end px-2 text-sm w-full">
        <button
          class="py-1.5 px-6 font-medium text-white border-solid bg-[#0E1D54] hover:bg-[#0C1A4B] active:bg-[#0C1A4B] rounded-lg outline-none"
          @click="assignProctoring"
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
import { onMounted, reactive, ref, watch } from "vue";
import useApi from "../../composables/use-api";
import {
  useFilterProperties,
  useQuery,
  useToast
} from "../../composables/use-helper";
import { ProctorIF } from "../stakeholder/proctor/proctor.interface";

interface DataProctorIF {
  list: Array<ProctorIF> | [];
  loading: boolean;
  selected: ProctorIF | null;
  find: string;
  q: any;
}

interface CreateSchedule {
  event_id: number | null;
  proctor_id: number | null;
  number_of_participants: number;
  number_of_participants_logged_in: number;
  number_of_participants_only_logged_in: number;
  // number_of_participants_not_logged_in: number;
  number_of_participants_completed: number;
  number_of_participants_not_completed: number;
  status: string;
}

const emit = defineEmits(["close", "refetch"]);
const api = new useApi();
const loading = ref(false);

const props = defineProps({
  dialog: Boolean,
  pocket: null
});

const proctor = reactive<DataProctorIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    name: "",
    status: true
  }
});

const form = reactive<CreateSchedule>({
  event_id: props.pocket?.value?.id ?? null,
  proctor_id: null,
  number_of_participants: 0,
  number_of_participants_logged_in: 0,
  number_of_participants_only_logged_in: 0,
  // number_of_participants_not_logged_in: 0,
  number_of_participants_completed: 0,
  number_of_participants_not_completed: 0,

  status: "SCHEDULED"
});

const onProctorChange = () => {
  if (proctor.selected) {
    form.proctor_id = proctor.selected.id;
  } else {
    form.proctor_id = null;
  }
};

const resetForm = () => {
  form.event_id = null;
  form.proctor_id = null;
  form.number_of_participants = 0;
  form.number_of_participants_logged_in = 0;
  form.number_of_participants_only_logged_in = 0;
  // form.number_of_participants_not_logged_in = 0;
  form.number_of_participants_completed = 0;
  form.number_of_participants_not_completed = 0;
  form.status = "SCHEDULED";
};

const closeDialog = () => {
  emit("close");
  resetForm();
};

const createSchedule = (): void => {
  loading.value = true;

  let body = useFilterProperties(form);
  let req = {
    path: `report/create`,
    body: body
  };

  api
    .post(req)
    .then(() => {
      emit("close");
      emit("refetch");
      loading.value = false;
      resetForm();
    })
    .catch(() => {
      loading.value = false;
    });
};

const assignProctoring = (): void => {
  loading.value = true;

  const req = {
    path: props.pocket.path,
    body: { id: props.pocket.value.id, status: "ASSIGNED" }
  };

  api
    .post(req)
    .then(() => {
      useToast("Proctoring telah dijadwalkan", "success");
      emit("close");
      emit("refetch");
      createSchedule();
      loading.value = false;
    })
    .catch((err) => {
      useToast(err.message, "error");
      loading.value = false;
    });
};

const getProctor = (): void => {
  proctor.loading = true;
  const q = useQuery(proctor.q);
  api.get(`proctor${q}`).then((res) => {
    let raw: Array<ProctorIF> = res.data.items;
    if (proctor.q.Page > 1) {
      proctor.list = [...proctor.list, ...raw];
    } else {
      proctor.list = raw;
    }
    proctor.loading = false;
  });
};

watch(
  () => props.pocket?.value,
  (newVal) => {
    if (newVal) {
      form.event_id = newVal.id;
    }
  },
  { immediate: true }
);

onMounted(() => {
  getProctor();
});
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
