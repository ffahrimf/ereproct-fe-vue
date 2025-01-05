<template>
  <h4 class="bg-blue-50 py-2 px-5 text-blue-500 font-medium">
    Data Akun Karyawan
  </h4>
  <div class="flex flex-col gap-3 px-5">
    <div>
      <h-input
        label="Email"
        placeholder="Ketik Disini..."
        v-model="form.email"
        type="email"
      ></h-input>
      <p class="text-sm text-red-500">{{ errs.email }}</p>
    </div>
    <div v-if="!form.id">
      <h-input
        label="Password"
        v-model="form.password"
        placeholder="Ketik Disini..."
      ></h-input>
      <p class="text-sm text-red-500">{{ errs.password }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { form, errs } from "./setup";
</script>
