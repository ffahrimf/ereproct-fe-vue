<template>
  <header>
    <div class="grid grid-cols-2 mb-3 px-5">
      <div>
        <div class="flex items-center gap-1">
          <h-icon name="handshake" mode="mdi" class="text-primary"></h-icon>
          <h1 class="text-lg">Company Level</h1>
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <h-search
          v-model="query.name"
          placeholder="Cari..."
          @search="getCompanyLevel"
          class="w-[300px]"
        ></h-search>
        <h-btn
          class="rounded-md px-3 py-2 flex items-center gap-3"
          @click="dialog.create = true"
        >
          <h-icon name="plus"></h-icon>
          <p>Tambah Baru</p>
        </h-btn>
      </div>
    </div>
  </header>
  <div>
    <table class="w-full text-sm text-left">
      <tbody>
        <template v-if="data.length && !loading">
          <tr
            v-for="(item, i) in data"
            :key="`item-${i}`"
            class="border-b border-gray-100 last:border-none hover:bg-slate-50"
          >
            <td class="py-2 px-5">
              <div class="flex items-center gap-3">
                <h-icon
                  name="handshake"
                  mode="mdi"
                  :size="17"
                  class="text-secondary bg-orange-100 p-0.5 rounded-sm"
                ></h-icon>
                <p class="font-medium">{{ item.name }}</p>
              </div>
            </td>
            <td class="py-2 px-4">
              <div class="flex items-center gap-2 justify-end px-3 text-primary">
                <h-menu arrow>
                  <button
                    class="px-2 py-1 font-medium bg-blue-100 hover:bg-blue-200 text-blue-500 rounded"
                  >
                    Description
                  </button>
                  <template #item>
                    <p class="font-medium max-w-60">{{ item.description }}</p>
                  </template>
                </h-menu>
                <button
                  @click="onUpdate(item)"
                  class="hover:bg-slate-100 p-1 rounded-md"
                >
                  <h-icon name="pencil"></h-icon>
                </button>
                <button
                  @click="onDelete(item)"
                  class="hover:bg-slate-100 p-1 rounded-md"
                >
                  <h-icon name="trash"></h-icon>
                </button>
              </div>
            </td>
          </tr>
        </template>
        <template v-if="loading">
          <SkeletonTable :col="columns.length" />
        </template>
      </tbody>
    </table>
  </div>
  <footer>
    <div class="flex justify-between items-center mt-5 gap-5 px-5" v-if="data.length">
      <div class="flex items-center gap-2">
        <p class="text-sm">Show</p>
        <h-select
          class="flex items-center"
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
  </footer>
  <CreateCompanyLevel
    :pocket="pocket"
    :dialog="dialog.create"
    @close="dialog.create = false"
    @refetch="getCompanyLevel"
  />
  <DialogDelete
    :pocket="pocket"
    v-model="dialog.delete"
    @close="dialog.delete = false"
    @refetch="getCompanyLevel"
  />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import useApi from "../../../composables/use-api";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "../../../composables/use-helper";

import { CompanyLevelIF } from "./company-level.interface";
import DialogDelete from "../../../components/dialog-delete.vue";
import CreateCompanyLevel from "./create-company-level.vue";

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

const total = ref<number | null>(null);
const data = ref<CompanyLevelIF[] | []>([]);

const paginate = (number: number): any => {
  query.page = number;
  getCompanyLevel();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const onFilter = () => {
  query.page = 1;
  getCompanyLevel();
};

const getCompanyLevel = (): void => {
  loading.value = true;
  const q = useQuery(query);
  api.get(`company-level${q}`).then((res) => {
    data.value = res.data.items;
    total.value = res.data.total;
    loading.value = false;
  });
};

const columns: string[] = ["No.", "Name", "Description", ""];

const pocket = ref<any>(null);

const onUpdate = (item: CompanyLevelIF) => {
  pocket.value = {
    id: item.id,
    company_id: item.company,
    name: item.name,
    description: item.description
  };
  dialog.create = true;
};

const onDelete = (item: CompanyLevelIF) => {
  pocket.value = {
    path: `company-level/delete/${item.id}`
  };
  dialog.delete = true;
};

onMounted(() => {
  getCompanyLevel();
});
</script>
