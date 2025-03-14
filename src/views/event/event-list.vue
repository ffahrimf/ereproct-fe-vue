<template>
  <table-layout title="Event List">
    <template #header-searchbar>
      <h-search
        v-model="query.code"
        placeholder="Search"
        @search="getEvent"
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
              <td class="py-2 px-4">
                <p class="font-medium">{{ item.code }}</p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">{{ item.client.name }}</p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ item.eventDetails.length }} Peserta
                </p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ dayjs(item.date).format("DD-MM-YYYY") }}
                </p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ item.start_time }}
                </p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ item.finish_time }}
                </p>
              </td>
              <td class="py-2 pl-4">
                <div
                  :class="[
                    'inline-flex items-center gap-1.5 text-xs px-3 py-1.5 font-medium text-center whitespace-nowrap rounded-lg',
                    statusClasses[item.status] || 'bg-gray-50 text-gray-700'
                  ]"
                >
                  <span
                    :class="[
                      'block w-[5px] aspect-square rounded-full',
                      dotClasses[item.status] || 'bg-gray-700'
                    ]"
                  ></span>
                  <p class="">
                    {{
                      item.status.charAt(0).toUpperCase() +
                      item.status.slice(1).toLowerCase()
                    }}
                  </p>
                </div>
              </td>

              <td v-if="item.status === 'PENDING'" class="py-2 pr-4">
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
                    <div>
                      <button
                        class="py-2 px-3 hover:bg-slate-50 text-gray-700 text-xs font-medium rounded flex items-center gap-2 w-full outline-none"
                      >
                        <p>Assign Proctoring</p>
                      </button>
                    </div>
                  </template>
                </h-menu>
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
  </table-layout>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import TableLayout from "../../components/table-layout.vue";
import useApi from "../../composables/use-api";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "../../composables/use-helper";
import { EventIF } from "./event.interface";
import dayjs from "dayjs";

const SkeletonTable = defineAsyncComponent(
  () => import("../../components/skeleton-table.vue")
);

interface QueryIf {
  page: number;
  limit: number;
  code: string;
  status: string;
}

const api = new useApi();
const router = useRouter();
const route = useRoute();
const loading = ref<Boolean>(false);
const total = ref<number | null>(null);
const data = ref<EventIF[] | []>([]);

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
  status: ""
});

const status = [
  { label: "All status", value: null },
  { label: "Pending", value: "PENDING" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Completed", value: "SUBMITTED" }
];

const statusClasses = {
  PENDING: "bg-amber-50 text-amber-700",
  SCHEDULED: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-green-50 text-green-700"
};

const dotClasses = {
  PENDING: "bg-amber-700",
  SCHEDULED: "bg-blue-700",
  COMPLETED: "bg-green-700"
};

const paginate = (number: number): any => {
  query.page = number;
  getEvent();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const onFilterRole = (statusValue: any | null) => {
  query.status = statusValue;
  query.page = 1;
  getEvent();
};

const onFilterLimit = () => {
  query.page = 1;
  getEvent();
};

const getEvent = (): void => {
  loading.value = true;
  const q = useQuery(query);

  api.get(`event${q}`).then((res) => {
    const raw: EventIF[] | [] = res.data.items;
    data.value = raw;
    total.value = res.data.total;
    loading.value = false;
  });
};

const columns: string[] = [
  "Code",
  "Client",
  "Participants",
  "Date",
  "Start",
  "Status",
  "Finish"
];

const currentPage = () => {
  const queryPage = route.query?.page;
  if (queryPage) {
    query.page = Array.isArray(queryPage)
      ? parseInt(queryPage[0] ?? "1")
      : parseInt(queryPage) ?? 1;
  }
};

onMounted(() => {
  currentPage();
  getEvent();
});
</script>
