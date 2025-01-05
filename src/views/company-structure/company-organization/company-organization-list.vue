<template>
  <header>
    <div class="grid grid-cols-2 mb-3 px-5">
      <div>
        <div class="flex items-center gap-1">
          <h-icon name="graph" mode="mdi" class="text-primary"></h-icon>
          <h1 class="text-lg">Company Organization</h1>
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <h-search
          v-model="query.name"
          placeholder="Cari..."
          @search="getCompanyOrganization"
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
                <span
            :style="{ backgroundColor: item.color }"
            class="inline-block w-4 h-4 rounded-full border border-gray-200"
          ></span>
                <p class="font-medium">
                  {{ item.name }}
                </p>
              </div>
            </td>
            <td class="py-2 px-4">
              <div
                class="flex items-center gap-2 justify-end px-3 text-primary"
              >
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
    <div
      class="flex justify-between items-center mt-5 gap-5 px-5"
      v-if="data.length"
    >
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
  <CreateCompanyOrganization
    :pocket="pocket"
    :dialog="dialog.create"
    @close="dialog.create = false"
    @refetch="getCompanyOrganization"
  />
  <DialogDelete
    :pocket="pocket"
    v-model="dialog.delete"
    @close="dialog.delete = false"
    @refetch="getCompanyOrganization"
  />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import useApi from "../../../composables/use-api";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "../../../composables/use-helper";

import { CompanyOrganizationIF } from "./company-organization.interface";
import DialogDelete from "../../../components/dialog-delete.vue";
import CreateCompanyOrganization from "./create-company-organization.vue";

const SkeletonTable = defineAsyncComponent(
  () => import("../../../components/skeleton-table.vue")
);

interface QueryIf {
  page: number;
  limit: number;
  name: string;
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
  limit: 10,
  name: ""
});

const dialog = reactive<DialogIf>({
  create: false,
  delete: false
});

const total = ref<number | null>(null);

const data = ref<CompanyOrganizationIF[] | []>([]);

const paginate = (number: number): any => {
  query.page = number;
  getCompanyOrganization();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const onFilter = () => {
  query.page = 1;
  getCompanyOrganization();
};

const getCompanyOrganization = (): void => {
  loading.value = true;
  const q = useQuery(query);
  api.get(`company-organization${q}`).then((res) => {
    const raw: CompanyOrganizationIF[] | [] = res.data.items;
    data.value = raw;
    total.value = res.data.total;
    loading.value = false;

    if (!data.value.length && query.page > 1) {
      query.page = 1;
      getCompanyOrganization();
    }
  });
};


const columns: string[] = ["No.", "Name", "Description", ""];

const pocket = ref<any>(null);

const onUpdate = (item: CompanyOrganizationIF) => {
  pocket.value = {
    id: item.id,
    company_id: item.company,
    name: item.name,
    description: item.description
  };
  dialog.create = true;
};

const onDelete = (item: CompanyOrganizationIF) => {
  pocket.value = {
    path: `company-organization/delete/${item.id}`
  };
  dialog.delete = true;
};

onMounted(() => {
  getCompanyOrganization();
});
</script>
