<template>
  <table-layout title="Role List">
    <template #header-action>
      <h-btn
        @click="dialog.create = true"
        class="rounded-md px-3 py-2 flex items-center gap-3"
      >
        <h-icon name="plus"></h-icon>
        <p class="">Tambah Role</p>
      </h-btn>
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
              <td class="py-2 px-7 w-0">
                <p class="font-medium">
                  {{ item.id }}
                </p>
              </td>

              <td class="py-2 px-4">
                <p class="font-medium">
                  {{ item.name }}
                </p>
              </td>

              <td class="py-2 px-5 flex justify-end">
                <div>
                  <button
                    class="p-2 rounded-full hover:bg-red-50 text-red-500 w-full outline-none"
                    @click="onDelete(item)"
                  >
                    <h-icon name="trash" size="18" />
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
    <CreateRole
      :dialog="dialog.create"
      @close="dialog.create = false"
      @refetch="getRole"
    />
    <DialogDelete
      :pocket="pocket"
      v-model="dialog.delete"
      @close="dialog.delete = false"
      @refetch="getRole"
    />
  </table-layout>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import tableLayout from "../../components/table-layout.vue";
import useApi from "../../composables/use-api";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "../../composables/use-helper";
import CreateRole from "./create-role.vue";
import { RoleIF } from "../../interface/role.interface";
import DialogDelete from "../../components/dialog-delete.vue";

const SkeletonTable = defineAsyncComponent(
  () => import("../../components/skeleton-table.vue")
);

interface queryIf {
  page: number;
  limit: number;
}

const api = new useApi();
const router = useRouter();
const pocket = ref<any>(null);
const route = useRoute();
const loading = ref<Boolean>(false);
const total = ref<number | null>(null);
const data = ref<RoleIF[] | []>([]);

const query = reactive<queryIf>({
  page: 1,
  limit: 8
});

const paginate = (number: number): any => {
  query.page = number;
  getRole();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const getRole = (): void => {
  loading.value = true;
  const q = useQuery(query);

  api.get(`role${q}`).then((res) => {
    const raw: RoleIF[] | [] = res.data.items;
    data.value = raw;
    total.value = res.data.total;
    loading.value = false;
  });
};

const columns: string[] = ["Key", "Nama Role", ""];

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
  delete: boolean;
}

const dialog = reactive<DialogIf>({
  create: false,
  delete: false
});

const onDelete = (item: RoleIF) => {
  pocket.value = {
    path: `role/delete/${item.id}`
  };

  dialog.delete = true;
};

onMounted(() => {
  currentPage();
  getRole();
});
</script>
