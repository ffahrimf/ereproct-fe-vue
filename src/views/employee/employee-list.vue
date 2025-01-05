<template>
  <table-layout
    icon="users"
    title="Employee List"
    subtitle="Manage your employee"
  >
    <template #header-action>
      <div class="flex items-center">
        <router-link to="employee/set-up">
          <h-btn class="rounded-md px-3 py-2 flex items-center gap-3">
            <h-icon name="plus"></h-icon>
            <p>Add Employee</p>
          </h-btn>
        </router-link>
      </div>
    </template>
    <div>
      <div class="flex justify-between mb-3">
        <div></div>
        <div class="flex items-center gap-2">
          <h-search
            v-model="query.name"
            placeholder="Cari karyawan..."
            @keyup="loading = true"
            @search="getEmployee"
            class="w-[300px]"
          ></h-search>
          <h-menu-filter ref="filter">
            <template #default="{ isOpen }">
              <button
                class="px-3 py-2 rounded-lg border flex items-center gap-2 text-slate-600 hover:bg-slate-50 active:bg-slate-100"
                :class="isOpen ? 'bg-slate-50' : 'bg-white'"
              >
                <h-icon name="adjustments-horizontal" outline></h-icon>
                <p class="text-sm">Filter</p>
              </button> </template
            ><template #item>
              <div class="flex flex-col w-[55vh] text-xs rounded-xl">
                <div
                  class="flex items-center justify-between w-full rounded-t-xl bg-slate-50 p-3 border-b border-gray-200"
                >
                  <p class="font-semibold">Filter</p>
                  <button
                    @click="filter.closeMenu()"
                    class="aspect-square p-0.5 rounded-full hover:bg-gray-200 transition duration-300 ease-in-out"
                  >
                    <h-icon name="x-mark" size="15"></h-icon>
                  </button>
                </div>
                <div class="flex flex-col gap-4 p-3">
                  <h-select-filter
                    label="Status"
                    placeholder="Pilih Status"
                    :items="[
                      { label: 'Aktif', value: true },
                      { label: 'Tidak Aktif', value: false }
                    ]"
                    itemName="label"
                    itemValue="value"
                    v-model="selectedStatus"
                  >
                  </h-select-filter>
                  <h-select-filter
                    label="Company Branch"
                    placeholder="Pilih Branch"
                    :items="company_branch.list"
                    item-name="name"
                    item-value="id"
                    return-object
                    :loading="company_branch.loading"
                    v-model="company_branch.selected"
                  >
                  </h-select-filter>

                  <h-select-filter
                    label="Company Organization"
                    placeholder="Pilih Organization"
                    :items="company_organization.list"
                    item-name="name"
                    item-value="id"
                    return-object
                    :loading="company_organization.loading"
                    v-model="company_organization.selected"
                  >
                  </h-select-filter>
                  <h-select-filter
                    label="Company Title"
                    placeholder="Pilih Title"
                    :items="company_title.list"
                    item-name="name"
                    item-value="id"
                    return-object
                    :loading="company_title.loading"
                    v-model="company_title.selected"
                  >
                  </h-select-filter>
                  <h-select-filter
                    label="Company Level"
                    placeholder="Pilih Level"
                    :items="company_level.list"
                    item-name="name"
                    item-value="id"
                    return-object
                    :loading="company_level.loading"
                    v-model="company_level.selected"
                  >
                  </h-select-filter>
                </div>
                <div
                  class="flex justify-between items-center p-3 border-t border-gray-200"
                >
                  <button
                    @click="resetFilter"
                    class="px-2 py-1 rounded-lg bg-transparent font-medium border-2 border-slate-100 hover:border-slate-200 transition duration-300 ease-out active:scale-95"
                  >
                    Reset
                  </button>
                  <button
                    @click="onFilter"
                    class="p-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition duration-300 ease-out active:scale-95 text-white"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </template>
          </h-menu-filter>
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
              {{ $t(`employee.list.col.${col}`) }}
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
                <div class="flex items-center">
                  <h-avatar :src="item.thumbnailDecode" size="35"></h-avatar>

                  <div class="ml-3">
                    <p class="font-medium">
                      {{ item.name }}
                    </p>
                    <p class="text-xs whitespace-nowrap">NIK: {{ item.nik }}</p>
                  </div>
                </div>
              </td>

              <td class="py-2 px-4">
                <p class="font-medium">{{ item.company_title?.name ?? "-" }}</p>
              </td>

              <td class="py-2 pl-4">
                <p class="font-medium">
                  {{ item.company_organization?.name ?? "-" }}
                </p>
              </td>
              <td>
                <span
                  :style="{
                    backgroundColor: item.company_organization?.color
                  }"
                  class="block mx-auto w-2.5 aspect-square rounded-full"
                ></span>
              </td>

              <td class="py-2 px-4">
                <h-menu arrow>
                  <button class="px-2 py-1 bg-slate-200 text-slate-600 rounded">
                    <h-icon name="user"></h-icon>
                  </button>
                  <template #item>
                    <div class="flex items-center p-2">
                      <h-icon
                        name="envelope"
                        color="text-slate-500"
                        class="mr-2"
                        size="18"
                      ></h-icon>
                      <p class="flex-1">{{ item.email }}</p>
                      <h-icon
                        name="content-copy"
                        mode="mdi"
                        color="text-blue-500"
                        class="ml-2 cursor-pointer"
                        size="18"
                        @click="copyText(item.email, 'email')"
                      ></h-icon>
                    </div>
                    <div class="flex items-center p-2">
                      <h-icon
                        name="phone"
                        color="text-slate-500"
                        class="mr-2"
                        size="18"
                      ></h-icon>
                      <p class="flex-1">{{ item.phone_number }}</p>
                      <h-icon
                        name="content-copy"
                        mode="mdi"
                        color="text-blue-500"
                        class="ml-2 cursor-pointer"
                        size="18"
                        @click="copyText(item.phone_number, 'phone')"
                      ></h-icon>
                    </div>
                  </template>
                </h-menu>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                {{ calculateWorkPeriod(item.start_working) }} Bulan
              </td>
              <td class="py-3 px-4">
                <p
                  class="text-xs px-3 py-1.5 font-medium text-center whitespace-nowrap rounded-full"
                  :class="
                    isActive(item.end_working)
                      ? 'bg-blue-50 text-blue-500'
                      : 'bg-red-50 text-red-500'
                  "
                >
                  {{ isActive(item.end_working) ? "Aktif" : "Tidak Aktif" }}
                </p>
              </td>
              <td class="py-3 px-4">
                <h-menu arrow>
                  <template #default="{ isOpen }">
                    <button
                      class="outline-none p-1 text-slate-600 hover:bg-slate-200 bg-white border rounded"
                      :class="isOpen ? 'border-secondary' : 'border-slate-200'"
                    >
                      <h-icon name="ellipsis-vertical"></h-icon>
                    </button>
                  </template>
                  <template #item>
                    <div class="px-3">
                      <button
                        @click="onSchedule(item)"
                        class="p-2 hover:bg-blue-50 rounded flex items-center text-primary w-full"
                      >
                        <h-icon name="clock" />
                        <p class="ml-2">Jadwal</p>
                      </button>
                      <router-link :to="`/employee/set-up?uuid=${item.uuid}`">
                        <button
                          class="p-2 hover:bg-blue-50 rounded flex items-center text-primary w-full"
                        >
                          <h-icon name="pencil" />
                          <p class="ml-2">Update Data</p>
                        </button></router-link
                      >
                      <button
                        @click="onChangePassword(item)"
                        class="p-2 hover:bg-slate-50 rounded flex items-center text-primary"
                      >
                        <h-icon name="arrow-path" />
                        <p class="ml-2">Ganti Password</p>
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
    <Schedule
      :pocket="pocket"
      :dialog="dialog.schedule"
      @close="dialog.schedule = false"
      @refetch="getEmployee"
    />
    <ChangePassword
      :pocket="pocket"
      :dialog="dialog.password"
      @close="dialog.password = false"
      @refetch="getEmployee"
    />
  </table-layout>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import useApi from "../../composables/use-api";
import { useQuery, useToast } from "../../composables/use-helper";
import { EmployeeIF } from "./employee.interface";
import { useRoute, useRouter } from "vue-router";
import day from "../../plugins/day";
import tableLayout from "../../components/table-layout.vue";
import ChangePassword from "./change-password.vue";
import Schedule from "./schedule.vue";
import { mainStore } from "../../store";
import {
  getCompanyBranch,
  company_branch,
  company_organization,
  company_title,
  company_level,
  getCompanyOrganization,
  getCompanyTitle,
  getCompanyLevel
} from "./select";
const SkeletonTable = defineAsyncComponent(
  () => import("../../components/skeleton-table.vue")
);

interface QueryIf {
  page: number;
  limit: number;
  name: string;
  loading: boolean;
  status: string;
  company_id: any;
  company_branch_id: any;
  company_organization_id: any;
  company_title_id: any;
  company_level_id: any;
}

interface DialogIf {
  password: boolean;
  schedule: boolean;
}

const api = new useApi();
const router = useRouter();
const store = mainStore();
const route = useRoute();
const limits: number[] = [10, 50, 100];
const loading = ref<Boolean>(false);
const total = ref<number | null>(null);
const data = ref<EmployeeIF[] | []>([]);
const filter = ref();
const selectedStatus = ref(null);
const isOpen = ref(false);
const pocket = ref<any>(null);
const query = reactive<QueryIf>({
  page: 1,
  loading: false,
  limit: 10,
  name: "",
  status: "",
  company_id: "",
  company_branch_id: "",
  company_organization_id: "",
  company_title_id: "",
  company_level_id: ""
});

const dialog = reactive<DialogIf>({
  password: false,
  schedule: false
});

const closeMenu = () => {
  isOpen.value = false;
};

const resetFilter = () => {
  selectedStatus.value = null;
  company_branch.selected = null;
  company_organization.selected = null;
  company_title.selected = null;
  company_level.selected = null;
};

const paginate = (number: number): any => {
  query.page = number;
  getEmployee();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const onFilter = () => {
  query.page = 1;
  getEmployee();
};

const getEmployee = (): void => {
  loading.value = true;

  query.status =
    selectedStatus.value === true
      ? "active"
      : selectedStatus.value === false
      ? "inactive"
      : "";
  query.company_branch_id = company_branch.selected?.id ?? "";
  query.company_organization_id = company_organization.selected?.id ?? "";
  query.company_title_id = company_title.selected?.id ?? "";
  query.company_level_id = company_level.selected?.id ?? "";

  query.company_id = store.role === "ADMIN" ? store.company?.id ?? "" : "";

  const q = useQuery(query);

  api.get(`employee${q}`).then((res) => {
    data.value = res.data.items ?? [];
    total.value = res.data.total ?? 0;
    loading.value = false;
  });
};

const isActive = (nWorking: string | null): Boolean => {
  const nowFormatted = day().format("YYYY-MM-DD");
  const endWorkingFormatted = day(nWorking).format("YYYY-MM-DD");
  if (nWorking) {
    if (day(nowFormatted).isSameOrAfter(endWorkingFormatted, "day")) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

const calculateWorkPeriod = (startDate: Date | null): number | null => {
  if (!startDate) return null;

  const start = new Date(startDate);
  const now = new Date();

  const yearsDiff = now.getFullYear() - start.getFullYear();
  const monthsDiff = now.getMonth() - start.getMonth();

  return yearsDiff * 12 + monthsDiff;
};

const copyText = async (text: any, type: "email" | "phone") => {
  try {
    await navigator.clipboard.writeText(text);
    const successMessage =
      type === "email"
        ? "Email copied to clipboard"
        : "Phone number copied to clipboard";
    useToast(successMessage, "success");
  } catch (error) {
    const errorMessage =
      type === "email" ? "Failed to copy email" : "Failed to copy phone number";
    useToast(errorMessage, "error");
  }
};

const onChangePassword = (item: EmployeeIF) => {
  pocket.value = {
    id: item.user.id,
    name: item.name,
    nik: item.nik,
    photo: item.thumbnailDecode
  };
  dialog.password = true;
};

const onSchedule = (item: EmployeeIF) => {
  pocket.value = {
    id: item.user.id,
    name: item.name,
    nik: item.nik,
    photo: item.thumbnailDecode
  };
  dialog.schedule = true;
};

const columns: string[] = [
  "no",
  "name",
  "position",
  "department",
  "color",
  "contact",
  "workPeriod",
  "status",
  "action"
];

defineExpose({ closeMenu });

onMounted(() => {
  resetFilter();
  getEmployee();
  getCompanyBranch();
  getCompanyOrganization();
  getCompanyTitle();
  getCompanyLevel();
});
</script>
