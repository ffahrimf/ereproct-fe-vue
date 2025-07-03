<template>
  <table-layout title="Proctoring Schedule">
    <template #header-searchbar>
      <h-search
        v-model="query.code"
        placeholder="Search"
        @search="getReport"
        @keyup="loading = true"
        class="w-[350px] xl:w-[450px]"
      ></h-search>
    </template>
    <template #header-action>
      <div class="flex items-center space-x-7">
        <h-menu arrow closeOnClick>
          <template #default="{ isOpen }">
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium">{{ selectedStatusLabel }}</p>
              <h-icon
                name="chevron-down"
                mode="mdi"
                class="text-slate-500 transition-all duration-300"
                :class="isOpen ? 'rotate-180' : 'rotate-0'"
              ></h-icon>
            </div>
          </template>
          <template #item>
            <div>
              <button
                v-for="st in status"
                :key="st.value ?? 'all'"
                @click="onFilterRole(st.value)"
                class="py-2 px-4 hover:bg-slate-50 text-sm rounded flex items-center gap-2 w-full outline-none"
              >
                {{ st.label }}
              </button>
            </div>
          </template>
        </h-menu>
        <div class="flex items-center gap-2">
          <p class="text-sm">Showing</p>
          <h-select-total-data
            :items="limits"
            v-model="query.limit"
            width="w-[55px] h-[28px]"
            @change="onFilterLimit"
          ></h-select-total-data>
        </div>
      </div>
    </template>
    <div>
      <table class="w-full text-sm text-left">
        <thead class="text-xs bg-transparent border-b-[1.5px]">
          <tr class="">
            <th
              scope="col"
              v-for="(col, i) in columns"
              class="py-3.5 text-gray-500 font-medium whitespace-nowrap"
              :class="`${
                i == 0
                  ? 'rounded-l-lg px-5'
                  : i == columns.length - 1
                  ? 'rounded-r-lg px-4'
                  : 'px-4'
              }`"
            >
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="data.length && !loading">
            <tr
              v-for="(item, i) in data"
              :key="`item-${i}`"
              class="border-b-[1.5px] last:border-none text-[13px] hover:bg-slate-50"
            >
              <td class="py-2 px-5">
                <p class="font-medium">{{ item.event.code }}</p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">{{ item.event.client.name }}</p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ item.event.eventDetails.length }} Peserta
                </p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ dayjs(item.event.date).format("DD-MM-YYYY") }}
                </p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ item.event.start_time }}
                </p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ item.event.finish_time }}
                </p>
              </td>

              <td v-if="item.status === 'SCHEDULED'" class="py-2 px-5">
                <h-menu arrow closeOnClick>
                  <template #default="{ isOpen }">
                    <button
                      class="outline-none p-1 text-slate-600 hover:bg-slate-200 bg-white rounded"
                      :class="
                        isOpen ? 'ring-gray-200 ring-1' : 'border-slate-200'
                      "
                    >
                      <h-icon name="ellipsis-horizontal"></h-icon>
                    </button>
                  </template>
                  <template #item>
                    <div class="">
                      <button
                        @click="acceptSchedule(item)"
                        class="py-2 pr-3 pl-1.5 text-nowrap hover:bg-slate-50 text-green-600 text-xs font-medium rounded flex items-center space-x-1.5 w-full outline-none"
                      >
                        <h-icon name="check-circle" size="14" outline />
                        <p>Accept Schedule</p>
                      </button>
                      <button
                        @click="declineSchedule(item)"
                        class="py-2 pr-3 pl-1.5 text-nowrap hover:bg-slate-50 text-red-600 text-xs font-medium rounded flex items-center space-x-1.5 w-full outline-none"
                      >
                        <h-icon name="x-circle" size="14" outline />
                        <p>Decline Schedule</p>
                      </button>
                    </div>
                  </template>
                </h-menu>
              </td>
              <td
                v-else-if="
                  item.status === 'ON DUTY' || item.status === 'DECLINED'
                "
                class="py-2 pl-4"
              >
                <div
                  v-if="item.status === 'ON DUTY'"
                  class="inline-flex items-center gap-1.5 text-xs px-3 bg-green-50 text-green-700 py-1.5 font-medium text-center whitespace-nowrap rounded-lg"
                >
                  <span
                    class="block w-[5px] aspect-square rounded-full bg-green-700"
                  ></span>
                  <p>
                    {{ formattedStatus(item.status) }}
                  </p>
                </div>

                <h-tooltip
                  v-else-if="item.status === 'DECLINED'"
                  position="right"
                  contentClass="text-[13px] max-w-[710px]"
                  :content="item.note"
                  arrow
                >
                  <button
                    class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 font-medium text-center whitespace-nowrap rounded-lg bg-red-50 text-red-700"
                  >
                    <span class="relative flex size-[5px]">
                      <span
                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"
                      ></span>
                      <span
                        class="relative inline-flex size-[5px] rounded-full bg-red-700"
                      ></span>
                    </span>
                    <p>{{ formattedStatus(item.status) }}</p>
                  </button>
                </h-tooltip>
              </td>
            </tr>
          </template>
          <template v-if="loading">
            <SkeletonTable :col="columns.length" />
          </template>
        </tbody>
      </table>
    </div>

    <template #footer>
      <div class="flex justify-center" v-if="data.length">
        <vue-awesome-paginate
          :total-items="total"
          :items-per-page="query.limit"
          :max-pages-shown="5"
          v-model="query.page"
          @click="paginate"
        >
          <template #prev-button>
            <div class="flex justify-center">
              <h-icon name="chevron-left" mode="mdi"></h-icon>
            </div>
          </template>
          <template #next-button>
            <div class="flex justify-center">
              <h-icon name="chevron-right" mode="mdi"></h-icon>
            </div>
          </template>
        </vue-awesome-paginate>
      </div>
    </template>
    <DeclineSchedule
      :pocket="pocket"
      :dialog="dialog.decline"
      @close="dialog.decline = false"
      @refetch="getReport"
    />
  </table-layout>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import TableLayout from "../../components/table-layout.vue";
import useApi from "../../composables/use-api";
import DeclineSchedule from "./decline-schedule.vue";
import { useRoute, useRouter } from "vue-router";
import {
  useFilterProperties,
  useQuery,
  useToast
} from "../../composables/use-helper";
import { ReportIF } from "../report/report.interface";
import dayjs from "dayjs";
import { mainStore } from "../../store";

const SkeletonTable = defineAsyncComponent(
  () => import("../../components/skeleton-table.vue")
);

interface DialogIf {
  decline: boolean;
}

interface QueryIf {
  page: number;
  limit: number;
  code: string;
  status: string;
  proctor_id: any;
}

interface AcceptSchedule {
  id: number | null;
  event_id: number | null;
  proctor_id: number | null;
  // number_of_participants: number;
  number_of_participants_only_logged_in: number;
  number_of_participants_logged_in: number;
  // number_of_participants_not_logged_in: number;
  number_of_participants_completed: number;
  number_of_participants_not_completed: number;
  status: string | null;
}

const api = new useApi();
const router = useRouter();
const route = useRoute();
const loading = ref<Boolean>(false);
const store = mainStore();
const total = ref<number | null>(null);
const pocket = ref<any>(null);
const data = ref<ReportIF[] | []>([]);

const form = reactive<AcceptSchedule>({
  id: null,
  event_id: null,
  proctor_id: null,
  // number_of_participants: 0,
  number_of_participants_logged_in: 0,
  number_of_participants_only_logged_in: 0,
  // number_of_participants_not_logged_in: 0,
  number_of_participants_completed: 0,
  number_of_participants_not_completed: 0,
  status: null
});

const dialog = reactive<DialogIf>({
  decline: false
});

const selectedStatusLabel = computed(() => {
  return (
    status.find((status) => status.value === query.status)?.label ||
    "All status"
  );
});

const limits: number[] = [8, 20, 50, 100];
const query = reactive<QueryIf>({
  page: 1,
  limit: 8,
  code: "",
  status: "",
  proctor_id: null
});

const status = [
  { label: "All status", value: null },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Declined", value: "DECLINED" }
];

const paginate = (number: number): any => {
  query.page = number;
  getReport();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const onFilterRole = (statusValue: any | null) => {
  query.status = statusValue;
  query.page = 1;
  getReport();
};

const formattedStatus = computed(() => (status: string) => {
  return status
    .toLowerCase()
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
});

const onFilterLimit = () => {
  query.page = 1;
  getReport();
};

const getReport = async (): Promise<void> => {
  loading.value = true;

  if (store.role === "PROCTOR") {
    const proctorResponse = await api.get(`proctor?user_id=${store.guid}`);
    const proctorData = proctorResponse.data.items;
    if (proctorData && proctorData.length > 0) {
      query.proctor_id = proctorData[0].id;
    } else {
      query.proctor_id = null;
    }
  }

  const q = useQuery(query);
  api.get(`report${q}`).then((res) => {
    let raw: ReportIF[] = res.data.items;

    raw = raw.filter(
      (item) => item.status === "SCHEDULED" || item.status === "DECLINED"
    );

    // Sorting agar "SCHEDULED" di atas dan descending berdasarkan event date
    raw.sort((a, b) => {
      if (a.status === "SCHEDULED" && b.status !== "SCHEDULED") return -1;
      if (a.status !== "SCHEDULED" && b.status === "SCHEDULED") return 1;

      // Descending berdasarkan tanggal event
      return dayjs(b.event.date).valueOf() - dayjs(a.event.date).valueOf();
    });

    data.value = raw;
    total.value = res.data.total;
    loading.value = false;
  });
};

const columns: string[] = [
  "Kode",
  "Klien",
  "Jumlah Peserta",
  "Tanggal",
  "Mulai",
  "Selesai",
  "Aksi"
];

const currentPage = () => {
  const queryPage = route.query?.page;
  if (queryPage) {
    query.page = Array.isArray(queryPage)
      ? parseInt(queryPage[0] ?? "1")
      : parseInt(queryPage) ?? 1;
  }
};

const acceptSchedule = (item: ReportIF) => {
  loading.value = true;

  if (item) {
    form.id = item.id ?? null;
    form.event_id = item.event.id;
    form.proctor_id = item.proctor.id;
    // form.number_of_participants = item.number_of_participants;
    form.number_of_participants_logged_in =
      item.number_of_participants_logged_in;
    form.number_of_participants_only_logged_in =
      item.number_of_participants_only_logged_in;
    // form.number_of_participants_not_logged_in =
    // item.number_of_participants_not_logged_in;
    form.number_of_participants_completed =
      item.number_of_participants_completed;
    form.number_of_participants_not_completed =
      item.number_of_participants_not_completed;
    form.status = "ON DUTY";
  }

  let body = useFilterProperties(form);

  const req = {
    path: `report/update`,
    body: body
  };

  api
    .post(req)
    .then(() => {
      useToast("Accept Success", "success");
      getReport();
      loading.value = false;
    })
    .catch((err) => {
      useToast(err.message, "error");
      loading.value = false;
    });
};

const declineSchedule = (item: ReportIF) => {
  pocket.value = {
    value: item,
    path: `report/update`
  };
  dialog.decline = true;
};

onMounted(() => {
  currentPage();
  getReport();
});
</script>
