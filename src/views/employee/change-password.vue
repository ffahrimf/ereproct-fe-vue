<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[500px] flex flex-col h-[97vh] relative"
    >
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">Ganti Password</p>
        <icon-btn icon="x-mark" @click="closeDialog" />
      </div>
      <div class="py-3 px-6 flex-1 overflow-y-auto">
        <div class="mb-3 p-3 rounded-md border border-solid border-slate-200">
          <div class="flex items-center gap-3">
            <h-avatar :size="40" :src="pocket.photo"></h-avatar>
            <div class="flex flex-col">
              <h4 class="font-medium">{{ pocket.name }}</h4>
              <p class="text-xs">NIK: {{ pocket.nik }}</p>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <h-input
            label="New Password"
            placeholder="Ketik Password Baru..."
            v-model="form.password"
          ></h-input>
          <p class="text-sm text-red-500">{{ errs.password }}</p>
        </div>
        <div class="mb-3">
          <h-input
            label="Confirm Password"
            placeholder="Ketik Ulang Password Baru..."
            v-model="form.confirm_password"
          ></h-input>
          <p class="text-sm text-red-500">{{ errs.confirm_password }}</p>
        </div>
      </div>
      <div class="py-3 px-6 border-t flex items-center justify-end">
        <h-btn class="px-3 py-2" @click="postData">Submit</h-btn>
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
import { reactive, ref, watch } from "vue";
import useApi from "../../composables/use-api";
import { useFilterProperties, useToast } from "../../composables/use-helper";
import { GenericObject } from "../../interface/composable.interface";

interface ChangePassword {
  id?: string;
  password: string;
  confirm_password: string;
}

const emit = defineEmits(["close", "refetch"]);
const api = new useApi();
const loading = ref<boolean>(false);
const form = reactive<ChangePassword>({
  id: "",
  password: "",
  confirm_password: ""
});

const errs = reactive<GenericObject>({
  id: "",
  password: "",
  confirm_password: ""
});

const props = defineProps({
  dialog: Boolean,
  pocket: null
});

watch(
  () => props.pocket,
  (pocket) => {
    if (pocket) {
      form.id = pocket.id;
    } else {
      resetForm();
    }
  }
);

const closeDialog = () => {
  resetForm();
  emit("close");
};

const resetForm = () => {
  form.id = "";
  form.password = "";
  form.confirm_password = "";
  errs.id = "";
  errs.password = "";
  errs.confirm_password = "";
};

const postData = (): void => {
  if (form.password !== form.confirm_password) {
    errs.confirm_password = "Password dan konfirmasi password tidak sama.";
    return;
  }

  loading.value = true;

  const { confirm_password, ...body } = useFilterProperties(form);

  let req = {
    path: `user/update-password/`,
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
</script>
