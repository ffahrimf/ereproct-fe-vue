<template>
  <h-dialog :dialog="dialog">
    <div
      class="rounded-lg flex items-center flex-col bg-white w-[350px] p-6 relative"
    >
      <div
        class="w-[80px] h-[80px] mb-3 bg-indigo-50 rounded-full flex justify-center items-center"
      >
        <mdicon
          name="cellphone-link-off"
          class="text-[#0E1D54] icon"
          size="50"
        />
      </div>
      <p class="text-center text-sm mb-7 mt-2 leading-6 px-3">
        Apakah anda yakin event {{ props.pocket.value.code }} tidak memerlukan
        proctoring?
      </p>
      <div class="grid grid-cols-2 gap-2 w-full">
        <button
          class="py-1.5 w-full font-medium text-[#0E1D54] border-solid border-2 border-gray-200 hover:bg-slate-500/20 active:bg-slate-500/50 rounded-lg outline-none"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          class="py-1.5 w-full font-medium text-white border-solid bg-[#0E1D54] hover:bg-[#0C1A4B] active:bg-[#0C1A4B] rounded-lg outline-none"
          @click="unassignedEvent"
        >
          Confirm
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
  </h-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useApi from "../../composables/use-api";
import { useToast } from "../../composables/use-helper";

const props = defineProps({
  dialog: Boolean,
  pocket: null
});

const emit = defineEmits(["close", "refetch"]);
const api = new useApi();
const loading = ref(false);

const unassignedEvent = (): void => {
  loading.value = true;

  const req = {
    path: props.pocket.path,
    body: { id: props.pocket.value.id, status: "UNASSIGNED" }
  };

  api
    .post(req)
    .then(() => {
      useToast("Data berhasil diubah", "success");
      emit("close");
      emit("refetch");
      loading.value = false;
    })
    .catch((err) => {
      useToast(err.message, "error");
      loading.value = false;
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
