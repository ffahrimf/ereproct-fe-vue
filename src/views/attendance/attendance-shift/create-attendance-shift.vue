<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[500px] flex flex-col h-[97vh] relative"
    >
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">
          {{ form.id ? "Update Attendance Shift" : "Create Attendance Shift" }}
        </p>
        <icon-btn icon="x-mark" @click="closeDialog" />
      </div>
      <div class="py-3 px-6 flex-1 overflow-y-auto">
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
        <div class="mb-3" v-if="!form.id">
          <h-input
            label="Shift Name"
            placeholder="Ketik Nama Shift..."
            v-model="form.name"
          ></h-input>
          <p class="text-sm text-red-500">
            {{ errs.name }}
          </p>
        </div>
        <div class="mb-3 grid grid-cols-2 gap-5">
          <div class="">
            <h-time-picker
              class=""
              label="Shift In"
              v-model="form.shift_in"
            ></h-time-picker>
            <p class="text-sm text-red-500">
              {{ errs.shift_in }}
            </p>
          </div>
          <div class="">
            <h-time-picker
              label="Shift Out"
              v-model="form.shift_out"
            ></h-time-picker>
            <p class="text-sm text-red-500">
              {{ errs.shift_out }}
            </p>
          </div>
        </div>
        <div class="mb-3 grid grid-cols-2 gap-5">
          <div class="">
            <h-select
              label="Overnight"
              placeholder="Pilih Overnight"
              :items="[
                { label: 'Ya', value: true },
                { label: 'Tidak', value: false }
              ]"
              itemName="label"
              itemValue="value"
              v-model="form.is_overnight"
            ></h-select>
            <p v-if="errs.is_overnight" class="text-sm text-red-500">
              {{ errs.is_overnight }}
            </p>
          </div>

          <div class="">
            <h-select
              label="Status"
              placeholder="Pilih Status"
              :items="[
                { label: 'Aktif', value: true },
                { label: 'Tidak Aktif', value: false }
              ]"
              itemName="label"
              itemValue="value"
              v-model="form.status"
            >
            </h-select>
            <p class="text-sm text-red-500">
              {{ errs.status }}
            </p>
          </div>
        </div>
        <div class="mb-3 grid grid-cols-2 gap-5">
          <div class="">
            <h-time-picker
              class=""
              label="Minimal Check-in"
              v-model="form.buffer_in"
            ></h-time-picker>
            <p class="text-sm text-red-500">
              {{ errs.buffer_in }}
            </p>
          </div>
          <div class="">
            <h-time-picker
              label="Maksimal Check-out"
              v-model="form.buffer_out"
            ></h-time-picker>
            <p class="text-sm text-red-500">
              {{ errs.buffer_out }}
            </p>
          </div>
        </div>

        <div class="mb-3">
          <h-area
            label="Shift Detail"
            placeholder="Ketik Detail Shift..."
            v-model="form.detail"
          ></h-area>
          <p class="text-sm text-red-500">
            {{ errs.detail }}
          </p>
        </div>
        <div>
          <h-time-picker
            label="Toleransi Keterlambatan"
            v-model="form.grace_checkin"
          ></h-time-picker>
          <p class="text-sm text-red-500">
            {{ errs.grace_checkin }}
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

interface CreateAttendanceShift {
  id?: string;
  company_id: number | null;
  code: string;
  name: string;
  shift_in: string;
  shift_out: string;
  is_overnight: boolean;
  status: boolean;
  detail?: string;
  buffer_in?: string;
  buffer_out?: string;
  grace_checkin?: string;
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

const form = reactive<CreateAttendanceShift>({
  id: "",
  company_id: null,
  code: "",
  name: "",
  shift_in: "",
  shift_out: "",
  is_overnight: false,
  status: false,
  detail: "",
  buffer_in: "",
  buffer_out: "",
  grace_checkin: ""
});

watch(
  () => props.pocket,
  (pocket) => {
    if (pocket) {
      form.id = pocket.id;
      form.shift_in = pocket.shift_in;
      form.shift_out = pocket.shift_out;
      form.is_overnight = pocket.is_overnight;
      form.status = pocket.status;
      form.detail = pocket.detail;
      form.buffer_in = pocket.buffer_in;
      form.buffer_out = pocket.buffer_out;
      form.grace_checkin = pocket.grace_checkin;
    } else {
      resetForm();
    }
  }
);

const resetForm = () => {
  form.id = "";
  form.company_id = null;
  form.name = "";
  form.shift_in = "";
  form.shift_out = "";
  form.is_overnight = false;
  form.status = false;
  form.detail = "";
  form.buffer_in = "";
  form.buffer_out = "";
  form.grace_checkin = "";
  company.selected = null;
  errs.company_id = "";
  errs.name = "";
  errs.shift_in = "";
  errs.shift_out = "";
  errs.is_overnight = "";
  errs.status = "";
  errs.detail = "";
  errs.buffer_in = "";
  errs.buffer_out = "";
  errs.grace_checkin = "";
};

const closeDialog = () => {
  resetForm();
  emit("close");
};

const errs = reactive<GenericObject>({
  company_id: "",
  name: "",
  shift_in: "",
  shift_out: "",
  is_overnight: "",
  status: "",
  detail: "",
  buffer_in: "",
  buffer_out: "",
  grace_checkin: ""
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
    path: `attendance-shift/${form.id ? "update" : "create"}`,
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
