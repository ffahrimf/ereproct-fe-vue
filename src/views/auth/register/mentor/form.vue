<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-3xl shadow-lg border-2 border-primary w-[300px] md:w-[480px] flex flex-col relative p-4"
    >
      <icon-btn
        icon="x-mark"
        color="text-gray-500"
        @click="emit('close')"
        class="absolute top-2.5 end-3 inline-flex hover:bg-slate-50 active:bg-transparent items-center justify-center"
      />
      <div class="flex flex-col space-y-10">
        <div>
          <h5 class="font-bold text-xl text-center mt-6">
            Pastikan Akun Anda Terdaftar
          </h5>
          <p class="lg:text-[11px] text-center">
            Setelah Pendaftaran Akan Dilanjutkan <br />Ke Lamaran Sebagai Mentor
          </p>
        </div>
        <div class="flex flex-col space-y-4 px-16">
          <button
            class="bg-secondary mt-3 md:mt-0 rounded-full text-xs font-bold active:scale-95 py-3 text-white border-4 border-white hover:border-[#FFC8AA] transition duration-1000 ease-out"
          >
            Daftar Dengan Email
          </button>
          <button
            class="border-2 flex justify-center space-x-2 items-center border-secondary hover:border-[#FFC8AA] text-xs font-semibold active:scale-95 rounded-full py-2 text-secondary bg-transparent transition duration-1000 ease-out"
          >
            <Google class="w-5 h-5" />
            <span>Daftar Dengan Google</span>
          </button>
        </div>
      </div>
      <div class="py-4 overflow-y-auto"></div>

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
import { ref } from "vue";
import Google from "../../../../components/icons/google.vue";
const emit = defineEmits(["close", "refetch"]);
const loading = ref<boolean>(false);

defineProps({
  dialog: Boolean
});
</script>
