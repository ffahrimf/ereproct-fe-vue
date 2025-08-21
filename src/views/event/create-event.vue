<template>
  <h-dialog :dialog="dialog">
    <div class="bg-white rounded-md shadow-lg w-[500px] flex flex-col relative">
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">Create Event</p>
        <icon-btn icon="x-mark" @click="closeDialog" />
      </div>
      <div class="py-3 px-6 flex-1 styled-scroll">
        <div class="flex mb-3 items-end gap-3">
          <div class="w-full">
            <h-select
              label="Client"
              placeholder="- Pilih Client -"
              :items="client.list"
              item-name="name"
              item-value="id"
              return-object
              :loading="client.loading"
              v-model="client.selected"
              @change="onClientChange"
            >
              <template #search>
                <h-search
                  class="mb-1"
                  v-model="client.q.name"
                  @keyup="client.loading = true"
                  placeholder="Search..."
                  @search="getClient"
                ></h-search>
              </template>
            </h-select>
            <h-errs :message="errs.client_id" />
          </div>

          <div>
            <h-menu-filter ref="filter">
              <template #default="">
                <h-btn class="px-3 py-2 text-nowrap" @click="openFilter"
                  >Pilih Peserta</h-btn
                >
              </template>
              <template #item>
                <div class="flex flex-col w-[40vh] text-xs rounded-xl">
                  <!-- Header -->
                  <div
                    class="flex items-center justify-between w-full rounded-t-xl bg-stone-50 p-3 border-b border-gray-200"
                  >
                    <p class="font-medium text-gray-500 text-[11px]">
                      Pilih Peserta
                    </p>
                    <button
                      @click="closeFilter"
                      class="aspect-square p-0.5 rounded-full hover:bg-gray-200 transition"
                    >
                      <h-icon name="x-mark" size="15" />
                    </button>
                  </div>
                  <!-- Search -->
                  <div class="flex flex-col gap-3 p-3">
                    <input
                      v-model="search"
                      type="text"
                      class="bg-white border border-gray-200 outline-none text-gray-900 text-[10.5px] rounded-lg block w-full ps-3 px-2 py-1.5"
                      placeholder="Cari peserta..."
                    />
                    <!-- List peserta event -->
                    <div
                      class="max-h-[130px] overflow-y-auto flex flex-col gap-3 no-scrollbar"
                    >
                      <button
                        v-for="p in filteredParticipants"
                        :key="p.id"
                        @click="toggleSelect(p.id)"
                        :class="[
                          'flex text-[10.5px] px-3 py-2 rounded-lg',
                          selectedIds.includes(p.id)
                            ? 'border-[1.4px] border-green-600'
                            : 'border border-gray-200'
                        ]"
                      >
                        <p class="line-clamp-1">{{ p.name }}</p>
                      </button>
                    </div>
                  </div>
                  <!-- Footer actions -->
                  <div
                    class="flex justify-between items-center p-3 border-t border-gray-200"
                  >
                    <button
                      @click="resetSelection"
                      class="px-2 py-0.5 text-[10px] rounded-md bg-transparent font-medium border border-gray-200 hover:border-slate-200 active:scale-95"
                    >
                      Reset
                    </button>
                    <button
                      @click="confirmSelection"
                      class="px-2 py-1 text-[10px] font-medium rounded-md bg-green-600 hover:bg-green-700 active:scale-95 text-white"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </template>
            </h-menu-filter>

            <h-errs :message="errs.participants" />
          </div>
        </div>
        <div class="mb-3">
          <h-date-picker
            label="Tanggal"
            placeholder="- Pilih Tanggal -"
            v-model="form.date"
          ></h-date-picker>
          <h-errs :message="errs.date"></h-errs>
        </div>
        <div class="mb-3 grid grid-cols-2 gap-5">
          <div class="">
            <h-time-picker
              class=""
              label="Start Time"
              v-model="form.start_time"
            ></h-time-picker>

            <h-errs :message="errs.start_time" />
          </div>
          <div class="">
            <h-time-picker
              label="Finish Time"
              v-model="form.finish_time"
            ></h-time-picker>

            <h-errs :message="errs.finish_time" />
          </div>
        </div>
      </div>
      <div class="py-3 px-6 border-t flex items-center justify-end">
        <h-btn class="px-3 py-2" @click="postData">Save</h-btn>
      </div>
      <h-overlay
        :value="loading"
        absolute
        class="flex items-center justify-center gap-3"
      >
        <spinner />
      </h-overlay>
    </div>
  </h-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

import useApi from "../../composables/use-api";
import {
  useFilterProperties,
  useQuery,
  useToast
} from "../../composables/use-helper";
import { GenericObject } from "../../interface/composable.interface";
import { ClientIF } from "../../interface/area.interface";

interface CreateEvent {
  client_id: number | null;
  date: Date | null;
  start_time: string;
  finish_time: string;
  status: string;
  participant: number[] | null;
}

interface DataClientIF {
  list: Array<ClientIF> | [];
  loading: boolean;
  selected: ClientIF | null;
  find: string;
  q: any;
}

interface ClientParticipantIF {
  id: number;
  name: string;
}

defineProps({
  dialog: Boolean
});

const emit = defineEmits(["close", "refetch"]);
const loading = ref<boolean>(false);
const api = new useApi();
const filter = ref<any>();
const loadingFilter = ref(false);
const clientParticipants = ref<ClientParticipantIF[]>([]);
const search = ref("");
const selectedIds = ref<number[]>([]);

const form = reactive<CreateEvent>({
  client_id: null,
  date: null,
  start_time: "",
  finish_time: "",
  status: "PENDING",
  participant: []
});

const errs = reactive<GenericObject>({
  client_id: "",
  date: "",
  start_time: "",
  finish_time: "",
  status: "",
  participant: ""
});

const client = reactive<DataClientIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    name: ""
  }
});

const getClient = (): void => {
  client.loading = true;
  const q = useQuery(client.q);
  api.get(`client${q}`).then((res) => {
    let raw: Array<ClientIF> = res.data.items;
    if (client.q.Page > 1) {
      client.list = [...client.list, ...raw];
    } else {
      client.list = raw;
    }
    client.loading = false;
  });
};

const onClientChange = () => {
  if (client.selected) {
    form.client_id = client.selected.id;
  } else {
    form.client_id = null;
  }
};

const getClientParticipants = () => {
  const client_id = form.client_id;
  if (!client_id) return;
  loadingFilter.value = true;
  api
    .get(`participant?client_id=${client_id}`)
    .then((res) => {
      clientParticipants.value = res.data.items.map((i: any) => ({
        id: i.id,
        name: i.name
      }));
    })
    .finally(() => {
      loadingFilter.value = false;
    });
};

const openFilter = () => {
  getClientParticipants();
  filter.value.openMenu();
};

const closeFilter = () => filter.value.closeMenu();

const filteredParticipants = computed(() => {
  if (!search.value) return clientParticipants.value;
  return clientParticipants.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const toggleSelect = (id: number) => {
  const idx = selectedIds.value.indexOf(id);
  if (idx >= 0) selectedIds.value.splice(idx, 1);
  else selectedIds.value.push(id);
};

const resetSelection = () => {
  selectedIds.value = [];
};

const confirmSelection = () => {
  form.participant = selectedIds.value;
  closeFilter();
};

const postData = (): void => {
  loading.value = true;

  let body = useFilterProperties(form);

  let req = {
    path: `event/create`,
    body: body
  };

  api
    .post(req)
    .then((res) => {
      useToast(res.message, "success");
      emit("close");
      emit("refetch");
      loading.value = false;
      resetForm();
    })
    .catch((err) => {
      useToast(err.message, "error");
      const requiredErr = err.errors;
      if (requiredErr) {
        for (let key in err.errors) {
          errs[key] =
            requiredErr[key].length > 1
              ? requiredErr[key].join(`\n`)
              : requiredErr[key][0];
        }
      }
      loading.value = false;
    });
};

const resetForm = () => {
  form.client_id = null;
  form.start_time = "";
  form.finish_time = "";
  form.status = "";
  form.date = null;
  form.participant = null;

  errs.client_id = "";
  errs.start_time = "";
  errs.finish_time = "";
  errs.status = "";
  errs.date = "";
  errs.participant = "";

  clientParticipants.value = [];
  client.selected = null;
  resetSelection();
};

const closeDialog = () => {
  emit("close");
  resetForm();
};

onMounted(() => {
  getClient();
});
</script>
