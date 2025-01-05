<template>
  <table-layout
    icon="user"
    title="Attendance Location Setting"
    subtitle="Manage your attendance location settings"
  >
    <template #header-action>
      <div class="flex items-center">
        <h-btn
          class="rounded-md px-3 py-2 flex items-center gap-3"
          @click="dialog.create = true"
        >
          <h-icon name="plus"></h-icon>
          <p>Add Location Setting<i class="fas fa-shipping-fast"></i></p>
        </h-btn>
      </div>
    </template>
    <div>
      <div class="flex justify-between mb-3">
        <div></div>
        <div class="flex items-center gap-2">
          <h-search
            v-model="query.name"
            @keyup="loading = true"
            placeholder="Cari Location Setting..."
            @search="getAttendanceLocationSetting"
            class="w-[300px]"
          ></h-search>
          <h-menu>
            <button
              class="px-3 py-2 bg-white rounded-lg border flex items-center gap-2 text-slate-600 hover:bg-slate-50 active:bg-slate-100"
            >
              <h-icon name="funnel" outline></h-icon>
              <p class="text-sm">Filter</p>
            </button>
          </h-menu>
        </div>
      </div>
      <table class="w-full text-sm text-left">
        <thead class="text-xs text-gray-500 bg-[#F3F3FA]">
          <tr class="">
            <th
              scope="col"
              v-for="(col, i) in columns"
              class="py-3 whitespace-nowrap"
              :class="`${
                i == 0
                  ? 'rounded-l-lg px-3'
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
              class="border-b border-gray-100 last:border-none hover:bg-slate-50"
            >
              <td class="py-2 px-3">
                {{ i + 1 + (query.page - 1) * query.limit }}
              </td>
              <td class="py-2 px-4">
                <p class="font-medium">
                  {{ item.company_branch?.name ?? "Pusat" }}
                </p>
              </td>
              <td class="py-2 px-4">
                <p class="font-medium">
                  {{ item.longitude }}
                </p>
              </td>
              <td class="py-2 px-4">
                <p class="font-medium">
                  {{ item.latitude }}
                </p>
              </td>
              <td class="py-2 px-4">
                <p class="font-medium">
                  {{ item.radius }}
                </p>
              </td>
              <td class="py-3 px-4">
                <p
                  class="text-xs px-3 py-1.5 font-medium text-center whitespace-nowrap rounded-full"
                  :class="
                    item.status
                      ? 'bg-blue-50 text-blue-500'
                      : 'bg-red-50 text-red-500'
                  "
                >
                  {{ item.status ? "Aktif" : "Tidak Aktif" }}
                </p>
              </td>

              <td class="py-2 px-4">
                <h-menu arrow closeOnClick>
                  <template #default="{ isOpen }">
                    <button
                      class="outline-none p-1 text-slate-600 hover:bg-slate-200 bg-white border rounded"
                      :class="
                        isOpen ? 'ring-blue-100 ring-2' : 'border-slate-200'
                      "
                    >
                      <h-icon name="ellipsis-vertical"></h-icon>
                    </button>
                  </template>
                  <template #item>
                    <div>
                      <button
                        @click="onUpdate(item)"
                        class="py-2 px-3 hover:bg-blue-50 rounded flex items-center gap-2 text-primary w-full outline-none"
                      >
                        <h-icon name="pencil" size="18" />
                        <p>Update</p>
                      </button>
                      <button
                        class="py-2 px-3 hover:bg-red-50 rounded flex items-center gap-2 text-red-500 w-full outline-none"
                        @click="onDelete(item)"
                      >
                        <h-icon name="trash" size="18" />
                        <p>Delete Data</p>
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
      <div class="flex justify-between" v-if="data.length">
        <div class="flex items-center gap-2">
          <p class="text-sm">Show</p>
          <h-select
            :items="limits"
            v-model="query.limit"
            width="w-[70px]"
            @change="onFilter"
          ></h-select>
          <p class="text-sm">Data</p>
        </div>
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
    <CreateAttendanceLocationSetting
      :pocket="pocket"
      :dialog="dialog.create"
      @close="dialog.create = false"
      @refetch="getAttendanceLocationSetting"
    />
    <DialogDelete
      :pocket="pocket"
      v-model="dialog.delete"
      @close="dialog.delete = false"
      @refetch="getAttendanceLocationSetting"
    />
  </table-layout>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import useApi from "../../../composables/use-api";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "../../../composables/use-helper";
import tableLayout from "../../../components/table-layout.vue";
import { AttendanceLocationSettingIF } from "./attendance-location-setting.interface"; 
import DialogDelete from "../../../components/dialog-delete.vue";
import CreateAttendanceLocationSetting from "./create-attendance-location-setting.vue";
import { mainStore } from "../../../store";

const SkeletonTable = defineAsyncComponent(
  () => import("../../../components/skeleton-table.vue")
);

interface QueryIf {
  page: number;
  limit: number;
  name: string;
  loading: boolean;
}

interface DialogIf {
  create: boolean;
  delete: boolean;
}

const api = new useApi();
const router = useRouter();
const route = useRoute();
const loading = ref<Boolean>(false);
const limits: number[] = [10, 50, 100];
const query = reactive<QueryIf>({
  page: 1,
  loading: false,
  limit: 10,
  name: ""
});

const dialog = reactive<DialogIf>({
  create: false,
  delete: false
});

const store = mainStore();

const total = ref<number | null>(null);

const data = ref<AttendanceLocationSettingIF[] | []>([]);

const paginate = (number: number): any => {
  query.page = number;
  getAttendanceLocationSetting();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const onFilter = () => {
  query.page = 1;
  getAttendanceLocationSetting();
};

const getAttendanceLocationSetting = (): void => {
  loading.value = true;
  const companyId = store.company ? parseInt(store.company.id) : null;
  const q = useQuery({
    ...query,
    company_id: companyId,
  });
  api.get(`attendance-location-setting${q}`).then((res) => {
    const raw: AttendanceLocationSettingIF[] | [] = res.data.items;
    data.value = raw;
    total.value = res.data.total;
    loading.value = false;
  });
};

const columns: string[] = [
  "No.",
  "Cabang",
  "Longitude",
  "Latitude  ",
  "Radius",
  "Status",
  ""
];

const pocket = ref<any>(null);

const onUpdate = (item: AttendanceLocationSettingIF) => {
  pocket.value = {
    id: item.id,
    company_branch:item.company_branch,
    longitude: item.longitude,
    latitude: item.latitude,
    radius: item.radius,
    status: item.status
  };

  dialog.create = true;
};

const onDelete = (item: AttendanceLocationSettingIF) => {
  pocket.value = {
    path: `attendance-location-setting/delete/${item.id}`
  };
  dialog.delete = true;
};

onMounted(() => {
  getAttendanceLocationSetting();
});
</script>
