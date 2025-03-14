<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[500px] flex flex-col relative"
      :class="`${form.type && form.color ? 'h-[67vh]' : 'h-[55vh]'}`"
    >
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">Create Violation</p>
        <icon-btn icon="x-mark" @click="emit('close')" />
      </div>
      <div class="py-3 px-6 flex-1 styled-scroll">
        <div class="mb-1.5">
          <h-area
            label="Pelanggaran"
            placeholder="Ketik Kondisi Peserta..."
            v-model="form.type"
          ></h-area>

          <h-errs :message="errs.type" />
        </div>
        <div v-if="form.type && form.color" class="mb-3">
          <h-label label="Preview" class=""></h-label>
          <div
            class="text-xs px-3 py-1.5 font-medium inline-flex rounded-lg bg-green-50"
            :style="{
              color: form.color,
              backgroundColor: form.sub_color
            }"
          >
            <p class="">
              {{ form.type }}
            </p>
          </div>
        </div>
        <div class="mb-3">
          <h-label label="Color" class=""></h-label>
          <input
            type="color"
            v-model="form.color"
            class="w-full h-10 p-0 border border-gray-300 rounded-md cursor-pointer"
          />
          <h-errs :message="errs.color" />
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
import { reactive, ref, watch } from "vue";

import useApi from "../../composables/use-api";
import { useFilterProperties, useToast } from "../../composables/use-helper";
import { GenericObject } from "../../interface/composable.interface";

interface CreateViolationMaster {
  id?: string;
  type: string;
  color: string;
  sub_color: string;
  status: string;
}

const props = defineProps({
  dialog: Boolean,
  pocket: null
});

const emit = defineEmits(["close", "refetch"]);

const api = new useApi();

const form = reactive<CreateViolationMaster>({
  id: "",
  type: "",
  color: "",
  sub_color: "",
  status: "ACTIVE"
});

const errs = reactive<GenericObject>({
  type: "",
  color: ""
});

const loading = ref<boolean>(false);

const postData = (): void => {
  loading.value = true;

  let body = useFilterProperties(form);

  let req = {
    path: `violation/${form.id ? "update" : "create"}`,
    body: body
  };

  api
    .post(req)
    .then((res) => {
      useToast(res.message, "success");
      emit("close");
      emit("refetch");
      loading.value = false;
      resetForm();
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

function lightenColor(hex: string, percent: number): string {
  // Hilangkan tanda '#' kalo ada
  hex = hex.replace(/^#/, "");
  // Konversi hex ke integer
  let num = parseInt(hex, 16);
  // Ambil komponen warna
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  // Tambahkan persentase ke tiap komponen menuju 255
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  // Konversi kembali ke hex dan pastikan 2 digit tiap warnanya
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const resetForm = () => {
  form.id = "";
  form.type = "";
  form.color = "";
  form.sub_color = "";
  errs.type = "";
  errs.color = "";
};

watch(
  () => props.pocket,
  (pocket) => {
    if (pocket) {
      form.id = pocket.id;
      form.type = pocket.type;
      form.color = pocket.color;
      form.sub_color = pocket.sub_color;
    } else {
      resetForm();
    }
  }
);

watch(
  () => form.color,
  (newColor) => {
    if (newColor) {
      form.sub_color = lightenColor(newColor, 95);
    }
  }
);
</script>
