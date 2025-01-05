<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[500px] flex flex-col h-[97vh] relative"
    >
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">
          {{ form.id ? "Update Company Title" : "Create Company Title" }}
        </p>
        <icon-btn icon="x-mark" @click="closeDialog" />
      </div>
      <div class="py-3 px-6 flex-1">
        <div
          class="mb-3"
          v-if="
            store.role !== 'ADMIN' && (!form.id || store.role === 'SUPERADMIN')
          "
        >
          <h-select
            label="Company"
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
                @search="getCompany"
              ></h-search>
            </template>
          </h-select>
          <p class="text-sm text-red-500">{{ errs.company_id }}</p>
        </div>
        <div class="mb-3">
          <h-input
            label="Company Title"
            placeholder="Ketik Judul Perusahaan..."
            v-model="form.name"
          ></h-input>
          <p class="text-sm text-red-500">
            {{ errs.name }}
          </p>
        </div>
        <div class="mb-3">
          <h-input
            label="Description"
            placeholder="Ketik Deskripsi Judul Perusahaan"
            v-model="form.description"
          ></h-input>
          <p class="text-sm text-red-500">
            {{ errs.description }}
          </p>
        </div>
      </div>
      <div class="py-3 px-6 border-t flex items-center justify-end">
        <h-btn class="px-3 py-2" @click="postData">{{
          form.id ? "Update" : "Save"
        }}</h-btn>
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
import { onMounted, reactive, ref, watch } from "vue";
import { CompanyIF } from "../../company/company.interface";
import { mainStore } from "../../../store";
import useApi from "../../../composables/use-api";
import {
  useFilterProperties,
  useQuery,
  useToast
} from "../../../composables/use-helper";
import { GenericObject } from "../../../interface/composable.interface";

interface CreateCompanyTitle {
  id?: string;
  company_id: number | null;
  name: string;
  description: string;
}

interface DataCompanyIF {
  list: Array<CompanyIF> | [];
  loading: boolean;
  selected: CompanyIF | null;
  find: string;
  q: any;
}

const props = defineProps({
  dialog: Boolean,
  pocket: null
});

const emit = defineEmits(["close", "refetch"]);

const api = new useApi();

const store = mainStore();

const form = reactive<CreateCompanyTitle>({
  id: "",
  company_id: null,
  name: "",
  description: ""
});

watch(
  () => props.pocket,
  (pocket) => {
    if (pocket) {
      form.id = pocket.id;
      form.name = pocket.name;
      form.description = pocket.description;
    } else {
      resetForm();
    }
  }
);

const resetForm = () => {
  form.id = "";
  form.company_id = null;
  form.name = "";
  form.description = "";
  company.selected = null;
  errs.company_id = "";
  errs.name = "";
  errs.description = "";
};

const closeDialog = () => {
  resetForm();
  emit("close");
};

const errs = reactive<GenericObject>({
  company_id: "",
  name: "",
  description: ""
});

const company = reactive<DataCompanyIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    name: ""
  }
});

const getCompany = (): void => {
  company.loading = true;
  const q = useQuery(company.q);
  api.get(`company${q}`).then((res) => {
    let raw: Array<CompanyIF> = res.data.items;
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

  if (store.role === "ADMIN") {
    form["company_id"] = store.company ? parseInt(store.company.id) : null;
  }

  let body = useFilterProperties(form);

  let req = {
    path: `company-title/${form.id ? "update" : "create"}`,
    body: body
  };

  api
    .post(req)
    .then((res) => {
      useToast(res.message, "success");
      emit("close");
      emit("refetch");
      resetForm();
      loading.value = false;
    })
    .catch((err) => {
      useToast(err.message, "error");
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

onMounted(() => {
  getCompany();
});
</script>
