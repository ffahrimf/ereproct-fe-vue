<template>
  <LandingLayout>
    <div class="flex flex-col space-y-10 mt-32">
      <About />
      <div class="flex flex-col lg:grid lg:grid-cols-2 gap-10 px-10 md:px-20">
        <div class="flex flex-col space-y-5 justify-center text-[#373D52]">
          <h1 class="font-semibold text-3xl md:text-4xl">
            Visi Misi Bermentor
          </h1>
          <p
            class="text-justify text-xs md:text-base lg:text-xs xl:text-base leading-relaxed"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus
            nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum
            tellus elit sed risus. Maecenas eget condimentum velit, sit amet
            feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
            conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus
            enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
            Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
            lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
            elementum tellus.
          </p>
        </div>
        <img
          src="../../assets/img/landing/welcome/youtube.png"
          alt=""
          class="rounded-3xl"
        />
      </div>
      <div class="flex flex-col lg:grid lg:grid-cols-2 gap-10 px-10 md:px-20">
        <div class="flex flex-col space-y-5 text-word">
          <h1 class="font-semibold">Hubungi Kami</h1>
          <p
            class="text-justify text-xs md:text-base lg:text-xs xl:text-base leading-relaxed"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus.
          </p>
          <div class="relative overflow-hidden rounded-3xl">
            <img src="../../assets/img/landing/about/maps.jpg" alt="" />
          </div>
        </div>
        <div class="flex items-end">
          <div class="flex flex-col w-full space-y-3">
            <h-input label="Nama" placeholder="Nama"></h-input>
            <h-input label="Email" placeholder="Masukkan Email Anda"></h-input>
            <h-area
              label="Pesan"
              placeholder="Tuliskan pesan Anda"
              row="5"
            ></h-area>
            <button
              class="py-3 bg-secondary text-white active:scale-95 border-4 border-white hover:border-[#FFC8AA] transition duration-500 ease-in-out rounded-full text-xs md:text-base lg:text-xs xl:text-base font-normal"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  </LandingLayout>
</template>

<script setup lang="ts">
import LandingLayout from "../../components/landing-layout.vue";
import About from "../landing/welcome/about.vue";
</script>
