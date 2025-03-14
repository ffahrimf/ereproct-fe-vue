<template>
  <teleport to="body">
    <Transition
      enter-from-class="opacity-0"
      leave-to-class="opacity-0 ease-in-out"
      enter-active-class="transition ease-in-out duration-300"
      leave-active-class="transition ease-in-out duration-300"
    >
      <div
        class="fixed w-screen h-screen inset-0 bg-gray-600 bg-opacity-50 top-0 left-0 z-50 flex justify-center items-center"
        role="dialog"
        v-if="dialog"
        @click.self="closeDialog"
      >
        <div
          class="rounded-lg flex items-center flex-col bg-white w-[350px] p-6 relative"
        >
          <div
            class="w-[80px] h-[80px] mb-3 bg-indigo-50 rounded-full flex justify-center items-center"
          >
            <mdicon
              name="location-exit"
              class="text-[#0E1D54] icon rotate-180"
              size="50"
            />
          </div>
          <p class="text-center text-sm mb-7 mt-2 leading-6 px-3">
            {{ $t("logout_confirmation") }}
          </p>
          <div class="grid grid-cols-2 gap-2 w-full">
            <button
              class="py-1.5 w-full font-medium text-[#0E1D54] border-solid border-2 border-gray-200 hover:bg-slate-500/20 active:bg-slate-500/50 rounded-lg outline-none"
              @click="closeDialog"
            >
              Cancel
            </button>
            <button
              class="py-1.5 w-full font-medium text-white border-solid bg-[#0E1D54] hover:bg-[#0C1A4B] active:bg-[#0C1A4B] rounded-lg outline-none"
              @click="logout"
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
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRemoveStorage } from "../composables/use-helper";
import { mainStore } from "../store";
import { useRouter } from "vue-router";

defineProps<{
  dialog: boolean;
}>();

const emit = defineEmits<{
  (e: "update:dialog", value: boolean): void;
  (e: "close"): void;
}>();

const loading = ref(false);
const store = mainStore();
const router = useRouter();

const closeDialog = () => {
  emit("close");
};

const logout = () => {
  useRemoveStorage();
  store.profile = null;
  store.token = null;
  store.role = null;
  store.guid = null;
  router.push("/auth/login");
};
</script>

<style scoped>
@keyframes rotateLeft {
  from {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  to {
    transform: rotate3d(0, 0, 1, -180deg);
  }
}

.icon {
  animation: rotateLeft 1s ease-in-out;
}
</style>
