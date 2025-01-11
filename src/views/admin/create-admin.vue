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

import useApi from "../../composables/use-api";
import { useFilterProperties, useToast } from "../../composables/use-helper";
import { mainStore } from "../../store";
import { AdminIF } from "./admin.interface";
import { GenericObject } from "../../interface/composable.interface";

interface CreateAdmin {
  id?: string;
  name: string;
  username: string;
  password: string;
  email: string;
  role_id?: number | null;
}

defineProps({
  dialog: Boolean
});

const emit = defineEmits(["close", "refetch"]);

const api = new useApi();

const form = reactive<CreateAdmin>({
  id: "",
  name: "",
  username: "",
  password: "",
  email: ""
});

const errs = reactive<GenericObject>({
  name: "",
  username: "",
  password: "",
  email: ""
});

const loading = ref<boolean>(false);
const postData = (): void => {
  loading.value = true;
  const adminRole: number = 2;
  form["role_id"] = adminRole;

  let body = useFilterProperties(form);

  let req = {
    path: `user/${form.id ? "update" : "create"}`,
    body: body
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
</script>
