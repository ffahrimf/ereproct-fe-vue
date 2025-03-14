<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[500px] flex flex-col h-[36vh] relative"
    >
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">Create Role</p>
        <icon-btn icon="x-mark" @click="emit('close')" />
      </div>
      <div class="py-3 px-6 flex-1 styled-scroll">
        <div class="mb-3">
          <h-input
            label="Nama Role"
            placeholder="Ketik Nama Role..."
            v-model="form.name"
          ></h-input>

          <p
            class="text-sm text-red-500 whitespace-pre-wrap"
            v-html="errs.name"
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
import { reactive, ref } from "vue";

import useApi from "../../composables/use-api";
import { useFilterProperties, useToast } from "../../composables/use-helper";
import { GenericObject } from "../../interface/composable.interface";

interface CreateRole {
  name: string;
}

defineProps({
  dialog: Boolean
});

const emit = defineEmits(["close", "refetch"]);

const api = new useApi();

const form = reactive<CreateRole>({
  name: ""
});

const errs = reactive<GenericObject>({
  name: ""
});

const loading = ref<boolean>(false);
const postData = (): void => {
  loading.value = true;

  let body = useFilterProperties(form);

  let req = {
    path: `role/create`,
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
