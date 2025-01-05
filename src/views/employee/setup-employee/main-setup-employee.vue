<template>
  <div class="flex p-3">
    <div class="flex flex-col gap-3 w-full">
      <div class="flex bg-white p-3 rounded-md justify-between">
        <h3 class="text-lg">{{ uuid ? "Edit" : "Tambah" }} Data Karyawan</h3>
      </div>

      <div class="flex items-center gap-1">
        <template v-for="(menu, index) in menus" :key="menu.title">
          <button
            class="bg-slate-50 px-3 py-2 rounded-3xl"
            :class="
              menus.findIndex((m) => m.title === currentTab) >= index
                ? 'border border-blue-200 text-blue-500'
                : 'border border-gray-300 text-gray-500'
            "
            @click="changeTab(menu.title)"
          >
            <div class="flex items-center gap-2">
              <h-icon :name="menu.icon" size="15" />
              <p class="text-xs">{{ menu.title }}</p>
            </div>
          </button>
          <h-icon
            v-if="index < menus.length - 1"
            name="chevron-right"
            size="15"
          />
        </template>
      </div>

      <div class="flex flex-col bg-white py-3 rounded-lg gap-5">
        <keep-alive>
          <component :is="currentComponent" />
        </keep-alive>
        <div class="flex items-center justify-end gap-3 px-5">
          <button
            v-if="currentTab !== menus[0].title"
            class="bg-slate-100 hover:bg-slate-200 text-primary transition duration-300 ease-in-out rounded-md text-sm py-2.5 px-6 active:scale-95 border border-slate-200"
            @click="goBack"
          >
            Back
          </button>
          <h-btn class="py-2.5 px-6" @click="goNext">Next</h-btn>
        </div>
        <h-overlay
          :value="loading"
          absolute
          class="flex items-center justify-center gap-3"
        >
          <spinner />
        </h-overlay>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import DataDiri from "./data-diri.vue";
import DataKepegawaian from "./data-kepegawaian.vue";
import DataAkun from "./data-akun.vue";
import { mainStore } from "../../../store";
import { setupErrVar, form, resetForm, resetErrVar } from "./setup";
import { useToast } from "../../../composables/use-helper";
import useApi from "../../../composables/use-api";
import { errs } from "./setup";
import { useRoute, useRouter } from "vue-router";
import { CreateEmployee } from "../employee.interface";
import {
  company_branch,
  company_level,
  company_organization,
  company_title,
  current_city,
  current_province,
  identity_city,
  identity_province,
  usePhotoStore
} from "../select";

const route = useRoute();
const router = useRouter();
const uuid = ref(route.query?.uuid ?? "");
const currentTab = ref("Data Diri");
const menus = ref([
  {
    title: "Data Diri",
    icon: "user"
  },
  {
    title: "Data Kepegawaian",
    icon: "identification"
  },
  {
    title: "Data Akun",
    icon: "user-circle"
  }
]);
const currentComponent = computed(() => {
  switch (currentTab.value) {
    case "Data Diri":
      return DataDiri;
    case "Data Kepegawaian":
      return DataKepegawaian;
    case "Data Akun":
      return DataAkun;
    default:
      return DataDiri;
  }
});

const store = mainStore();
const api = new useApi();
const emit = defineEmits(["close", "refetch"]);
const loading = ref<boolean>(false);
const employee = ref(null);
const photoStore = usePhotoStore();

const changeTab = (title: any) => {
  currentTab.value = title;
};

const goBack = () => {
  const currentIndex = menus.value.findIndex(
    (menu) => menu.title === currentTab.value
  );
  if (currentIndex > 0) {
    currentTab.value = menus.value[currentIndex - 1].title;
  }
};

const goNext = () => {
  const currentIndex = menus.value.findIndex(
    (menu) => menu.title === currentTab.value
  );

  if (currentIndex === menus.value.length - 1) {
    postData();
  } else {
    currentTab.value = menus.value[currentIndex + 1].title;
  }
};

const getPassword = async (userId: string): Promise<string | null> => {
  const res = await api.get(`user?id=${userId}`);
  const user = res.data?.items[0];
  return user.password;
};

const fetchData = async (): Promise<void> => {
  loading.value = true;
  const res = await api.get(`employee?uuid=${uuid.value}`);
  console.log(res);
  const raw = res.data?.items[0] ?? null;
  employee.value = raw;
  if (raw) {
    (Object.keys(form) as Array<keyof CreateEmployee>)
      .filter((key) => key in raw)
      .forEach((key) => {
        form[key] = raw[key as keyof CreateEmployee]!;
      });

    identity_province.selected = raw.identity_province;
    form.identity_province = identity_province.selected?.id;
    identity_city.selected = raw.identity_city;
    form.identity_city = identity_city.selected?.id;
    current_province.selected = raw.current_province;
    form.current_province = current_province.selected?.id;
    current_city.selected = raw.current_city;
    form.current_city = current_city.selected?.id;

    company_branch.selected = raw.company_branch;
    form.company_branch_id = company_branch.selected?.id;
    company_organization.selected = raw.company_organization;
    form.company_organization_id = company_organization.selected?.id;
    company_level.selected = raw.company_level;
    form.company_level_id = company_level.selected?.id;
    company_title.selected = raw.company_title;
    form.company_title_id = company_title.selected?.id;

    photoStore.photoPreview = raw.thumbnailDecode;
    const password = await getPassword(raw.user.id);
    form.password = password ?? null;
  }
  loading.value = false;
};

const postData = (): void => {
  loading.value = true;
  resetErrVar();
  if (store.role === "ADMIN") {
    form["company_id"] = store.company ? parseInt(store.company.id) : null;
  }
  form.is_same_as_identity = form.is_same_as_identity ? 1 : 0;
  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    if (value != null && key !== "photoPreview") {
      if (key === "photo" && value instanceof File) {
        formData.append("file", value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  const req = {
    path: `employee/${uuid.value ? "update" : "create"}`,
    body: formData
  };
  api
    .post(req)
    .then((res) => {
      useToast(res.message, "success");
      emit("close");
      emit("refetch");
      router.push("/employee-list");
    })
    .catch((err) => {
      useToast(err.message, "error");
      let req = err?.errors;
      if (req) {
        for (let i in req) {
          errs[i] = req[i][0];
        }
      }
      loading.value = false;
    });
};

onMounted(() => {
  setupErrVar();
  if (uuid.value) {
    fetchData();
  } else {
    resetForm();
  }
});
</script>
