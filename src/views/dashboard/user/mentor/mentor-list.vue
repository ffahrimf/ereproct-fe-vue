<template>
  <table-layout icon="user" title="Mentor List" subtitle="Manage your Mentor">
    <template #header-action>
      <div class="flex items-center">
        <h-btn
          class="rounded-md px-3 py-2 flex items-center gap-3"
          @click="dialog.create = true"
        >
          <h-icon name="plus"></h-icon>
          <p>Add Mentor</p>
        </h-btn>
      </div>
    </template>
    <div>
      <div class="flex justify-between mb-3">
        <div></div>
        <div class="flex items-center gap-2">
          <h-search
            v-model="query.name"
            placeholder="Cari mentor..."
            @search="getMentor"
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
              <td class="py-2 px-4">
                <p class="font-medium">
                  {{ item.name }}
                </p>
              </td>

              <td class="py-2 px-6">
                <p class="font-medium">
                  {{ item.email }}
                </p>
              </td>
              <td class="py-2 px-4 whitespace-nowrap">
                <p class="font-medium">
                  {{ item.username ?? "-" }}
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
                        class="py-2 px-3 hover:bg-blue-50 rounded flex items-center gap-2 text-primary w-full outline-none"
                      >
                        <h-icon name="pencil" size="18" />
                        <p>Update</p>
                      </button>

                      <button
                        class="py-2 px-3 hover:bg-slate-100 rounded flex items-center gap-2 text-primary outline-none"
                      >
                        <h-icon name="arrow-path" size="18" />
                        <p>Ganti Password</p>
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
    <CreateMentor
      :dialog="dialog.create"
      @close="dialog.create = false"
      @refetch="getMentor"
    />
    <DialogDelete
      v-model="dialog.delete"
      @close="dialog.delete = false"
      @refetch="getMentor"
    />
  </table-layout>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import tableLayout from "../../../components/table-layout.vue";
import useApi from "../../../composables/use-api";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "../../../composables/use-helper";

import { MentorIF } from "./mentor.interface";
import CreateMentor from "./create-mentor.vue";
import DialogDelete from "../../../components/dialog-delete.vue";

const SkeletonTable = defineAsyncComponent(
  () => import("../../../components/skeleton-table.vue")
);

interface queryIf {
  page: number;
  limit: number;
  name: string;
  role_id: number;
}

interface dialogIf {
  create: boolean;
  delete: boolean;
}

const api = new useApi();
const router = useRouter();
const route = useRoute();
const loading = ref<Boolean>(false);

const limits: number[] = [10, 50, 100];
const query = reactive<queryIf>({
  page: 1,
  limit: 10,
  name: "",
  role_id: 2
});

const dialog = reactive<dialogIf>({
  create: false,
  delete: false
});

const total = ref<number | null>(null);

const data = ref<MentorIF[] | []>([]);

const paginate = (number: number): any => {
  query.page = number;
  getMentor();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const onFilter = () => {
  query.page = 1;
  getMentor();
};

const getMentor = (): void => {
  loading.value = true;
  console.log(query.name);
  const q = useQuery(query);
  api.get(`user${q}`).then((res) => {
    console.log(res);
    const raw: MentorIF[] | [] = res.data.items;
    data.value = raw;
    total.value = res.data.total;
    loading.value = false;
  });
};

const columns: string[] = ["No.", "Name", "Email", "Username", ""];

const pocket = ref<any>(null);

const onDelete = (item: MentorIF) => {
  pocket.value = {
    path: `user/delete/${item.id}`
  };
  console.log(item);

  dialog.delete = true;
};

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
  getMentor();
});
</script>
