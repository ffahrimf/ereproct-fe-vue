<template>
  <h4 class="bg-blue-50 py-2 px-5 text-blue-500 font-medium">Data Diri</h4>
  <div class="flex flex-col gap-3 px-5">
    <div>
      <h-input
        label="Nama Lengkap"
        placeholder="Ketik Disini..."
        v-model="form.name"
      ></h-input>
      <p class="text-sm text-red-500">{{ errs.name }}</p>
    </div>
    <div class="grid grid-cols-2 items-center gap-5">
      <div>
        <h-phone
          label="Nomor Telepon"
          placeholder="Ketik Disini..."
          v-model="form.phone_number"
        ></h-phone>
        <p class="text-sm text-red-500">{{ errs.phone_number }}</p>
      </div>
      <div>
        <div>
          <h-label label="Jenis Kelamin" class="mb-3"></h-label>
          <div>
            <h-radio value="Laki-laki" v-model="form.gender">Laki-laki</h-radio>
            <h-radio value="Perempuan" v-model="form.gender">Perempuan</h-radio>
          </div>
        </div>
        <p class="text-sm text-red-500">{{ errs.gender }}</p>
      </div>
    </div>

    <div class="flex items-center gap-5">
      <img
        v-if="photoStore.photoPreview"
        :src="photoStore.photoPreview"
        alt="Preview"
        class="w-20 h-20 object-cover rounded-md"
      />
      <div
        v-else
        class="bg-slate-100 flex justify-center items-center w-20 h-20 rounded-md"
      >
        <h-icon name="photo"></h-icon>
      </div>
      <div>
        <p class="text-sm font-medium text-slate-700 mb-1">Foto Karyawan</p>
        <button
          class="px-3 py-1.5 text-sm font-medium bg-slate-100 rounded-md border outline-none"
          onclick="document.getElementById('fileInput').click()"
        >
          Pilih File...
        </button>
        <h-input-file
          id="fileInput"
          class="hidden"
          label="Foto Karyawan"
          placeholder="Pilih File..."
          @change="onFileChange"
          v-model="form.photo"
          :rule="'image/*'"
        />
      </div>
      <p class="text-sm text-red-500">{{ errs.photo }}</p>
    </div>
    <div class="grid grid-cols-2 gap-5">
      <div>
        <h-date-picker
          label="Tanggal Lahir"
          placeholder="- Pilih Tanggal -"
          v-model="form.birth_date"
        ></h-date-picker>
        <p class="text-sm text-red-500">{{ errs.birth_date }}</p>
      </div>
      <div>
        <h-input
          label="Nomor KTP"
          placeholder="Ketik Disini..."
          accept="number"
          v-model="form.identity_no"
        ></h-input>
        <p class="text-sm text-red-500">{{ errs.identity_no }}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 items-start gap-5">
      <div>
        <h-select
          label="Provinsi KTP"
          placeholder="Pilih Provinsi"
          :items="identity_province.list"
          item-name="name"
          item-value="id"
          return-object
          :loading="identity_province.loading"
          v-model="identity_province.selected"
          @change="onIdentityProvinceChange"
        >
          <template #search>
            <h-search
              class="mb-1"
              v-model="identity_province.q.name"
              @keyup="identity_province.loading = true"
              placeholder="Ketik untuk mencari..."
              @search="() => getProvince('identity')"
            ></h-search>
          </template>
        </h-select>

        <p class="text-sm text-red-500">{{ errs.identity_province }}</p>
      </div>
      <div>
        <h-select
          label="Kota KTP"
          placeholder="Pilih Kota"
          :items="identity_city.list"
          item-name="name"
          item-value="id"
          return-object
          :loading="identity_city.loading"
          v-model="identity_city.selected"
          @change="onIdentityCityChange"
        >
          <template #search>
            <h-search
              class="mb-1"
              v-model="identity_city.q.name"
              @keyup="identity_city.loading = true"
              placeholder="Ketik untuk mencari..."
              @search="getCity('identity')"
            ></h-search>
          </template>
        </h-select>

        <p class="text-sm text-red-500">{{ errs.identity_city }}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 items-start gap-5">
      <div>
        <h-input
          label="Kecamatan KTP"
          placeholder="Ketik Disini..."
          v-model="form.identity_district"
        ></h-input>
        <p class="text-sm text-red-500">{{ errs.identity_district }}</p>
      </div>
      <div>
        <h-input
          label="Kelurahan/Desa KTP"
          placeholder="Ketik Disini..."
          v-model="form.identity_village"
        ></h-input>
        <p class="text-sm text-red-500">{{ errs.identity_village }}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 items-start gap-5">
      <div>
        <h-input
          label="RT/RW KTP"
          placeholder="Ketik Disini..."
          v-model="form.identity_rtrw"
        ></h-input>
        <p class="text-sm text-red-500">{{ errs.identity_rtrw }}</p>
      </div>
      <div>
        <h-input
          label="Kode Pos KTP"
          placeholder="Ketik Disini..."
          accept="number"
          v-model="form.identity_postal_code"
        ></h-input>
        <p class="text-sm text-red-500">{{ errs.identity_postal_code }}</p>
      </div>
    </div>
    <div>
      <h-area
        label="Alamat KTP"
        placeholder="Ketik Disini..."
        v-model="form.identity_address"
      ></h-area>
      <p class="text-sm text-red-500">{{ errs.identity_address }}</p>
    </div>
    <div>
      <h-label
        label="Apakah Domisili sama dengan Alamat KTP?"
        class="mb-3"
      ></h-label>
      <div class="mb-3">
        <div class="mb-3">
          <h-radio
            :value="true"
            v-model="form.is_same_as_identity"
            @change="handleRadioChange(true)"
            >Ya</h-radio
          >
          <h-radio
            :value="false"
            v-model="form.is_same_as_identity"
            @change="handleRadioChange(false)"
            >Tidak</h-radio
          >
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 items-start gap-5">
      <div>
        <h-select
          label="Provinsi Domisili"
          placeholder="Pilih Provinsi"
          :items="current_province.list"
          item-name="name"
          item-value="id"
          return-object
          :loading="current_province.loading"
          v-model="current_province.selected"
          @change="onCurrentProvinceChange"
          :disabled="form.is_same_as_identity"
        >
          <template #search>
            <h-search
              class="mb-1"
              v-model="current_province.q.name"
              @keyup="current_province.loading = true"
              placeholder="Ketik untuk mencari..."
              @search="() => getProvince('current')"
            ></h-search>
          </template>
        </h-select>

        <p class="text-sm text-red-500">{{ errs.current_province }}</p>
      </div>
      <div>
        <h-select
          label="Kota Domisili"
          placeholder="Pilih Kota"
          :items="current_city.list"
          item-name="name"
          item-value="id"
          return-object
          :loading="current_city.loading"
          v-model="current_city.selected"
          @change="onCurrentCityChange"
          :disabled="form.is_same_as_identity"
        >
          <template #search>
            <h-search
              class="mb-1"
              v-model="current_city.q.name"
              @keyup="current_city.loading = true"
              placeholder="Ketik untuk mencari..."
              @search="getCity('current')"
            ></h-search>
          </template>
        </h-select>

        <p class="text-sm text-red-500">{{ errs.current_city }}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 items-start gap-5">
      <div>
        <h-input
          label="Kecamatan Domisili"
          placeholder="Ketik Disini..."
          v-model="form.current_district"
          :disabled="form.is_same_as_identity"
        ></h-input>
        <p class="text-sm text-red-500">{{ errs.current_district }}</p>
      </div>
      <div>
        <h-input
          label="Kelurahan Domisili"
          placeholder="Ketik Disini..."
          v-model="form.current_village"
          :disabled="form.is_same_as_identity"
        ></h-input>

        <p class="text-sm text-red-500">{{ errs.current_village }}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 items-start gap-5">
      <div>
        <h-input
          label="RT/RW Domisili"
          placeholder="Ketik Disini..."
          v-model="form.current_rtrw"
          :disabled="form.is_same_as_identity"
        ></h-input>
        <p class="text-sm text-red-500">{{ errs.current_rtrw }}</p>
      </div>
      <div>
        <h-input
          label="Kode Pos Domisili"
          placeholder="Ketik Disini..."
          accept="number"
          v-model="form.current_postal_code"
          :disabled="form.is_same_as_identity"
        ></h-input>
        <p class="text-sm text-red-500">{{ errs.current_postal_code }}</p>
      </div>
    </div>
    <div>
      <h-area
        label="Alamat Domisili"
        placeholder="Ketik Disini..."
        v-model="form.current_address"
        :disabled="form.is_same_as_identity"
      ></h-area>
      <p class="text-sm text-red-500">{{ errs.current_address }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { form, errs } from "./setup";
import {
  identity_province,
  identity_city,
  current_province,
  current_city,
  usePhotoStore,
  getProvince,
  getCity
} from "../select";

const onIdentityProvinceChange = async () => {
  if (identity_province.selected) {
    form.identity_province = identity_province.selected.id;
    identity_city.q.province_id = identity_province.selected.id;
    identity_city.selected = null;
    form.identity_city = 0;
    await getCity("identity");
  } else {
    form.identity_province = 0;
    identity_city.q.identity_province = null;
    identity_city.list = [];
    identity_city.selected = null;
    form.identity_city = 0;
  }
};

const onIdentityCityChange = () => {
  if (identity_city.selected) {
    form.identity_city = identity_city.selected.id;
  } else {
    form.identity_city = 0;
  }
};

const onCurrentProvinceChange = async () => {
  if (current_province.selected) {
    form.current_province = current_province.selected.id;
    current_city.q.province_id = current_province.selected.id;
    current_city.selected = null;
    form.current_city = 0;
    await getCity("current");
  } else {
    form.identity_province = 0;
    identity_city.q.identity_province = null;
    identity_city.list = [];
    identity_city.selected = null;
    form.identity_city = 0;
  }
};

const onCurrentCityChange = () => {
  if (current_city.selected) {
    form.current_city = current_city.selected.id;
  } else {
    form.current_city = 0;
  }
};

const handleRadioChange = (isSame: boolean): void => {
  if (isSame) {
    current_province.selected = identity_province.selected;
    current_city.selected = identity_city.selected;
    form.current_province = form.identity_province;
    form.current_city = form.identity_city;
    form.current_district = form.identity_district;
    form.current_village = form.identity_village;
    form.current_rtrw = form.identity_rtrw;
    form.current_postal_code = form.identity_postal_code;
    form.current_address = form.identity_address;
  } else {
    current_province.selected = null;
    current_city.selected = null;
    form.current_province = null;
    form.current_city = null;
    form.current_district = "";
    form.current_village = "";
    form.current_rtrw = "";
    form.current_postal_code = "";
    form.current_address = "";
  }
};

const photoStore = usePhotoStore();

const onFileChange = (file: File | null) => {
  if (file) {
    const previewUrl = URL.createObjectURL(file);
    photoStore.photoPreview = previewUrl;
    form.photo = file;
  } else {
    photoStore.resetPhotoPreview();
    form.photo = null;
  }
};

onMounted(() => {
  getProvince("identity");
  getProvince("current");
});
</script>
