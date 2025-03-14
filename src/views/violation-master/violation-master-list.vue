<template>
  <table-layout title="Violation List">
    <template #header-action>
      <h-btn
        @click="dialog.create = true"
        class="rounded-md px-3 py-2 flex items-center gap-3"
      >
        <h-icon name="plus"></h-icon>
        <p class="">Add Violation</p>
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
              <td class="py-2 px-5 w-0">
                <div
                  @click="copyText(item.color)"
                  class="flex cursor-pointer active:scale-95 space-x-2 items-center"
                >
                  <p class="font-medium">
                    {{ item.color }}
                  </p>
                  <span
                    class="block w-2 h-2 aspect-square rounded-full"
                    :style="{ backgroundColor: item.color }"
                  ></span>
                </div>
              </td>
              <td class="py-2 px-4">
                <div
                  class="text-xs px-3 py-1.5 font-medium inline-flex rounded-lg bg-green-50"
                  :style="{
                    color: item.color,
                    backgroundColor: item.sub_color
                  }"
                >
                  <p class="">
                    {{ item.type }}
                  </p>
                </div>
              </td>
              <td class="py-2 px-5">
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
                        @click="onUpdate(item)"
                        class="py-2 px-3 hover:bg-slate-50 text-gray-700 text-xs font-medium rounded flex items-center gap-2 w-full outline-none"
                      >
                        <p>Update</p>
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
    <CreateViolationMaster
      :pocket="pocket"
      :dialog="dialog.create"
      @close="dialog.create = false"
      @refetch="getViolationMaster"
    />
  </table-layout>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import tableLayout from "../../components/table-layout.vue";
import useApi from "../../composables/use-api";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useToast } from "../../composables/use-helper";
import CreateViolationMaster from "./create-violation.vue";
import { ViolationMasterIF } from "./violation-master.interface";

const SkeletonTable = defineAsyncComponent(
  () => import("../../components/skeleton-table.vue")
);

interface QueryIf {
  page: number;
  limit: number;
}

const api = new useApi();
const router = useRouter();
const pocket = ref<any>(null);
const route = useRoute();
const loading = ref<Boolean>(false);
const total = ref<number | null>(null);
const data = ref<ViolationMasterIF[] | []>([]);

const query = reactive<QueryIf>({
  page: 1,
  limit: 8
});

const paginate = (number: number): any => {
  query.page = number;
  getViolationMaster();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const getViolationMaster = (): void => {
  loading.value = true;
  const q = useQuery(query);
  api.get(`violation${q}`).then((res) => {
    const raw: ViolationMasterIF[] | [] = res.data.items;
    data.value = raw;
    total.value = res.data.total;
    loading.value = false;
  });
};

const onUpdate = (item: ViolationMasterIF) => {
  pocket.value = item;
  dialog.create = true;
};

const columns: string[] = ["Color", "Condition", "Action"];

const currentPage = () => {
  const queryPage = route.query?.page;
  if (queryPage) {
    query.page = Array.isArray(queryPage)
      ? parseInt(queryPage[0] ?? "1")
      : parseInt(queryPage) ?? 1;
  }
};

const copyText = async (text: any) => {
  await navigator.clipboard.writeText(text);
  useToast("Color code copied to clipboard", "info", "top-center");
};

interface DialogIf {
  create: boolean;
}

const dialog = reactive<DialogIf>({
  create: false
});

onMounted(() => {
  currentPage();
  getViolationMaster();
});
</script>
