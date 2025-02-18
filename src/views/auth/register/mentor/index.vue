<template>
  <LandingLayout>
    <div
      class="flex flex-col h-auto md:h-screen md:overflow-hidden lg:overflow-auto xl:h-auto xl:space-y-10 text-word"
    >
      <div
        class="flex justify-center flex-col space-y-3 md:space-y-7 mt-24 md:mt-32"
      >
        <h1 class="font-semibold text-3xl md:text-4xl text-center">
          Daftar<br class="md:hidden" />
          Sebagai Mentor
        </h1>
        <p class="px-7 md:px-0 md:text-xl xl:text-base text-center">
          Pimpin Generasi Berikutnya: Jadilah Mentor yang Menginspirasi,<br
            class="hidden md:block"
          />
          dan Bantu Orang Lain Mencapai Impian Mereka
        </p>
        <div class="mx-auto">
          <button
            @click="expand = !expand"
            class="bg-secondary mt-3 md:mt-0 rounded-full text-xs xl:text-sm font-bold active:scale-95 py-3 px-16 text-white border-4 border-white hover:border-[#FFC8AA] transition duration-1000 ease-out"
          >
            Melamar Sebagai Mentor
          </button>
        </div>
      </div>
      <div class="px-10 lg:px-20 h-full">
        <div
          class="mt-10 lg:mt-0 grid grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-16 h-full"
        >
          <div
            class="col-span-3 md:col-span-2 lg:col-span-3 order-2 lg:order-1 flex items-start lg:items-center justify-end"
          >
            <div class="bg-primary p-3 w-full lg:w-[168px] rounded-2xl">
              <div class="flex flex-col space-y-2">
                <div
                  class="flex items-center bg-white text-[#E24B4E] p-2 rounded-xl space-x-2"
                >
                  <h-icon name="briefcase" />
                  <p class="text-[15px] font-semibold">Karir</p>
                </div>
                <div
                  class="flex items-center bg-white p-2 text-[#5B4BE2] rounded-xl space-x-2"
                >
                  <h-icon name="academic-cap" />
                  <p class="text-[15px] font-semibold">Akademik</p>
                </div>
                <div
                  class="flex items-center bg-white p-2 text-[#E2794B] rounded-xl space-x-2"
                >
                  <h-icon name="building-storefront" />
                  <p class="text-[15px] font-semibold">UMKM</p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-span-6 md:col-span-12 lg:col-span-6 flex order-1 lg:order-2 justify-center items-center"
          >
            <img
              src="../../../../assets/img/landing/register/mentor-registration.jpg"
              class="rounded-3xl object-cover"
              alt=""
            />
          </div>
          <div
            class="col-span-3 md:col-span-2 lg:col-span-3 flex order-3 items-center md:items-start lg:items-center"
          >
            <div
              class="bg-white rounded-3xl lg:max-w-[168px] p-5 shadow-[0_0_14.7px_0] shadow-secondary"
            >
              <p class="font-semibold">Peningkatan</p>
              <p class="text-[10px]">Kemampuan</p>
              <div class="mt-2 flex items-end space-x-1">
                <div class="w-6 h-14 bg-[#95AAFF] rounded"></div>
                <div class="w-6 h-12 bg-[#95AAFF] rounded"></div>
                <div class="w-6 h-20 bg-[#566ECD] rounded"></div>
                <div class="w-6 h-16 bg-[#95AAFF] rounded"></div>
                <div class="w-6 h-[70px] bg-[#95AAFF] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LandingLayout>
  <Form :dialog="expand" @close="expand = false" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import LandingLayout from "../../../../components/landing-layout.vue";
import Form from "./form.vue";

const expand = ref<boolean>(false);
</script>
