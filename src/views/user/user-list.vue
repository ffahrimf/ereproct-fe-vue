<template>
  <table-layout title="User List">
    <template #header-searchbar>
      <h-search
        v-model="query.name"
        placeholder="Search"
        @search="getUser"
        @keyup="loading = true"
        class="w-[350px] xl:w-[450px]"
      ></h-search>
    </template>
    <template #header-action>
      <div class="flex items-center space-x-7">
        <h-menu arrow closeOnClick>
          <template #default="{ isOpen }">
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium">{{ selectedRoleLabel }}</p>
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
                v-for="role in role_id"
                :key="role.value ?? 'all'"
                @click="onFilterRole(role.value)"
                class="py-2 px-4 hover:bg-slate-50 text-sm rounded flex items-center gap-2 w-full outline-none"
              >
                {{ role.label }}
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
          <p class="">Tambah User</p>
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
              <td class="py-2 px-5">
                <p class="font-medium">
                  {{ item.name }}
                </p>
              </td>

              <td class="py-2 px-4">
                <p class="text-stone-500">
                  {{ item.username }}
                </p>
              </td>
              <td class="py-2 px-4 whitespace-nowrap">
                <p class="text-stone-500">
                  {{ item.email }}
                </p>
              </td>
              <td class="py-2 px-4 whitespace-nowrap">
                <p class="text-stone-500">
                  {{ item.role.name }}
                </p>
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
                        @click="onChangePassword(item)"
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
    <CreateUser
      :dialog="dialog.create"
      @close="dialog.create = false"
      @refetch="getUser"
    />
    <ChangePassword
      :pocket="pocket"
      :dialog="dialog.password"
      @close="dialog.password = false"
      @refetch="getUser"
    />
    <DialogDelete
      :pocket="pocket"
      v-model="dialog.delete"
      @close="dialog.delete = false"
      @refetch="getUser"
    />
  </table-layout>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import tableLayout from "../../components/table-layout.vue";
import useApi from "../../composables/use-api";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "../../composables/use-helper";
import CreateUser from "./create-user.vue";
import ChangePassword from "./change-password.vue";
import { UserIF } from "../user/user.interface";
import DialogDelete from "../../components/dialog-delete.vue";
import { RoleIF } from "../../interface/role.interface";

const SkeletonTable = defineAsyncComponent(
  () => import("../../components/skeleton-table.vue")
);

interface queryIf {
  page: number;
  limit: number;
  name: string;
  role_id: any;
}

const api = new useApi();
const router = useRouter();
const pocket = ref<any>(null);
const route = useRoute();
const loading = ref<Boolean>(false);
const total = ref<number | null>(null);
const data = ref<UserIF[] | []>([]);

const selectedRoleLabel = computed(() => {
  return (
    role_id.find((role) => role.value === query.role_id)?.label || "All roles"
  );
});

const limits: number[] = [8, 20, 50, 100];
const query = reactive<queryIf>({
  page: 1,
  limit: 8,
  name: "",
  role_id: null
});

const role_id = [
  { label: "All roles", value: null },
  { label: "Superadmin", value: 1 },
  { label: "Assessment", value: 2 },
  { label: "Proctor", value: 3 },
  { label: "Research", value: 4 }
];

interface DataRoleIF {
  list: Array<RoleIF> | [];
  loading: boolean;
  selected: RoleIF | null;
  find: string;
  q: any;
}

const role = reactive<DataRoleIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    id: null,
    name: ""
  }
});

const getRole = (): void => {
  role.loading = true;
  const q = useQuery(role.q);
  api.get(`role${q}`).then((res) => {
    let raw: Array<RoleIF> = res.data.items;
    if (role.q.Page > 1) {
      role.list = [...role.list, ...raw];
    } else {
      role.list = raw;
    }
    role.loading = false;
  });
};

const paginate = (number: number): any => {
  query.page = number;
  getUser();
  router.replace({
    path: route.path,
    query: { ...route.query, page: number }
  });
};

const onFilterRole = (roleValue: any | null) => {
  query.role_id = roleValue;
  query.page = 1;
  getUser();
};

const onFilterLimit = () => {
  query.page = 1;
  getUser();
};

const getUser = (): void => {
  loading.value = true;
  const q = useQuery(query);

  api.get(`user${q}`).then((res) => {
    const raw: UserIF[] | [] = res.data.items;
    data.value = raw;
    total.value = res.data.total;
    loading.value = false;
  });
};

const columns: string[] = ["Nama", "Username", "Email", "Role", "Aksi"];

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

const onDelete = (item: UserIF) => {
  pocket.value = {
    path: `user/delete/${item.id}`
  };

  dialog.delete = true;
};

const onChangePassword = (item: UserIF) => {
  pocket.value = {
    id: item.id
  };
  dialog.password = true;
};

onMounted(() => {
  currentPage();
  getUser();
  getRole();
});
</script>
