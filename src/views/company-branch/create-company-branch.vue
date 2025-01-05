<template>
  <h-dialog :dialog="dialog">
    <div class="bg-white rounded-md shadow-lg w-[500px] flex flex-col h-[97vh] relative">
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">
          {{ form.id ? "Update Company Branch" : "Create Company Branch" }}
        </p>
        <icon-btn icon="x-mark" @click="closeDialog" />
      </div>
      <div class="py-3 px-6 flex-1 overflow-y-auto">
        <div
          class="mb-3"
          v-if="store.role !== 'ADMIN' && (!form.id || store.role === 'SUPERADMIN')"
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
          <h-input label="Company Branch" placeholder="Ketik Cabang Perusahaan..." v-model="form.name"></h-input>
          <p class="text-sm text-red-500">{{ errs.name }}</p>
        </div>

        <div class="mb-3">
          <h-input label="Email" placeholder="Ketik Email Cabang Perusahaan" v-model="form.email"></h-input>
          <p class="text-sm text-red-500">{{ errs.email }}</p>
        </div>

        <div class="mb-3">
          <h-phone label="Phone Number" placeholder="Ketik No Handphone..." v-model="form.phone_no" ></h-phone>
          <p class="text-sm text-red-500">{{ errs.phone_no }}</p>
        </div>

        <div class="mb-3">
          <h-select
            label="Province"
            placeholder="Pilih Provinsi"
            :items="province.list"
            item-name="name"
            item-value="id"
            return-object
            :loading="province.loading"
            v-model="province.selected"
            @change="onProvinceChange"
          >
            <template #search>
              <h-search
                class="mb-1"
                v-model="province.q.name"
                @search="getProvince"
                placeholder="Cari Provinsi..."
              ></h-search>
            </template>
          </h-select>
          <p class="text-sm text-red-500">{{ errs.province_id }}</p>
        </div>

        <div class="mb-3">
          <h-select
            label="City"
            placeholder="Pilih Kota"
            :items="city.list"
            item-name="name"
            item-value="id"
            return-object
            :loading="city.loading"
            v-model="city.selected"
            @change="onCityChange"
          >
            <template #search>
              <h-search
                class="mb-1"
                v-model="city.q.name"
                @search="getCity"
                placeholder="Cari Kota..."
              ></h-search>
            </template>
          </h-select>
          <p class="text-sm text-red-500">{{ errs.city_id }}</p>
        </div>

        <div class="mb-3">
          <h-input label="Website" placeholder="Ketik website..." v-model="form.website"></h-input>
          <p class="text-sm text-red-500">{{ errs.website }}</p>
        </div>

        <div class="mb-3">
          <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
          <h-area
            v-model="form.address"
            placeholder="Ketik Alamat..."
            class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></h-area>
          <p class="text-sm text-red-500">{{ errs.address }}</p>
        </div>

        <div class="mb-3">
          <h-input label="Post Code" placeholder="Ketik Kode Pos..." v-model="form.post_code" accept="number"></h-input>
          <p class="text-sm text-red-500">{{ errs.post_code }}</p>
        </div>
      </div>
      <div class="py-3 px-6 border-t flex items-center justify-end bg-white rounded-b-md">
        <h-btn class="px-3 py-2" @click="postData">
          {{ form.id ? "Update" : "Save" }}
        </h-btn>
      </div>
      <h-overlay :value="loading" absolute class="flex items-center justify-center gap-3">
        <spinner />
      </h-overlay>
    </div>
  </h-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { CompanyIF } from "./../company/company.interface";
import { mainStore } from "./../../store";
import useApi from "./../../composables/use-api";
import {
  useFilterProperties,
  useQuery,
  useToast
} from "./../../composables/use-helper";
import { GenericObject } from "./../../interface/composable.interface";
import { ProvinceIF, CityIF,} from "../../interface/area.interface";

interface CreateCompanyBranch {
  id?: string;
  company_id: number | null;
  name: string;
  email: string;
  phone_no: string;
  province_id: number;
  city_id: number;
  website: string;
  address: string;
  post_code: string;
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

const form = reactive<CreateCompanyBranch>({
  id: "",
  company_id: null,
  name: "",
  email: "",
  phone_no: "",
  province_id: 0,
  city_id: 0,
  website: "",
  address: "",
  post_code: "",
});

const province = reactive({
  list: [] as ProvinceIF[],
  loading: false,
  selected: null as ProvinceIF | null,
  q: { name: "" }
});

const city = reactive({
  list: [] as CityIF[],
  loading: false,
  selected: null as CityIF | null,
  q: { name: "", province_id: null as number | null }
});

watch(
  () => props.pocket,
  (pocket) => {
    if (pocket) {
      form.id = pocket.id;
      form.name = pocket.name;
      form.email = pocket.email;
      form.phone_no = pocket.phone_no;
      form.website = pocket.website;
      form.address = pocket.address;
      form.post_code = pocket.post_code;
      if (pocket.province) {
        province.selected = pocket.province;
      }
      if (pocket.city) {
        city.selected = pocket.city;
      }
    } else {
      resetForm();
    }
  }
);

const onProvinceChange = async () => {
  if (province.selected) {
    form.province_id = province.selected.id;
    city.q.province_id = province.selected.id;
    city.selected = null;
    form.city_id = 0;
    await getCity();
  } else {
    form.province_id = 0;
    city.q.province_id = null;
    city.list = [];
    city.selected = null;
    form.city_id = 0;
  }
};

const onCityChange = () => {
  if (city.selected) {
    form.city_id = city.selected.id;
  } else {
    form.city_id = 0;
  }
};


const resetForm = () => {
  Object.assign(form, {
  id : "",
  company_id : null,
  name : "",
  email : "",
  phone_no : "",
  website : "",
  address : "",
  post_code : "",
});
  province.selected = null;
  city.selected = null;
  Object.keys(errs).forEach(key => (errs[key] = ""));
};


const closeDialog = () => {
  resetForm();
  emit("close");
};

const getProvince = () => {
  province.loading = true;
  api.get(`province${useQuery(province.q)}`)
    .then(res => {
      province.list = res.data.items;
    })
    .finally(() => {
      province.loading = false;
    });
};

const getCity = async () => {
  if (!city.q.province_id) return;
  city.loading = true;
  try {
    const res = await api.get(`city?province_id=${city.q.province_id}&name=${city.q.name || ''}`);
    city.list = res.data.items;
  } finally {
    city.loading = false;
  }
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
  form["company_id"] = store.company ? parseInt(store.company.id) : null;

  let body = useFilterProperties(form);

  let req = {
    path: `company-branch/${form.id ? "update" : "create"}`,
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
  getProvince();
});
</script>
