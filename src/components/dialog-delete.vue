<template>
  <transition
    enter-from-class="opacity-0"
    leave-to-class="opacity-0 ease-in-out"
    enter-active-class="transition ease-in-out duration-300"
    leave-active-class="transition ease-in-out duration-300"
  >
    <div
      class="fixed w-screen h-screen inset-0 bg-gray-600 bg-opacity-50 top-0 left-0 z-20 flex justify-center items-center"
      role="dialog"
      v-if="modelValue"
      @click.self="emit('update:modelValue', false)"
    >
      <div
        class="rounded-lg flex items-center flex-col bg-white w-[350px] p-6 relative"
      >
        <div
          class="w-[80px] h-[80px] mb-3 bg-red-50 rounded-full flex justify-center items-center"
        >
          <mdicon name="delete" class="text-red-500 icon" size="50" />
        </div>
        <p class="text-center text-sm mb-7 mt-2 leading-6 px-3">
          {{ $t("delete_confirmation") }}
        </p>
        <div class="grid grid-cols-2 gap-2 w-full">
          <button
            class="py-2 w-full font-medium text-slate-900 border-solid border-2 border-gray-200 hover:bg-slate-500/20 active:bg-slate-500/50 rounded-lg outline-none"
            @click="emit('update:modelValue', false)"
          >
            Cancel
          </button>

          <button
            class="py-2 w-full font-medium text-white border-solid border-2 border-red-500 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-lg outline-none"
            @click="deleteData"
          >
            Delete
          </button>
        </div>
        <div
          v-if="loading"
          class="overlayed absolute w-full h-full bg-white top-0 left-0 rounded-lg flex justify-center items-center"
        >
          <spinner size="30px" />
          <p class="text-base text-center font-bold text-slate-700 ml-3">
            Loading...
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useApi from "../composables/use-api";
import { useToast } from "../composables/use-helper";

const props = defineProps({
  modelValue: Boolean,
  pocket: null
});
const emit = defineEmits(["update:modelValue", "refetch", "success"]);
const loading = ref(false);

const api = new useApi();
const deleteData = () => {
  loading.value = true;
  api
    .post({
      path: props.pocket.path,
      body: {}
    })
    .then((res) => {
      useToast(res.title ?? "Data Berhasil Terhapus!", "success");
      loading.value = false;
      emit("update:modelValue", false);
      emit("refetch");
      emit("success", res.data);
    })
    .catch((err) => {
      loading.value = false;
      useToast(err, "error");
    });
};
</script>

<style scoped>
@keyframes swing {
  20% {
    transform: rotate3d(0, 0, 1, 15deg);
  }

  40% {
    transform: rotate3d(0, 0, 1, -10deg);
  }

  60% {
    transform: rotate3d(0, 0, 1, 5deg);
  }

  80% {
    transform: rotate3d(0, 0, 1, -5deg);
  }

  to {
    transform: rotate3d(0, 0, 1, 0deg);
  }
}

.icon {
  animation: swing 1s ease-in-out;
}
</style>
