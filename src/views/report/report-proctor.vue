<template>
  <table-layout title="Report List">
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
            <template v-for="item in data" :key="`item-${i}`">
              <tr
                class="last:border-none border-b-[1.5px] text-[13px] hover:bg-slate-50"
              >
                <td class="py-2 px-5">
                  <p class="font-medium">
                    {{ item.event.code }}
                  </p>
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
                        dotClasses[item.status]
                      ]"
                    ></span>

                    <p>
                      {{
                        item.status.charAt(0).toUpperCase() +
                        item.status.slice(1).toLowerCase()
                      }}
                    </p>
                  </div>
                </td>

                <td class="py-2 px-4">
                  <div v-if="item.status === 'ON DUTY'" class="flex">
                    <button
                      class="active:scale-95 text-stone-500 hover:text-primary"
                    >
                      <router-link
                        :to="`/report/set-up?code=${item.event.code}`"
                      >
                        <h-icon name="pencil-square" size="18" outline
                      /></router-link>
                    </button>
                    <!-- <button
                      class="active:scale-95 hover:text-primary text-stone-500"
                    >
                      <h-icon
                        name="file-document-check-outline"
                        mode="mdi"
                        size="18"
                        outline
                      />
                    </button> -->
                  </div>
                </td>
              </tr>
            </template>
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
import { ReportIF } from "./report.interface";
import dayjs from "dayjs";
import { mainStore } from "../../store";

const SkeletonTable = defineAsyncComponent(
  () => import("../../components/skeleton-table.vue")
);

interface QueryIf {
  page: number;
  limit: number;
  code: string;
  status: string;
  proctor_id: any;
}

const api = new useApi();
const router = useRouter();
const route = useRoute();
const loading = ref<Boolean>(false);
const store = mainStore();
const total = ref<number | null>(null);
const limits: number[] = [8, 20, 50, 100];
const data = ref<ReportIF[] | []>([]);

const selectedStatusLabel = computed(() => {
  return (
    status.find((status) => status.value === query.status)?.label ||
    "All status"
  );
});

const query = reactive<QueryIf>({
  page: 1,
  limit: 8,
  code: "",
  status: "",
  proctor_id: null
});

const status = [
  { label: "All status", value: null },
  { label: "On Duty", value: "ON DUTY" },
  { label: "Review", value: "REVIEW" },
  { label: "Completed", value: "COMPLETED" }
];

const statusClasses = {
  SCHEDULED: "bg-amber-50 text-amber-700",
  DECLINED: "bg-red-50 text-red-700",
  "ON DUTY": "bg-blue-50 text-blue-700",
  REVIEW: "bg-orange-50 text-orange-700",
  COMPLETED: "bg-green-50 text-green-700"
};

const dotClasses = {
  SCHEDULED: "bg-amber-700",
  DECLINED: "bg-red-700",
  "ON DUTY": "bg-blue-700",
  REVIEW: "bg-orange-700",
  COMPLETED: "bg-green-700"
};

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
    let raw: ReportIF[] | [] = res.data.items;

    raw = raw.filter(
      (item) => item.status !== "SCHEDULED" && item.status !== "DECLINED"
    );

    raw.sort((a, b) => {
      if (a.status === "ON DUTY" && b.status !== "ON DUTY") return -1;
      if (a.status !== "ON DUTY" && b.status === "ON DUTY") return 1;

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
  "Status",
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

onMounted(() => {
  currentPage();
  getReport();
});
</script>
