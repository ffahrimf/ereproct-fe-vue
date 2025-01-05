<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[500px] flex flex-col h-[90vh] relative mt-5"
    >
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">
          {{ form.id ? "Update Company" : "Create Company" }}
        </p>
        <icon-btn icon="x-mark" @click="closeDialog" />
      </div>

      <div class="py-3 px-6 flex-1 overflow-y-auto max-h-[100vh]">

        <div class="font-bold text-sm text-slate-700 bg-slate-100 px-4 py-2 rounded mb-4">
          <span>Informasi Perusahaan</span>
        </div>
          
        <div class="mb-3">
          <h-input
            label="Nama Perusahaan"
            placeholder="Silahkan isi dengan nama perusahaan"
            v-model="form.name"
          ></h-input>
          <p class="text-sm text-red-500">{{ errs.name }}</p>
        </div>

        <div class="mb-3">
          <h-input
            label="Kode Perusahaan"
            placeholder="Silahkan isi dengan kode perusahaan"
            v-model="form.code"
            accept="number"
          ></h-input>
          <p class="text-sm text-red-500">{{ errs.code }}</p>
        </div>

        <div class="mb-3">
          <h-phone
            label="Nomor Telepon"
            placeholder="Silahkan isi dengan nomor perusahaan yang aktif"
            v-model="form.phone_no"
        ></h-phone>
          <p class="text-sm text-red-500">{{ errs.phone_no }}</p>
        </div>

        <div class="mb-3">
          <h-input
            label="Email"
            placeholder="Silahkan isi dengan email perusahaan yang aktif"
            v-model="form.email"
          ></h-input>
          <p class="text-sm text-red-500">{{ errs.email }}</p>
        </div>

        <div class="mb-3">
          <h-input
            label="Website"
            placeholder="Silahkan isi dengan website perusahaan (jika ada)"
            v-model="form.website"
          ></h-input>
          <p class="text-sm text-red-500">{{ errs.website }}</p>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium text-slate-700">Logo Perusahaan</label>
          <div class="flex items-start gap-4 mt-2">
            <div class="relative">
              <div class="flex items-center justify-center w-20 h-20 bg-slate-100 rounded-md">
                <img v-if="form.logoPreview" :src="form.logoPreview" alt="Logo Preview" class="h-full w-full object-cover rounded-md" />
                <h-icon v-else name="heroicons:photo" class="text-slate-400" />
              </div>
            </div>
            <div>
              <h-input-file
                label="Pilih File"
                v-model="form.logo"
                accept="image/*"
                @change="onLogoChange"
                class="mb-1 text-gray-500"
              ></h-input-file>
              <p class="text-sm text-gray-500">*Pastikan jarak antara gambar dan sisi gambar (padding) tidak terlalu lebar</p>
            </div>
          </div>
          <p class="text-sm text-red-500">{{ errs.logo }}</p>
        </div>


        <div class="font-bold text-sm text-slate-700 bg-slate-100 px-4 py-2 rounded mb-4">
          <span>Lokasi Perusahaan</span>
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium text-slate-700">Alamat Lengkap</label>
          <h-area
            placeholder="Silahkan isi dengan alamat lengkap perusahaan"
            v-model="form.address"
            class="mt-1 block w-full rounded-md border text-sm"
            rows="3"
          ></h-area>
          <p class="text-sm text-red-500">{{ errs.address }}</p>
        </div>

        <div class="mb-3">
          <h-select
            label="Provinsi"
            placeholder="-Pilih-"
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
                placeholder="Search province..."
              ></h-search>
            </template>
          </h-select>
          <p class="text-sm text-red-500">{{ errs.province_id }}</p>
        </div>

        <div class="mb-3">
          <h-select
            label="Kota"
            placeholder="-Pilih-"
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
                placeholder="Search city..."
              ></h-search>
            </template>
          </h-select>
          <p class="text-sm text-red-500">{{ errs.city_id }}</p>
        </div>

        <div class="mb-3">
          <h-input
            label="Kode Pos"
            placeholder="ISi kode pos"
            v-model="form.post_code"
            accept="number"
          ></h-input>
          <p class="text-sm text-red-500">{{ errs.post_code }}</p>
        </div>

        <div class="font-bold text-sm text-slate-700 bg-slate-100 px-4 py-2 rounded mb-4">
          <span>Informasi Admin</span>
        </div>

        <div class="mb-3">
            <h-input
              label="Nama Admin"
              placeholder="Silahkan isi nama admin"
              v-model="form.user_name"
              :disabled="props.isUpdateMode"
            ></h-input>
            <p class="text-sm text-red-500">{{ errs.user_name }}</p>
          </div>

        <div >
          <div class="mb-3">
            <h-input
              label="Username"
              placeholder="Silahkan isi username"
              v-model="form.user_username"
              :disabled="props.isUpdateMode"
            ></h-input>
            <p class="text-sm text-red-500">{{ errs.user_username }}</p>
          </div>

          <div class="mb-3">
            <h-input
              label="Email Admin"
              placeholder="Silahkan isi email"
              v-model="form.user_email"
              :disabled="props.isUpdateMode"
            ></h-input>
            <p class="text-sm text-red-500">{{ errs.user_email }}</p>
          </div>

          <div class="mb-3">
            <h-input-password
              label="Password Admin"
              placeholder="Password"
              v-model="form.user_password"
              :disabled="props.isUpdateMode"
            ></h-input-password>
            <p class="text-sm text-red-500">{{ errs.user_password }}</p>
          </div>
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
import useApi from "../../composables/use-api";
import { useFilterProperties, useQuery, useToast } from "../../composables/use-helper";
import { ProvinceIF, CityIF } from "../../interface/area.interface";
import { AdminIF } from "../admin/admin.interface";

interface CreateCompany {
  id?: string;
  name: string;
  code: string;
  email: string;
  phone_no: string;
  province_id: number;
  city_id: number;
  website: string;
  address: string;
  post_code: number;
  logo: File | null;
  logoPreview: string | null;
  user_username: string;
  user_name: string;
  user_email: string;
  user_password: string;
  role_id: number;
}

interface DataAdminIF {
  list: Array<AdminIF> | [];
  loading: boolean;
  selected: AdminIF | null;
  find: string;
  q: any;
}

const props = defineProps({
  dialog: Boolean,
  pocket: null,
  isUpdateMode: Boolean,
});

const emit = defineEmits(["close", "refetch"]);
const api = new useApi();

const form = reactive<CreateCompany>({
  id: "",
  name: "",
  code: "",
  email: "",
  phone_no: "",
  province_id: 0,
  city_id: 0,
  website: "",
  address: "",
  post_code: 0,
  logo: null,
  logoPreview: null,
  user_username: "",
  user_name: "",
  user_email: "",
  user_password: "",
  role_id: 0,
});
const errs = reactive<Record<string, string>>({});

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

const user = reactive<DataAdminIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    name: "",
    company_id: null as number | null 
  }
});

watch(
  () => props.pocket,
  (pocket) => {
    if (pocket) {
      console.log('Entire pocket data:', pocket);  
      form.id = pocket.id;
      form.name = pocket.name;
      form.code = pocket.code;
      form.email = pocket.email;
      form.phone_no = pocket.phone_no;
      form.website = pocket.website;
      form.address = pocket.address;
      form.post_code = pocket.post_code;
      form.logoPreview = pocket.logo_decode || null;
      if (pocket.province) {
        province.selected = pocket.province;
        form.province_id = pocket.province.id;
        city.q.province_id = pocket.province.id;
        getCity().then(() => {
          if (pocket.city) {
            city.selected = pocket.city;
            form.city_id = pocket.city.id;
          }
        });
      }

      if (pocket.user) {
        form.user_name = pocket.user.name || '';
        form.user_username = pocket.user.username || '';
        form.user_email = pocket.user.email || '';
      } else if (pocket.company_id) {
        user.q.company_id = pocket.company_id;
        getUser();
      }

      form.user_password = ''; 
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

const onLogoChange = () => {
  if (form.logo) {
    const file = form.logo instanceof FileList ? form.logo[0] : form.logo;
    form.logoPreview = URL.createObjectURL(file);
  } else {
    form.logoPreview = null;
  }
};

const resetForm = () => {
  Object.assign(form, {
    id: "",
    name: "",
    code: "",
    email: "",
    phone_no: "",
    province_id: 0,
    city_id: 0,
    website: "",
    address: "",
    post_code: 0,
    logo: null,
    logoPreview: null,
    user_username: "",
    user_name: "",
    user_email: "",
    user_password: "",
    role_id: 0,
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

const getUser = (): void => {
  user.loading = true;
  const q = useQuery(user.q);
  api.get(`user${q}`).then((res) => {
    let raw: Array<AdminIF> = res.data.items;
      user.list = raw;

if (user.list.length > 0) {
  const selectedAdmin = user.list[0];
  form.user_name = selectedAdmin.name;
  form.user_username = selectedAdmin.username;
  form.user_email = selectedAdmin.email;
}

user.loading = false;
});
}; 

const loading = ref<boolean>(false);
const role = "2"

const clearErrorsOnChange = () => {
  Object.keys(form).forEach((key) => {
    if (errs[key as keyof CreateCompany]) {
      errs[key as keyof CreateCompany] = ""; // Hapus pesan error jika ada
    }
  });
};

const postData = async (): Promise<void> => {
  clearErrorsOnChange();
  loading.value = true;
  const filteredForm = useFilterProperties(form);
  const formData = new FormData();

  Object.entries(filteredForm).forEach(([key, value]) => {
    if (value != null && key !== 'logoPreview') {
      if (form.id && key.startsWith('user_')) return;
      if (key === 'logo' && value instanceof File) {
        formData.append('file', value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  formData.append('role_id', role);

  try {
    const res = await api.post({
      path: `company/${form.id ? "update" : "create"}`,
      body: formData,
    });
    useToast(res.message, "success");
    emit("close");
    emit("refetch");
    resetForm();
  } catch (err) {
    handleErrrorMesssage(err);
  } finally {
    loading.value = false;
  }
};

const handleErrrorMesssage = (err: any) => {
  useToast(err.message, "error");
  if (err.errors) {
    for (let key in err.errors) {
      errs[key] = Array.isArray(err.errors[key])
        ? err.errors[key].join(`\n`)
        : err.errors[key][0];
    }
  }
};

onMounted(() => {
  getProvince();
});
</script>
