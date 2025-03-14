<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[900px] flex flex-col h-[76vh] relative"
    >
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">Create research</p>
        <icon-btn icon="x-mark" @click="emit('close')" />
      </div>

      <div class="grid grid-cols-2 flex-1 styled-scroll">
        <div class="py-3 px-6">
          <div class="mb-3">
            <h-input
              label="Nama"
              placeholder="Masukkan nama..."
              v-model="form.name"
            ></h-input>

            <p
              class="text-[10px] ml-1 mt-1 text-red-500 whitespace-pre-wrap"
              v-html="errs.name"
            ></p>
          </div>
          <div class="mb-3">
            <h-input
              label="Username"
              placeholder="Masukkan username..."
              v-model="form.username"
            ></h-input>

            <p
              class="text-[10px] ml-1 mt-1 text-red-500 whitespace-pre-wrap"
              v-html="errs.username"
            ></p>
          </div>
          <div class="mb-3">
            <h-input
              label="Email"
              placeholder="Masukkan email..."
              v-model="form.email"
              :disabled="!!form.id"
            ></h-input>

            <p
              class="text-[10px] ml-1 mt-1 text-red-500 whitespace-pre-wrap"
              v-html="errs.email"
            ></p>
          </div>
          <div class="mb-3" v-if="!form.id">
            <h-input
              label="Password"
              placeholder="Masukkan password..."
              v-model="form.password"
            ></h-input>
            <p
              class="text-[10px] ml-1 mt-1 text-red-500 whitespace-pre-wrap"
              v-html="errs.password"
            ></p>
          </div>
        </div>
        <div class="py-3 px-6">
          <div class="mb-3" v-if="!form.id">
            <h-phone
              label="Nomor Telepon"
              placeholder="Ketik Disini..."
              v-model="form.phone_number"
            ></h-phone>
            <p class="text-[10px] ml-1 mt-1 text-red-500">
              {{ errs.phone_number }}
            </p>
          </div>
          <div class="mb-3">
            <h-date-picker
              label="Tanggal Lahir"
              placeholder="- Pilih Tanggal -"
              v-model="form.birth_date"
            ></h-date-picker>
            <p class="text-[10px] ml-1 mt-1 text-red-500">
              {{ errs.birth_date }}
            </p>
          </div>
          <div class="mb-3">
            <div>
              <h-label label="Jenis Kelamin" class="mb-3"></h-label>
              <div>
                <h-radio value="Laki-laki" v-model="form.gender"
                  >Laki-laki</h-radio
                >
                <h-radio value="Perempuan" v-model="form.gender"
                  >Perempuan</h-radio
                >
              </div>
              <h-errs :message="errs.gender" />
            </div>
          </div>
          <div class="flex items-center gap-5">
            <img
              v-if="photoPreview"
              :src="photoPreview"
              alt="Preview"
              class="w-20 h-20 object-cover rounded-md"
            />
            <div
              v-else
              class="bg-slate-100 flex justify-center items-center w-20 h-20 rounded-md"
            >
              <h-icon name="photo"></h-icon>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700 mb-1">Foto Profil</p>
              <button
                class="px-3 py-1.5 text-sm font-medium bg-slate-100 rounded-md border outline-none"
                onclick="document.getElementById('fileInput').click()"
              >
                Pilih File...
              </button>
              <h-input-file
                id="fileInput"
                class="hidden"
                @change="onFileChange"
                v-model="form.photo"
                :rule="'image/*'"
              />
            </div>
            <p class="text-sm text-red-500">{{ errs.photo }}</p>
          </div>
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
import { reactive, ref } from "vue";

import useApi from "../../../composables/use-api";
import { useToast } from "../../../composables/use-helper";
import { GenericObject } from "../../../interface/composable.interface";
import { useRoute } from "vue-router";

interface Createresearch {
  id?: string;
  uuid?: string;
  photo: File | null;
  name: string;
  username: string;
  password: string;
  email: string;
  phone_number: string;
  birth_date: Date | null;
  gender: string | null;
  status: number | null;
}

defineProps({
  dialog: Boolean
});

const emit = defineEmits(["close", "refetch"]);
const api = new useApi();
const photoPreview = ref<string | null>(null);
const loading = ref<boolean>(false);
const route = useRoute();
const uuid = ref(route.query?.uuid ?? "");

const form = reactive<Createresearch>({
  id: "",
  name: "",
  username: "",
  password: "",
  email: "",
  phone_number: "",
  birth_date: null,
  gender: "",
  status: 1,
  photo: null
});

const errs = reactive<GenericObject>({
  name: "",
  username: "",
  password: "",
  email: "",
  phone_number: "",
  birth_date: "",
  gender: "",
  status: "",
  photo: ""
});

const resetPhotoPreview = () => {
  photoPreview.value = null;
};

const onFileChange = (file: File | null) => {
  if (file) {
    const previewUrl = URL.createObjectURL(file);
    photoPreview.value = previewUrl;
    form.photo = file;
  } else {
    resetPhotoPreview();
    form.photo = null;
  }
};

const resetForm = () => {
  form.id = "";
  form.name = "";
  form.username = "";
  form.email = "";
  form.phone_number = "";
  form.gender = "";
  form.password = "";
  errs.name = "";
  errs.username = "";
  errs.email = "";
  errs.phone_number = "";
  errs.birth_date = "";
  errs.gender = "";
  form.photo = null;
};

const postData = (): void => {
  loading.value = true;

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
    path: `research/${uuid.value ? "update" : "create"}`,
    body: formData
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
</script>
