<template>
  <!-- Tampilkan skeleton ketika loading utama -->
  <Skeleton v-if="loadingMain" wFull :col="1" :height="130" />

  <!-- Konten utama ketika tidak loading -->
  <div v-else class="bg-white rounded-md pt-3 pb-5 px-4">
    <p class="text-xl font-medium">{{ data.length }}</p>

    <div class="flex items-center justify-between">
      <p class="text-xs font-medium text-gray-500 font-dm-sans">
        Peserta Tidak Login
      </p>

      <h-menu-filter v-if="store.role === 'PROCTOR'" ref="filter">
        <template #default="">
          <button
            class="p-0.5 border border-gray-200 rounded-md"
            @click="openFilter"
          >
            <h-icon name="plus" size="15" color="text-gray-700" />
          </button>
        </template>
        <template #item>
          <div class="flex flex-col w-[40vh] text-xs rounded-xl">
            <!-- Header -->
            <div
              class="flex items-center justify-between w-full rounded-t-xl bg-stone-50 p-3 border-b border-gray-200"
            >
              <p class="font-medium text-gray-500 text-[11px]">Pilih Peserta</p>
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
    </div>

    <!-- Daftar peserta tidak login -->
    <div
      v-for="(item, i) in data"
      :key="`item-${i}`"
      class="mt-3 border border-gray-200 rounded-lg flex justify-between p-3"
    >
      <p class="text-xs">{{ item.participant.name }}</p>
      <button
        v-if="store.role === 'PROCTOR'"
        class="mr-1"
        @click="deleteParticipantNotLoggedIn(item.id)"
      >
        <h-icon name="trash" size="15" color="text-red-500" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useToast } from "../../../composables/use-helper";
import useApi from "../../../composables/use-api";
import Skeleton from "../../../components/skeleton.vue";
import { ParticipantIF } from "../../../interface/area.interface";
import { form } from "./setup";
import { mainStore } from "../../../store";

interface ParticipantNotLoggedInIF {
  id?: number | null;
  report: any;
  participant: ParticipantIF;
}

interface EventParticipantIF {
  id: number;
  name: string;
}

const loadingMain = ref(false);
const loadingFilter = ref(false);
const store = mainStore();
const data = ref<ParticipantNotLoggedInIF[]>([]);
const eventParticipants = ref<EventParticipantIF[]>([]);
const selectedIds = ref<number[]>([]);
const search = ref("");

const api = new useApi();
const filter = ref<any>();

const filteredParticipants = computed(() => {
  if (!search.value) return eventParticipants.value;
  return eventParticipants.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const getParticipantNotLoggedIn = () => {
  const report_id = form.id ?? null;
  if (!report_id) {
    data.value = [];
    return;
  }
  loadingMain.value = true;
  api
    .get(`participant-not-logged-in?report_id=${report_id}`)
    .then((res) => {
      data.value = res.data.items;
    })
    .catch(() => {
      data.value = [];
    })
    .finally(() => {
      loadingMain.value = false;
    });
};

const getEventParticipants = () => {
  const event_id = form.event_id;
  if (!event_id) return;
  loadingFilter.value = true;
  api
    .get(`event-detail?event_id=${event_id}`)
    .then((res) => {
      eventParticipants.value = res.data.items.map((i: any) => ({
        id: i.participant.id,
        name: i.participant.name
      }));
    })
    .finally(() => {
      loadingFilter.value = false;
    });
};

const toggleSelect = (id: number) => {
  const idx = selectedIds.value.indexOf(id);
  if (idx >= 0) selectedIds.value.splice(idx, 1);
  else selectedIds.value.push(id);
};

const resetSelection = () => {
  selectedIds.value = [];
};

const confirmSelection = () => {
  if (!form.id) return;
  const payload = {
    report_id: form.id,
    participant_ids: selectedIds.value,
    remarks: ""
  };
  api
    .post({ path: "participant-not-logged-in/create", body: payload })
    .then(() => {
      useToast("Berhasil menambah peserta tidak login", "success");
      getParticipantNotLoggedIn();
      closeFilter();
      resetSelection();
    })
    .catch((err) => {
      useToast(err.message, "error");
    });
};

const deleteParticipantNotLoggedIn = (id: any) => {
  loadingMain.value = true;
  api
    .post({ path: `participant-not-logged-in/delete/${id}`, body: {} })
    .then(() => {
      useToast("Berhasil menghapus peserta tidak login", "success");
      getParticipantNotLoggedIn();
    })
    .catch((err) => {
      useToast(err.message, "error");
      getParticipantNotLoggedIn();
    });
};

const openFilter = () => {
  getEventParticipants();
  filter.value.openMenu();
};
const closeFilter = () => filter.value.closeMenu();

onMounted(() => {
  getParticipantNotLoggedIn();
});
</script>
