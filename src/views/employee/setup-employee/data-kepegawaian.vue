<template>
  <h4 class="bg-blue-50 py-2 px-5 text-blue-500 font-medium">
    Data Kepegawaian
  </h4>
  <div class="flex flex-col gap-3 px-5">
    <div class="grid grid-cols-2 items-center gap-5">
      <div>
        <h-date-picker
          label="Tanggal Mulai Bekerja"
          placeholder="- Pilih Tanggal -"
          v-model="form.start_working"
        ></h-date-picker>
        <p class="text-sm text-red-500">{{ errs.start_working }}</p>
      </div>
      <div>
        <h-date-picker
          label="Tanggal Selesai Bekerja"
          placeholder="- Pilih Tanggal -"
          v-model="form.end_working"
        ></h-date-picker>
      </div>
    </div>
    <div class="grid grid-cols-2 items-center gap-5">
      <h-select
        label="Cabang Perusahaan"
        placeholder="Pilih Cabang"
        :items="company_branch.list"
        item-name="name"
        item-value="id"
        return-object
        :loading="company_branch.loading"
        v-model="company_branch.selected"
        @change="onCompanyBranchChange"
      >
        <template #search>
          <h-search
            class="mb-1"
            v-model="company_branch.q.name"
            @keyup="company_branch.loading = true"
            placeholder="Ketik untuk mencari..."
            @search="getCompanyBranch"
          ></h-search>
        </template>
      </h-select>
      <h-select
        label="Organization"
        placeholder="Pilih Organization"
        :items="company_organization.list"
        item-name="name"
        item-value="id"
        return-object
        :loading="company_organization.loading"
        v-model="company_organization.selected"
        @change="onCompanyOrganizationChange"
      >
        <template #search>
          <h-search
            class="mb-1"
            v-model="company_organization.q.name"
            @keyup="company_organization.loading = true"
            placeholder="Ketik untuk mencari..."
            @search="getCompanyOrganization"
          ></h-search>
        </template>
      </h-select>
    </div>
    <div class="grid grid-cols-2 items-center gap-5">
      <h-select
        label="Title"
        placeholder="Pilih Title"
        :items="company_title.list"
        item-name="name"
        item-value="id"
        return-object
        :loading="company_title.loading"
        v-model="company_title.selected"
        @change="onCompanyTitleChange"
      >
        <template #search>
          <h-search
            class="mb-1"
            v-model="company_title.q.name"
            @keyup="company_title.loading = true"
            placeholder="Ketik untuk mencari..."
            @search="getCompanyTitle"
          ></h-search>
        </template>
      </h-select>
      <h-select
        label="Level"
        placeholder="Pilih Level"
        :items="company_level.list"
        item-name="name"
        item-value="id"
        return-object
        :loading="company_level.loading"
        v-model="company_level.selected"
        @change="onCompanyLevelChange"
      >
        <template #search>
          <h-search
            class="mb-1"
            v-model="company_level.q.name"
            @keyup="company_level.loading = true"
            placeholder="Ketik untuk mencari..."
            @search="getCompanyLevel"
          ></h-search>
        </template>
      </h-select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { form, errs } from "./setup";
import {
  company_branch,
  company_level,
  company_organization,
  company_title
} from "../select";
import {
  getCompanyBranch,
  getCompanyOrganization,
  getCompanyTitle,
  getCompanyLevel
} from "../select";

const onCompanyBranchChange = () => {
  if (company_branch.selected) {
    form.company_branch_id = company_branch.selected.id;
  } else {
    form.company_branch_id = 0;
  }
};

const onCompanyOrganizationChange = () => {
  if (company_organization.selected) {
    form.company_organization_id = company_organization.selected.id;
  } else {
    form.company_organization_id = 0;
  }
};

const onCompanyTitleChange = () => {
  if (company_title.selected) {
    form.company_title_id = company_title.selected.id;
  } else {
    form.company_title_id = 0;
  }
};

const onCompanyLevelChange = () => {
  if (company_level.selected) {
    form.company_level_id = company_level.selected.id;
  } else {
    form.company_level_id = 0;
  }
};

onMounted(() => {
  getCompanyBranch();
  getCompanyOrganization();
  getCompanyLevel();
  getCompanyTitle();
});
</script>
