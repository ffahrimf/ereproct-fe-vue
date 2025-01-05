<template>
  <table-layout icon="briefcase" title="Company List" subtitle="Manage Company">
    <template #header-action>
      <div class="flex items-center">
        <h-btn
          class="rounded-md px-3 py-2 flex items-center gap-3"
          @click="dialog.create = true"
        >
          <h-icon name="plus"></h-icon>
          <p>Add Company</p>
        </h-btn>
      </div>
    </template>
    <div>
      <div class="flex justify-between mb-3">
        <div></div>
        <div class="flex items-center gap-2">
          <h-search
            v-model="query.name"
            placeholder="Cari Perusahaan..."
            @search="getCompany"
            @keyup="loading = true"
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

              <td class="py-2 px-6">
                <p class="font-medium whitespace-nowrap">
                  {{ item.name }}
                </p>
              </td>

              <td class="py-2 px-4">
                <p class="font-medium">
                  {{ item.code ?? "-" }}
                </p>
              </td>

              <td class="py-2 px-6">
                <p class="font-medium">
                  {{ item.email }}
                </p>
              </td>

              <td class="py-2 px-6">
                <p class="font-medium">
                  {{ item.phone_no }}
                </p>
              </td>

              <!-- <td class="py-2 px-6">
                <p class="font-medium">
                  {{ item.website }}
                </p>
              </td> -->

              <td class="py-2 px-6">
                <p class="font-medium whitespace-nowrap">
                  {{ item.province?.name }}
                </p>
              </td>

              <td class="py-2 px-6">
                <p class="font-medium">
                  {{ item.city?.name }}
                </p>
              </td>

              <!-- <td class="py-2 px-10">
                <p class="font-medium">
                  {{ item.address }}
                </p>
              </td>

              <td class="py-2 px-6">
                <p class="font-medium">
                  {{ item.post_code }}
                </p>
              </td> -->

              <td class="py-2 px-6">
                <div v-if="item.logo_decode">
                  <img
                    :src="item.logo_decode"
                    alt="Logo"
                    class="h-8 w-8 object-contain"
                  />
                </div>
                <div v-else>-</div>
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
                        class="py-2 px-3 hover:bg-slate-100 rounded flex items-center gap-2 text-black-500 w-full outline-none"
                      >
                        <h-icon name="pencil" size="18"/>
                        <p>Update Data</p>
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
      <div class="flex justify-end" v-if="data.length">
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
    <CreateCompany
      :dialog="dialog.create"
      :pocket="pocket"
      :is-update-mode="isUpdateMode"
      @close="closeDialog"
      @refetch="getCompany"
    />
    <DialogDelete
      :pocket="pocket"
      v-model="dialog.delete"
      @close="dialog.delete = false"
      @refetch="getCompany"
    />
  </table-layout>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import tableLayout from "../../components/table-layout.vue";
import useApi from "../../composables/use-api";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { CompanyIF } from "./company.interface";
import { useQuery } from "../../composables/use-helper";
import DialogDelete from "../../components/dialog-delete.vue";

import CreateCompany from "./create-company.vue";

const SkeletonTable = defineAsyncComponent(
  () => import("../../components/skeleton-table.vue")
);

interface QueryIF {
  page: number;
  limit: number;
  name: string;
}

interface DialogIF {
  create: boolean;
  delete: boolean;
}

const api = new useApi();
const router = useRouter();
const route = useRoute();
const loading = ref<Boolean>(false);
const query = reactive<QueryIF>({
  page: 1,
  limit: 10,
  name: ""
});

const dialog = reactive<DialogIF>({
  create: false,
  delete: false
});

const closeDialog = () => {
  dialog.create = false;
  isUpdateMode.value = false;
};

const total = ref<number | null>(null);

const data = ref<CompanyIF[] | []>([]);

const isUpdateMode = ref(false);

const paginate = (number: number): any => {
  query.page = number;
  getCompany();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const getCompany = (): void => {
  loading.value = true;
  const q = useQuery(query);
  api.get(`company${q}`).then((res) => {
    const raw: CompanyIF[] | [] = res.data.items;
    if (raw.length) {
      data.value = raw;
    }
    total.value = res.data.total;
    loading.value = false;
  });
};


const columns: string[] = [
  "No.",
  "Name",
  "Code",
  "Email",
  "No.Telepon",
  "Provinsi",
  "Kota",
  "Logo"
];

const pocket = ref<any>(null);

const onUpdate = (item: CompanyIF) => {
  pocket.value = {
    id: item.id,
    name: item.name,
    code: item.code,
    email: item.email,
    phone_no: item.phone_no,
    website: item.website,
    province: item.province,
    city: item.city,
    address: item.address,
    post_code: item.post_code,
    logo: item.logo,
    logo_decode: item.logo_decode,
  };
  dialog.create = true;
  isUpdateMode.value = true;
};

const onDelete = (item: CompanyIF) => {
  pocket.value = {
    path: `company/delete/${item.id}`
  };
  console.log(item.id);
  dialog.delete = true;
};

onMounted(() => {
  getCompany();
});
</script> 
