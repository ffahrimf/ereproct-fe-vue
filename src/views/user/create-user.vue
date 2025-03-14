<template>
  <h-dialog :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[500px] flex flex-col h-[86vh] relative"
    >
      <div class="py-2 px-6 border-b flex items-center justify-between">
        <p class="font-medium text-slate-700 text-sm">Create User</p>
        <icon-btn icon="x-mark" @click="emit('close')" />
      </div>
      <div class="py-3 px-6 flex-1 styled-scroll">
        <div class="mb-3">
          <h-select
            label="Role"
            placeholder="Pilih Role"
            :items="role.list"
            item-name="name"
            item-value="id"
            return-object
            :loading="role.loading"
            v-model="role.selected"
            @change="onRoleChange"
          >
          </h-select>
          <p
            class="text-sm text-red-500 whitespace-pre-wrap"
            v-html="errs.role_id"
          ></p>
        </div>
        <div class="mb-3">
          <h-input
            label="Nama"
            placeholder="Masukkan nama..."
            v-model="form.name"
          ></h-input>

          <p
            class="text-sm text-red-500 whitespace-pre-wrap"
            v-html="errs.name"
          ></p>
        </div>
        <div class="mb-3">
          <h-input
            label="Username"
            placeholder="Masukkan username..."
            v-model="form.username"
          ></h-input>

          <p
            class="text-sm text-red-500 whitespace-pre-wrap"
            v-html="errs.username"
          ></p>
        </div>
        <div class="mb-3">
          <h-input
            label="Email"
            placeholder="Masukkan email..."
            v-model="form.email"
            :disabled="!!form.id"
          ></h-input>

          <p
            class="text-sm text-red-500 whitespace-pre-wrap"
            v-html="errs.email"
          ></p>
        </div>
        <div class="mb-3" v-if="!form.id">
          <h-input
            label="Password"
            placeholder="Masukkan password..."
            v-model="form.password"
          ></h-input>
          <p
            class="text-sm text-red-500 whitespace-pre-wrap"
            v-html="errs.password"
          ></p>
        </div>
      </div>
      <div class="py-3 px-6 border-t flex items-center justify-end">
        <h-btn class="px-3 py-2" @click="postData">Save</h-btn>
      </div>
      <h-overlay
        :value="loading"
        absolute
        class="flex items-center justify-center gap-3"
      >
        <spinner />
      </h-overlay>
    </div>
  </h-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

import useApi from "../../composables/use-api";
import {
  useFilterProperties,
  useQuery,
  useToast
} from "../../composables/use-helper";
import { GenericObject } from "../../interface/composable.interface";
import { RoleIF } from "../../interface/role.interface";

interface CreateUser {
  id?: string;
  name: string;
  username: string;
  password: string;
  email: string;
  role_id?: number | null;
}

defineProps({
  dialog: Boolean
});

const emit = defineEmits(["close", "refetch"]);

const api = new useApi();

const form = reactive<CreateUser>({
  id: "",
  name: "",
  username: "",
  password: "",
  role_id: null,
  email: ""
});

const errs = reactive<GenericObject>({
  name: "",
  username: "",
  password: "",
  role_id: "",
  email: ""
});

interface DataRoleIF {
  list: Array<RoleIF> | [];
  loading: boolean;
  selected: RoleIF | null;
  find: string;
  q: any;
}

const role = reactive<DataRoleIF>({
  list: [],
  loading: false,
  selected: null,
  find: "",
  q: {
    page: 1,
    limit: 10,
    id: null,
    name: ""
  }
});

const onRoleChange = () => {
  if (role.selected) {
    form.role_id = role.selected.id;
  } else {
    form.role_id = null;
  }
};

const resetForm = () => {
  form.id = "";
  form.name = "";
  form.username = "";
  form.email = "";
  form.password = "";
  form.role_id = null;
  errs.name = "";
  errs.username = "";
  errs.email = "";
  errs.password = "";
  errs.role_id = "";
  role.selected = null;
};

const getRole = (): void => {
  role.loading = true;
  const q = useQuery(role.q);
  api.get(`role${q}`).then((res) => {
    let raw: Array<RoleIF> = res.data.items;
    if (role.q.Page > 1) {
      role.list = [...role.list, ...raw];
    } else {
      role.list = raw;
    }
    role.loading = false;
  });
};

const loading = ref<boolean>(false);
const postData = (): void => {
  loading.value = true;

  let body = useFilterProperties(form);

  let req = {
    path: `user/create`,
    body: body
  };

  api
    .post(req)
    .then((res) => {
      useToast(res.message, "success");
      emit("close");
      emit("refetch");
      resetForm();
      loading.value = false;
    })
    .catch((err) => {
      useToast(err.message, "error");

      const requiredErr = err.errors;
      if (requiredErr) {
        for (let key in err.errors) {
          errs[key] =
            requiredErr[key].length > 1
              ? requiredErr[key].join(`\n`)
              : requiredErr[key][0];
        }
      }
      loading.value = false;
    });
};

onMounted(() => {
  resetForm();
  getRole();
});
</script>
