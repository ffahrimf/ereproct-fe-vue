<template>
  <div class="rounded-md bg-white pt-3 pb-5 px-4 min-h-[90px] w-full">
    <div class="flex items-center justify-between">
      <p class="text-xs font-medium text-gray-500 font-dm-sans">
        Indikasi Pelanggaran
      </p>
      <button class="p-0.5 border border-gray-200 rounded-md">
        <h-icon name="plus" size="15" color="text-gray-700" />
      </button>
    </div>
    <hr class="mt-2" />
    <div
      class="mt-3 text-[11px] border border-gray-200 rounded-lg flex flex-col gap-1 p-3"
    >
      <p class="font-medium">Deni Nuriman</p>
      <div class="grid grid-cols-12 w-full h-4 text-gray-700">
        <p class="col-span-4">Kejadian</p>
        <p class="col-span-1">:</p>
        <div class="col-span-7">
          <p>Peserta terlihat menggunakan HP saat proses tes.</p>
        </div>
      </div>
      <div class="grid grid-cols-12 w-full h-4 text-gray-700">
        <p class="col-span-4">Tindaklanjut</p>
        <p class="col-span-1">:</p>
        <div class="col-span-7">
          <p>Memperingati peserta via chat</p>
        </div>
      </div>
      <div class="grid grid-cols-12 w-full h-4 text-gray-700">
        <p class="col-span-4">Respon Peserta</p>
        <p class="col-span-1">:</p>
        <div class="col-span-7">
          <p>Peseta menerima pesan dan menyimpan HP</p>
        </div>
      </div>
      <div class="grid grid-cols-12 w-full h-4 text-gray-700">
        <p class="col-span-4">Keterangan</p>
        <p class="col-span-1">:</p>
        <div class="col-span-7">
          <p>Peserta melanjutkan tes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
