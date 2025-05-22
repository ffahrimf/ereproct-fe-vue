<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg max-h-[95vh] max-w-[200vh] flex flex-col relative styled-scroll"
    >
      <icon-btn
        icon="x-mark"
        @click="emit('close')"
        class="absolute top-3 right-3"
      />
      <div class="flex p-3 px-10 mt-[30px]">
        <div class="flex gap-3 w-full items-start">
          <div class="w-7/12 flex flex-col gap-3">
            <div class="flex flex-col bg-white pt-3 pb-5 px-4 rounded-md">
              <div>
                <p class="text-xs font-medium text-primary">Report</p>
                <p class="text-lg font-semibold font-inter">EST120125</p>
              </div>

              <div class="grid grid-cols-12 gap-5 font-inter">
                <div
                  class="p-3 col-span-8 flex flex-row gap-5 rounded-xl mt-5 border border-gray-200"
                >
                  <div class="flex flex-col font-medium">
                    <p class="text-sm">Tanggal</p>
                    <p class="text-xs text-gray-500 font-dm-sans">
                      April 10, 2025
                    </p>
                  </div>
                  <div class="flex items-center">
                    <hr class="rotate-90 border border-gray-200 w-9" />
                  </div>
                  <div class="flex flex-col font-medium">
                    <p class="text-sm">Jam Tes</p>
                    <p class="text-xs text-gray-500 font-dm-sans">
                      09:00 - 12:00
                    </p>
                  </div>
                </div>
                <div
                  class="p-3 col-span-4 flex flex-row gap-5 rounded-xl mt-5 border border-gray-200"
                >
                  <div class="flex flex-col font-medium">
                    <p>5</p>
                    <p class="text-xs text-gray-500 font-dm-sans">
                      Jumlah Peserta
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5">
                <div class="flex flex-col gap-5">
                  <div class="flex flex-row gap-5">
                    <div
                      class="py-2 px-3 bg-white border border-gray-200 rounded-lg grow"
                    >
                      <p
                        class="block text-xs text-gray-500 font-medium font-dm-sans"
                      >
                        Peserta Login
                      </p>
                      <p class="text-gray-800">8</p>
                    </div>
                    <div
                      class="py-2 px-3 bg-white border border-gray-200 rounded-lg grow"
                    >
                      <p
                        class="block text-xs text-gray-500 font-medium font-dm-sans"
                      >
                        Peserta Hanya Login
                      </p>
                      <p class="text-gray-800">8</p>
                    </div>
                  </div>
                  <div class="flex flex-row gap-5">
                    <div
                      class="py-2 px-3 bg-white border border-gray-200 rounded-lg grow"
                    >
                      <p
                        class="block text-xs text-gray-500 font-medium font-dm-sans"
                      >
                        Peserta Selesai
                      </p>
                      <p class="text-gray-800">8</p>
                    </div>
                    <div
                      class="py-2 px-3 bg-white border border-gray-200 rounded-lg grow"
                    >
                      <p
                        class="block text-xs text-gray-500 font-medium font-dm-sans"
                      >
                        Peserta Tidak Selesai
                      </p>
                      <p class="text-gray-800">8</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-md bg-white pt-3 pb-5 px-4 min-h-[90px] w-full">
              <div class="flex">
                <p class="text-xs font-medium text-gray-500 font-dm-sans">
                  Indikasi Pelanggaran
                </p>
              </div>
              <hr class="mt-2" />
              <!-- <div
                class="mt-3 text-[11px] border border-gray-200 rounded-lg flex flex-col gap-1 p-3"
              >
                <p class="font-medium">Deni Nuriman</p>
                <div class="grid grid-cols-12 w-full  text-gray-700">
                  <p class="col-span-4">Kejadian</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Peserta terlihat menggunakan HP saat tes.</p>
                  </div>
                </div>
                <div class="grid grid-cols-12 w-full  text-gray-700">
                  <p class="col-span-4">Tindaklanjut</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Memperingati peserta via chat</p>
                  </div>
                </div>
                <div class="grid grid-cols-12 w-full  text-gray-700">
                  <p class="col-span-4">Respon Peserta</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Peseta menerima pesan dan menyimpan HP</p>
                  </div>
                </div>
                <div class="grid grid-cols-12 w-full  text-gray-700">
                  <p class="col-span-4">Keterangan</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Peserta melanjutkan tes</p>
                  </div>
                </div>
              </div> -->
            </div>
          </div>

          <div class="flex flex-col gap-3 w-5/12">
            <div class="bg-white rounded-md pt-3 pb-5 px-4">
              <p class="text-xl font-medium">5</p>

              <div class="flex">
                <p class="text-xs font-medium text-gray-500 font-dm-sans">
                  Peserta Tidak Login
                </p>
              </div>

              <div class="mt-3 border border-gray-200 rounded-lg flex p-3">
                <p class="text-xs">Angga</p>
              </div>
            </div>

            <div class="bg-white rounded-md min-h-[225px] pt-3 pb-5 px-4">
              <div class="flex">
                <p class="text-xs font-medium text-gray-500 font-dm-sans">
                  Kendala Peserta
                </p>
              </div>
              <hr class="mt-2" />
              <div
                class="mt-3 text-[11px] border border-gray-200 rounded-lg flex flex-col gap-1 p-3"
              >
                <p class="font-medium">Fajar Akbar</p>
                <div class="grid grid-cols-12 w-full text-gray-700">
                  <p class="col-span-4">Kejadian</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Kamera Peserta Rusak</p>
                  </div>
                </div>
                <div class="grid grid-cols-12 w-full text-gray-700">
                  <p class="col-span-4">Tindaklanjut</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Menyiapkan Zoom Room</p>
                  </div>
                </div>
                <div class="grid grid-cols-12 w-full text-gray-700">
                  <p class="col-span-4">Respon Peserta</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Peserta memasuki zoom</p>
                  </div>
                </div>
                <div class="grid grid-cols-12 w-full text-gray-700">
                  <p class="col-span-4">Keterangan</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Peserta melanjutkan tes</p>
                  </div>
                </div>
              </div>
              <!-- <div
                class="mt-3 text-[11px] border border-gray-200 rounded-lg flex flex-col gap-1 p-3"
              >
                <p class="font-medium">Deni Nuriman</p>
                <div class="grid grid-cols-12 w-full text-gray-700">
                  <p class="col-span-4">Kejadian</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Kamera Peserta Rusak</p>
                  </div>
                </div>
                <div class="grid grid-cols-12 w-full text-gray-700">
                  <p class="col-span-4">Tindaklanjut</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Menyiapkan Zoom Room</p>
                  </div>
                </div>
                <div class="grid grid-cols-12 w-full text-gray-700">
                  <p class="col-span-4">Respon Peserta</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Peserta memasuki zoom</p>
                  </div>
                </div>
                <div class="grid grid-cols-12 w-full text-gray-700">
                  <p class="col-span-4">Keterangan</p>
                  <p class="col-span-1">:</p>
                  <div class="col-span-7">
                    <p>Peserta melanjutkan tes</p>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end px-14 mb-10">
        <button
          class="px-3 py-2 text-xs font-medium rounded-lg bg-primary text-white active:scale-95"
        >
          Confirm Report
        </button>
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
  level: string;
  condition: string;
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
  level: "",
  condition: "",
  color: "",
  sub_color: "",
  status: "ACTIVE"
});

const errs = reactive<GenericObject>({
  level: "",
  condition: "",
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
  form.level = "";
  form.condition = "";
  form.color = "";
  form.sub_color = "";
  errs.level = "";
  errs.condition = "";
  errs.color = "";
};

watch(
  () => props.pocket,
  (pocket) => {
    if (pocket) {
      form.id = pocket.id;
      form.level = pocket.level;
      form.condition = pocket.condition;
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
