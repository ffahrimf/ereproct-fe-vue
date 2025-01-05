<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[500px] flex flex-col h-[97vh] relative"
    >
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">Create Admin</p>
        <icon-btn icon="x-mark" @click="emit('close')" />
      </div>
      <div class="py-3 px-6 flex-1 styled-scroll">
        <div class="mb-3" v-if="store.role == 'SUPERADMIN'">
          <h-select
            label="Perusahaan"
            placeholder="Pilih Perusahaan"
            :items="company.list"
            item-name="name"
            item-value="id"
            return-object
            :loading="company.loading"
            v-model="company.selected"
          >
            <template #search>
              <h-search
                class="mb-1"
                v-model="company.q.name"
                @keyup="company.loading = true"
                placeholder="Ketik untuk mencari..."
                @search="onFilter"
              ></h-search>
            </template>
          </h-select>
          <p
            class="text-sm text-red-500 whitespace-pre"
            v-html="errs.company_id"
          ></p>
        </div>
        <div class="mb-3">
          <h-input
            label="Nama Admin"
            placeholder="Ketik Nama Admin..."
            v-model="form.name"
          ></h-input>

          <p
            class="text-sm text-red-500 whitespace-pre-wrap"
            v-html="errs.name"
          ></p>
        </div>
        <div class="mb-3">
          <h-input
            label="Email"
            placeholder="Ketik Email Admin"
            v-model="form.email"
            :disabled="!!form.id"
          ></h-input>

          <p
            class="text-sm text-red-500 whitespace-pre-wrap"
            v-html="errs.email"
          ></p>
        </div>
        <div class="mb-3">
          <h-input
            label="Username"
            placeholder="Username Admin"
            v-model="form.username"
            :disabled="!!form.id"
          ></h-input>

          <p
            class="text-sm text-red-500 whitespace-pre-wrap"
            v-html="errs.username"
          ></p>
        </div>
        <div class="mb-3" v-if="!form.id">
          <h-input
            label="Password"
            placeholder="Password Admin"
            v-model="form.password"
          ></h-input>
          <p
            class="text-sm text-red-500 whitespace-pre-wrap"
            v-html="errs.password"
          ></p>
        </div>
      </div>
      <div class="py-3 px-6 border-t flex items-center justify-end">
        <h-btn class="px-3 py-2" @click="postData">Save</h-btn>
      </div>
      <h-overlay
        :value="loading"
        absolute
        class="flex items-center justify-center gap-3"
      >
        <spinner />
      </h-overlay>
    </div>
  </h-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { CompanyIF } from "../company/company.interface";
import useApi from "../../composables/use-api";
import {
  useFilterProperties,
  useQuery,
  useToast,
} from "../../composables/use-helper";
import { mainStore } from "../../store";
import { AdminIF } from "./admin.interface";
import { GenericObject } from "../../interface/composable.interface";

interface CreateAdmin {
  id?: string;
  company_id: any;
  name: string;
  username: string;
  password: string;
  email: string;
  role_id?: number | null;
}

interface DataCompanyIF {
  list: Array<CompanyIF> | [];
  loading: boolean;
  selected: CompanyIF | null;
  find: string;
  q: any;
}

defineProps({
  dialog: Boolean,
});

const emit = defineEmits(["close", "refetch"]);

const api = new useApi();
const store = mainStore();
// const guid = ref<string>("");

const form = reactive<CreateAdmin>({
  id: "",
  company_id: null,
  name: "",
  username: "",
  password: "",
  email: "",
});

const errs = reactive<GenericObject>({
  company_id: "",
  name: "",
  username: "",
  password: "",
  email: "",
});

const company = reactive<DataCompanyIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    name: "",
  },
});

const onFilter = () => {
  company.q.page = 1;
  getCompany();
};

const getCompany = (): void => {
  company.loading = true;
  let q = useQuery(company.q);
  api.get(`company${q}`).then((res) => {
    let raw: Array<CompanyIF> = res.data.items;
    console.log(raw);

    if (company.q.Page > 1) {
      company.list = [...company.list, ...raw];
    } else {
      company.list = raw;
    }
    company.loading = false;
  });
};

const loading = ref<boolean>(false);
const postData = (): void => {
  loading.value = true;
  const adminRole: number = 2;
  form["role_id"] = adminRole;
  console.log(company.selected);

  form["company_id"] =
    store.role == "ADMIN" ? store.company?.id : company.selected?.id;

  let body = useFilterProperties(form);

  let req = {
    path: `user/${form.id ? "update" : "create"}`,
    body: body,
  };

  api
    .post(req)
    .then((res) => {
      useToast(res.message, "success");
      emit("close");
      emit("refetch");
      loading.value = false;
    })
    .catch((err) => {
      useToast(err.message, "error");
      console.log(err.errors);
      const requiredErr = err.errors;
      if (requiredErr) {
        for (let key in err.errors) {
          errs[key] =
            requiredErr[key].length > 1
              ? requiredErr[key].join(`\n`)
              : requiredErr[key][0];
        }
      }
      loading.value = false;
    });
};

const setVal = (item: AdminIF) => {
  (Object.keys(form) as (keyof CreateAdmin)[]).forEach((key) => {
    if (key !== "role_id" && key !== "company_id" && key in item) {
      const value = item[key as keyof AdminIF];

      if (typeof value === "string" || typeof value === "number") {
        form[key] = value as any;
      }
    }
  });
};

defineExpose({
  setVal,
});

onMounted(() => {
  getCompany();
});
</script>
