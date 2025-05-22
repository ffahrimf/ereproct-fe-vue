<template>
  <table-layout title="Research List">
    <template #header-searchbar>
      <h-search
        v-model="query.name"
        placeholder="Search"
        @search="getResearch"
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

        <h-btn
          @click="dialog.create = true"
          class="rounded-md px-3 py-2 flex items-center gap-3"
        >
          <h-icon name="plus"></h-icon>
          <p class="">Tambah Research</p>
        </h-btn>
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
              <td class="py-2 pl-5">
                <div class="flex items-center">
                  <h-avatar :src="item.thumbnailDecode" size="30"></h-avatar>
                  <p class="font-medium ml-3">
                    {{ item.name }}
                  </p>
                </div>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ item.user.username }}
                </p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ item.email }}
                </p>
              </td>
              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ item.gender }}
                </p>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex items-center gap-1.5 text-xs px-3 py-1.5 font-medium text-center whitespace-nowrap rounded-lg"
                    :class="
                      item.status
                        ? 'bg-green-50 text-green-700'
                        : 'bg-orange-50 text-orange-700'
                    "
                  >
                    <span
                      class="block w-[5px] aspect-square rounded-full"
                      :class="item.status ? 'bg-green-700' : 'bg-orange-700'"
                    ></span>
                    <p>
                      {{ item.status ? "Active" : "Inactive" }}
                    </p>
                  </div>
                  <h-menu arrow closeOnClick>
                    <template #default>
                      <h-icon name="chevron-down" size="15"></h-icon>
                    </template>
                    <template #item>
                      <div>
                        <button
                          :refetch="getResearch"
                          class="py-1 px-3 hover:bg-slate-50 text-xs rounded flex items-center gap-2 w-full outline-none"
                          @click="changeStatus(item)"
                        >
                          {{ item.status ? "Non-Aktifkan" : "Aktifkan" }}
                        </button>
                      </div>
                    </template>
                  </h-menu>
                </div>
              </td>
              <td class="py-2 px-4">
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
                        class="py-2 px-3 hover:bg-blue-50 rounded flex items-center gap-2 text-primary w-full outline-none"
                      >
                        <h-icon name="pencil" size="18" />
                        <p class="text-nowrap">Update</p>
                      </button>
                      <button
                        @click="onChangePassword(item)"
                        class="py-2 px-3 hover:bg-slate-100 rounded flex items-center gap-2 text-primary outline-none"
                      >
                        <h-icon name="arrow-path" size="18" />
                        <p class="text-nowrap">Ganti Password</p>
                      </button>
                      <button
                        class="py-2 px-3 hover:bg-red-50 rounded flex items-center gap-2 text-red-500 w-full outline-none"
                        @click="onDelete(item)"
                      >
                        <h-icon name="trash" size="18" />
                        <p class="text-nowrap">Delete Data</p>
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
    <CreateResearch
      :dialog="dialog.create"
      @close="dialog.create = false"
      @refetch="getResearch"
    />
    <ChangePassword
      :pocket="pocket"
      :dialog="dialog.password"
      @close="dialog.password = false"
      @refetch="getResearch"
    />
    <DialogDelete
      :pocket="pocket"
      v-model="dialog.delete"
      @close="dialog.delete = false"
      @refetch="getResearch"
    />
  </table-layout>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import TableLayout from "../../../components/table-layout.vue";
import useApi from "../../../composables/use-api";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useToast } from "../../../composables/use-helper";
import { ResearchIF } from "./research.interface";
import DialogDelete from "../../../components/dialog-delete.vue";
import CreateResearch from "./create-research.vue";
import ChangePassword from "../../user/change-password.vue";

const SkeletonTable = defineAsyncComponent(
  () => import("../../../components/skeleton-table.vue")
);

interface queryIf {
  page: number;
  limit: number;
  name: string;
  status: any;
}

const api = new useApi();
const router = useRouter();
const pocket = ref<any>(null);
const route = useRoute();
const loading = ref<Boolean>(false);
const total = ref<number | null>(null);
const data = ref<ResearchIF[] | []>([]);

const selectedStatusLabel = computed(() => {
  return (
    status.find((status) => status.value === query.status)?.label ||
    "All status"
  );
});

const limits: number[] = [8, 20, 50, 100];
const query = reactive<queryIf>({
  page: 1,
  limit: 8,
  name: "",
  status: null
});

const status = [
  { label: "All status", value: null },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" }
];

const paginate = (number: number): any => {
  query.page = number;
  getResearch();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const onFilterRole = (statusValue: any | null) => {
  query.status = statusValue;
  query.page = 1;
  getResearch();
};

const onFilterLimit = () => {
  query.page = 1;
  getResearch();
};

const getResearch = (): void => {
  loading.value = true;
  const q = useQuery(query);

  api.get(`research${q}`).then((res) => {
    const raw: ResearchIF[] | [] = res.data.items;
    data.value = raw;
    total.value = res.data.total;
    loading.value = false;
  });
};

const changeStatus = (item: ResearchIF) => {
  loading.value = true;
  const body = {
    ...item,
    status: !item.status
  };
  let req = {
    path: `research/update`,
    body: body
  };
  api
    .post(req)
    .then(() => {
      useToast(`Status berhasil diubah`, "success");
      getResearch();
    })
    .catch((err) => {
      useToast(err.message, "error");
      loading.value = false;
    });
};

const columns: string[] = [
  "Nama",
  "Username",
  "Email",
  "Jenis Kelamin",
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

interface DialogIf {
  create: boolean;
  password: boolean;
  delete: boolean;
}

const dialog = reactive<DialogIf>({
  create: false,
  password: false,
  delete: false
});

const onDelete = (item: ResearchIF) => {
  pocket.value = {
    path: `research/delete/${item.id}`
  };

  dialog.delete = true;
};

const onChangePassword = (item: ResearchIF) => {
  pocket.value = {
    id: item.user.id
  };
  dialog.password = true;
};

onMounted(() => {
  currentPage();
  getResearch();
});
</script>
