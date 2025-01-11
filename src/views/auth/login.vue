<template>
  <div
    class="w-full min-h-screen bg-[#F3F5F6] flex items-center justify-center"
  >
    <div
      class="w-[430px] p-10 rounded-lg shadow bg-white flex items-center flex-col gap-3"
    >
      <div class="p-3 bg-blue-500 rounded-full">
        <h-icon name="cube-transparent" size="30" class="text-white"></h-icon>
      </div>
      <div class="text-center">
        <p class="text-[35px] font-medium">Welcome Back</p>
        <p class="text-sm text-slate-500 leading-3">Glad to see you again 👋</p>
        <p class="text-sm text-slate-500">Login to your account bellow</p>
      </div>

      <!-- Pesan Error -->
      <div
        v-if="generalError"
        class="w-full p-4 mb-4 text-sm text-red-500 bg-red-100 rounded-lg flex items-start gap-2"
        role="alert"
      >
        <h-icon
          name="heroicons:exclamation-triangle"
          size="20"
          class="text-red-500 mt-[1px]"
        />
        <span>{{ generalError }}</span>
      </div>

      <div class="w-full">
        <form @submit.prevent="login">
          <div class="mb-3">
            <h-input
              label="Email/Username"
              v-model="form.key"
              placeholder="Ketik Email atau Username Anda..."
            ></h-input>
            <p
              class="text-sm text-red-500 whitespace-pre"
              v-html="errs.key"
            ></p>
          </div>
          <div class="mb-3">
            <h-input-password
              label="Password"
              v-model="form.password"
              placeholder="Ketik Password Anda..."
            ></h-input-password>
            <p
              class="text-sm text-red-500 whitespace-pre"
              v-html="errs.password"
            ></p>
          </div>
          <h-btn v-if="!loading" class="px-3 py-2 w-full" type="submit"
            >Login</h-btn
          >
          <h-btn
            v-else
            class="px-3 py-2 w-full flex items-center justify-center gap-3"
            type="submit"
          >
            <spinner size="18px" />
            <p>Loading...</p></h-btn
          >
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import {
  useEncrypt,
  useFilterProperties,
  useResetErr
} from "../../composables/use-helper";
import useApi from "../../composables/use-api";
import Cookies from "js-cookie";
import { useRoute, useRouter } from "vue-router";
import { RoleIF } from "../../interface/role.interface";
import { mainStore } from "../../store";

const store = mainStore();
interface formLogin {
  key?: string;
  password?: string;
}

interface reqIf {
  path: string;
  body: formLogin;
}

interface UserIF {
  id: number;
  username: string;
  name: string;
  email: string;
  email_verified_at?: number;
  password: string;
  role: RoleIF;
}
interface responseLogin {
  token: string;
  refresh_token: string;
  payload: UserIF;
}

const api = new useApi();
const loading = ref<boolean>(false);
const router = useRouter();
const route = useRoute();

const generalError = ref<string>("");

const form = reactive<formLogin>({
  key: "",
  password: ""
});

const errs = reactive<Record<string, string>>({});

const login = (): void => {
  useResetErr(errs);
  generalError.value = "";

  loading.value = true;
  const body = useFilterProperties(form);

  const req: reqIf = {
    path: "auth/login",
    body: body
  };

  api
    .post(req)
    .then((res) => {
      const response: responseLogin = res.data;

      setResponse(response);
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err.errors);
      const requiredErr = err.errors;
      if (requiredErr) {
        for (let key in requiredErr) {
          errs[key] =
            requiredErr[key].length > 1
              ? requiredErr[key].join(`\n`)
              : requiredErr[key][0];
        }
      }
      generalError.value = err.message;
    });
};

const setResponse = (res: responseLogin): void => {
  const token = useEncrypt(res.token);
  if (token) {
    Cookies.set("hAS-aTH", JSON.stringify(token), {
      expires: 7
    });
  }
  const uid = useEncrypt(`${res.payload.id}`);
  if (uid) {
    Cookies.set("glbl-unq-hr", JSON.stringify(uid), {
      expires: 7
    });
  }

  const role = useEncrypt(res.payload.role.name);
  if (role) {
    Cookies.set("as-bermentor", JSON.stringify(role), {
      expires: 7
    });
  }
  store.token = res.token;
  store.role = res.payload.role.name;
  store.guid = `${res?.payload?.id}`;
  const qp = route.query.redirect ?? null;
  const redirect = Array.isArray(qp) ? qp[0] : qp;
  router.push(redirect ? redirect : "/");
};
</script>
