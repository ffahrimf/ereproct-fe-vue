<template>
  <div class="px-10 md:px-24 text-[#373D52]">
    <hr class="border-t border-black mt-10 mb-7" />
    <div class="flex flex-col md:grid md:grid-cols-2 gap-7 md:gap-0">
      <div class="flex flex-col space-y-6 text-xs xl:text-sm">
        <div>
          <img src="../assets/img/landing/logo-text.png" class="w-40" alt="" />
        </div>
        <p class="">
          Bermentor adalah platform konsultasi yang menghubungkan pelajar,
          mahasiswa, dan UMKM dengan mentor berpengalaman. Kami menawarkan
          panduan langkah demi langkah untuk membantu kamu mencapai tujuan
          akademik, profesional, atau bisnis dengan lebih mudah.
        </p>
      </div>
      <div class="flex justify-between ml-0 md:ml-10 lg:ml-20 xl:ml-40">
        <div class="flex flex-col space-y-3 md:space-y-9">
          <h3 class="font-semibold text-xl">Kategori</h3>
          <div class="flex flex-col space-y-1 text-xs xl:text-sm">
            <a
              class="hover:text-secondary transition duration-200 ease-in-out"
              href=""
              >Design</a
            >
            <a
              class="hover:text-secondary transition duration-200 ease-in-out"
              href=""
              >Marketing</a
            >
            <a
              class="hover:text-secondary transition duration-200 ease-in-out"
              href=""
              >Mobile Engineer</a
            >
            <a
              class="hover:text-secondary transition duration-200 ease-in-out"
              href=""
              >Sofware Engineer</a
            >
            <a
              class="hover:text-secondary transition duration-200 ease-in-out"
              href=""
              >UI/UX</a
            >
            <a
              class="hover:text-secondary transition duration-200 ease-in-out font-bold"
              href=""
              >Other</a
            >
          </div>
        </div>
        <div class="flex flex-col space-y-3 md:space-y-9">
          <h3 class="font-semibold text-xl">More</h3>
          <div class="flex flex-col space-y-1 text-xs xl:text-sm">
            <a
              class="hover:text-secondary transition duration-200 ease-in-out"
              href=""
              >About</a
            >
            <a
              class="hover:text-secondary transition duration-200 ease-in-out"
              href=""
              >Category</a
            >
            <a
              class="hover:text-secondary transition duration-200 ease-in-out"
              href=""
              >Find a Mentor</a
            >
            <a
              class="hover:text-secondary transition duration-200 ease-in-out font-medium"
              href=""
              >Become a Mentors</a
            >
          </div>
        </div>
      </div>
    </div>
    <div class="text-xs xl:text-sm grid mt-7 lg:mt-0 grid-cols-2">
      <div class="flex flex-col space-y-2">
        <a
          href="https://wa.me/6281297551925"
          target="_blank"
          class="flex items-center space-x-2"
        >
          <h-icon name="whatsapp" color="text-word" mode="mdi" size="20" />
          <p>(+62) 8123-4567-890</p>
        </a>
        <a
          href="mailto:bermentor@gmail.com"
          target="_blank"
          class="flex items-center space-x-2"
        >
          <h-icon name="email" color="text-word" mode="mdi" size="20" />
          <p>Contact@bermentor.com</p>
        </a>
      </div>

      <div class="flex flex-row items-end justify-end space-x-2">
        <a href=""
          ><h-icon name="facebook" color="text-word " mode="mdi" size="20"
        /></a>
        <a href="https://instagram.com/bermentor" target="_blank"
          ><h-icon name="instagram" color="text-word" mode="mdi" size="20"
        /></a>
        <a href=""><TikTok class="w-[20px] h-[20px]" /></a>
        <a href=""
          ><h-icon name="youtube" color="text-word" mode="mdi" size="20"
        /></a>
      </div>
    </div>
  </div>
  <div class="mt-7 bg-[#F2F4F7] text-center text-xs xl:text-sm py-5">
    Copyright 2025. Bermentor Corp. All rights reserved
  </div>
</template>

<script setup lang="ts">
import TikTok from "../components/icons/tiktok.vue";
</script>
