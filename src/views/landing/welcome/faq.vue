<template>
  <section class="text-[#373D52] px-10 md:px-16 lg:px-24">
    <h1 class="text-center font-semibold text-2xl md:text-[38.4px]">
      Sering Ditanyakan
    </h1>
    <div
      v-if="faqs.length && !loading"
      class="flex flex-col md:grid md:grid-cols-2 gap-3 mt-10"
    >
      <div v-for="(faq, index) in faqs" :key="index">
        <button
          class="flex w-full rounded-full py-3 px-6 text-[#373D52] text-[11px] font-semibold border-2"
          :class="{
            'bg-[#F2F4F7] border-[#F2F4F7]': activeIndex === index,
            'bg-transparent border-black border-opacity-35':
              activeIndex !== index
          }"
          @click="toggleAccordion(index)"
        >
          <div class="flex justify-between items-center w-full">
            <p class="text-left xl:text-sm">{{ faq.question }}</p>
            <h-icon
              :name="activeIndex === index ? 'chevron-down' : 'chevron-right'"
              mode="mdi"
            ></h-icon>
          </div>
        </button>

        <h-accordion :isOpen="activeIndex === index">
          <div
            class="px-6 py-2 text-[#373D52] text-[10px] xl:text-sm leading-relaxed overflow-hidden"
          >
            {{ faq.answer }}
          </div>
        </h-accordion>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import useApi from "../../../composables/use-api";

const activeIndex = ref(null);
const toggleAccordion = (index: any) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

export interface FaqIF {
  id: number;
  question: string;
  answer: string;
}

const api = new useApi();
const faqs = ref<FaqIF[] | []>([]);
const loading = ref<Boolean>(false);

const getFAQ = (): void => {
  loading.value = true;
  api.get(`public/question-and-answer`).then((res) => {
    const raw: FaqIF[] | [] = res.list_data.data || [];
    faqs.value = raw;
  });
  loading.value = false;
};

onMounted(() => {
  getFAQ();
});
</script>
