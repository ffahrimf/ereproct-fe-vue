<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[500px] flex flex-col h-[97vh] relative"
    >
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">
          {{ form.id ? "Update Attendance Location Setting" : "Create Attendance Location Setting" }}
        </p>
        <icon-btn icon="x-mark" @click="closeDialog" />
      </div>
      <div class="py-3 px-6 flex-1 overflow-y-auto">
        <div class="mb-3">
          <label class="text-sm font-medium">Penempatan</label>
          <div class="flex items-center space-x-4">
            <h-radio
              v-for="option in ['Pusat', 'Cabang']"
              :key="option"
              v-model="placement"
              :value="option"
              :name="'placement'"
              @change="onPlacementChange"
            >
              {{ option }}
            </h-radio>
          </div>
        </div>

        <div v-if="placement === 'Cabang'" class="mb-3">
          <h-select
            label="Company Branch"
            placeholder="Pilih Perusahaan Cabang"
            :items="company_branch.list"
            item-name="name"
            item-value="id"
            return-object
            :loading="company_branch.loading"
            v-model="company_branch.selected"
            @change="onCompanyBranchChange"
          >
            <template #search>
              <h-search
                class="mb-1"
                v-model="company_branch.q.name"
                placeholder="Ketik untuk mencari..."
                @search="getCompanyBranch"
              ></h-search>
            </template>
          </h-select>
          <p class="text-sm text-red-500">{{ errs.company_branch_id }}</p>
        </div>

        <div class="mb-3">
          <h-input
            label="Longitude"
            placeholder="Ketik Longitude..."
            v-model="form.longitude"
          ></h-input>
          <p class="text-sm text-red-500">{{ errs.longitude }}</p>
        </div>

        <div class="mb-3">
          <h-input
            label="Latitude"
            placeholder="Ketik Latitude..."
            v-model="form.latitude"
          ></h-input>
          <p class="text-sm text-red-500">{{ errs.latitude }}</p>
        </div>

        <div class="mb-3">
          <h-input
            label="Radius"
            placeholder="Ketik Radius..."
            v-model="form.radius"
          ></h-input>
          <p class="text-sm text-red-500">{{ errs.radius }}</p>
        </div>

        <div class="mb-3 grid grid-cols-2 gap-5">
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
            <p class="text-sm text-red-500">{{ errs.status }}</p>
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
import { CompanyBranchIF } from "../../../interface/area.interface"; 
import { mainStore } from "../../../store";
import useApi from "../../../composables/use-api";
import { useQuery, useToast } from "../../../composables/use-helper";
import { GenericObject } from "../../../interface/composable.interface";

interface CreateAttendanceLocationSetting {
  id?: string;
  company_id: number | null;
  company_branch_id: number | null;
  longitude: string;
  latitude: string;
  radius: string;
  status: boolean;
}

interface DataCompanyBranchIF {
  list: Array<CompanyBranchIF> | [];
  loading: boolean;
  selected: CompanyBranchIF | null;
  find: string;
  q: any;
}

const props = defineProps({
  dialog: Boolean,
  pocket: null,
});

const emit = defineEmits(["close", "refetch"]);

const api = new useApi();

const store = mainStore();

const form = reactive<CreateAttendanceLocationSetting>({
  id: "",
  company_id: null,
  company_branch_id: null,
  longitude: "",
  latitude: "",
  radius: "",
  status: true,
});

const placement = ref("Pusat");

const onPlacementChange = async () => {
  if (store.role === "ADMIN" && placement.value === "Pusat") {
    form.company_id = store.company ? parseInt(store.company.id) : null;
    form.company_branch_id = null;
    company_branch.selected = null;
  } else if (placement.value === "Cabang") {
    form.company_id = store.company ? parseInt(store.company.id) : null;
    if (!company_branch.list.length) {
      await getCompanyBranch();
    }
  }
};

const onCompanyBranchChange = () => {
  if (company_branch.selected) {
    form.company_branch_id = company_branch.selected.id;
    errs.company_branch_id = ""; 
  } else {
    form.company_branch_id = null;
  }
};

watch(
  () => props.pocket,
  async (pocket) => {
    if (pocket) {
      form.id = pocket.id;
      form.longitude = pocket.longitude;
      form.latitude = pocket.latitude;
      form.radius = pocket.radius;
      form.status = pocket.status;

      if (pocket.company_branch) {
        placement.value = 'Cabang';
        form.company_branch_id = pocket.company_branch.id;

        await getCompanyBranch();

        const selectedBranch = company_branch.list.find(
          (branch) => branch.id === pocket.company_branch.id
        );

        if (selectedBranch) {
          company_branch.selected = selectedBranch;
        } else {
          company_branch.selected = null;
        }

      } else {
        placement.value = 'Pusat';
        form.company_branch_id = null;
        company_branch.selected = null;       
      }
    } else {
      resetForm();
    }
  }
);

const resetForm = () => {
  form.id = "";
  form.company_id = null;
  form.company_branch_id = null;
  form.longitude = "";
  form.latitude = "";
  form.radius = "";
  form.status = true;
  errs.company_id = "";
  company_branch.selected = null;
  errs.company_branch_id = "";
  errs.longitude = "";
  errs.latitude = "";
  errs.radius = "";
  errs.status = "";
  placement.value = "Pusat";
};

const closeDialog = () => {
  resetForm();
  emit("close");
};

const errs = reactive<GenericObject>({
  company_id: "",
  company_branch: "",
  longitude: "",
  latitude: "",
  radius: "",
  status: "",
});

const company_branch = reactive<DataCompanyBranchIF>({
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

const getCompanyBranch = async (): Promise<void> => {
  company_branch.loading = true;
  try {
    const companyId = store.company ? parseInt(store.company.id) : null;
    const queryParams = {
      ...company_branch.q,
      company_id: companyId,
    };

    const query = `company-branch?${useQuery(queryParams)}`;

    const res = await api.get(query);
    const raw: Array<CompanyBranchIF> = res.data.items;

    company_branch.list =
      company_branch.q.page > 1
        ? [...company_branch.list, ...raw]
        : raw;
  } finally {
    company_branch.loading = false;
  }
};

const loading = ref<boolean>(false);

const postData = async (): Promise<void> => {
  loading.value = true;

  if (placement.value === "Cabang" && !company_branch.selected) {
    errs.company_branch_id = "Harap pilih cabang perusahaan terlebih dahulu.";
    loading.value = false;
    return;
  }

  if (placement.value === "Pusat") {
    if (store.role === "ADMIN") {
      form.company_id = store.company ? parseInt(store.company.id) : null;
      form.company_branch_id = null;
    }
  } else if (placement.value === "Cabang" && store.role === "ADMIN") {
    form.company_id = store.company ? parseInt(store.company.id) : null;
    form.company_branch_id = company_branch.selected
      ? company_branch.selected.id
      : null;
  }

  let req = {
    path: `attendance-location-setting/${form.id ? "update" : "create"}`,
    body: form,
  };

  try {
    const res = await api.post(req);
    useToast(res.message, "success");
    emit("close");
    emit("refetch");
    resetForm();
  } catch (err) {
    handleErrorMessage(err);
  } finally {
    loading.value = false;
  }
};

const handleErrorMessage = (err: any): void => {
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
  if (!form.id) {
    if (placement.value === "Cabang") {
      getCompanyBranch();
    }
    if (store.role === "ADMIN" && placement.value === "Pusat") {
      form.company_id = store.company ? parseInt(store.company.id) : null;
    }
  }
});
</script>
