<template>
  <div
    class="w-full min-h-screen bg-[#F3F5F6] flex items-center justify-center"
  >
    <div
      class="w-[430px] p-10 rounded-lg shadow bg-white flex items-center flex-col gap-3"
    >
      <div class="p-3 rounded-full">
        <img
          src="../../assets/img/landing/logo-text.png"
          class="h-[50px] mb-5"
          alt=""
        />
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
              v-model="form.email"
              placeholder="Ketik Email atau Username Anda..."
            ></h-input>
            <p
              class="text-sm text-red-500 whitespace-pre"
              v-html="errs.email"
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
          <h-btn
            v-if="!loading"
            class="px-3 py-2 w-full rounded-3xl text-base"
            type="submit"
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
  useResetErr,
  useToast
} from "../../composables/use-helper";
import useApi from "../../composables/use-api";
import Cookies from "js-cookie";
import { useRoute, useRouter } from "vue-router";
import { mainStore } from "../../store";
import { RoleIF } from "../../interface/role.interface";

const store = mainStore();
interface formLogin {
  email?: string;
  password?: string;
}

interface reqIf {
  path: string;
  body: formLogin;
}

interface ListDataIF {
  expires_in: number;
  token: string;
  token_type: string;
  user: UserIF;
}

interface UserIF {
  id: number;
  username: string;
  name: string;
  email: string;
  email_verified_at?: number;
  roles: RoleIF[];
}

interface MetaIF {
  code: number;
  message: string;
  success: string;
}

interface responseLogin {
  meta: MetaIF;
  list_data: ListDataIF;
}

const api = new useApi();
const loading = ref<boolean>(false);
const router = useRouter();
const route = useRoute();

const generalError = ref<string>("");

const form = reactive<formLogin>({
  email: "",
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
      const response: responseLogin = res;
      console.log("response login:", response);
      setResponse(response);
      loading.value = false;
      useToast(res.meta.message, "success");
    })
    .catch((err) => {
      loading.value = false;
      // console.log("respon error:",err.meta.message);
      const requiredErr = err.meta.message;
      if (requiredErr) {
        for (let key in requiredErr) {
          errs[key] =
            requiredErr[key].length > 1
              ? requiredErr[key].join(`\n`)
              : requiredErr[key][0];
        }
      }
      generalError.value = requiredErr;
    });
};

const setResponse = (res: responseLogin): void => {
  const token = useEncrypt(res.list_data.token);
  if (token) {
    Cookies.set("hAS-aTH", JSON.stringify(token), {
      expires: 7
    });
  }
  const uid = useEncrypt(`${res.list_data.user.id}`);
  if (uid) {
    Cookies.set("glbl-unq-hr", JSON.stringify(uid), {
      expires: 7
    });
  }

  const role = useEncrypt(res.list_data.user.roles[0].name);
  if (role) {
    Cookies.set("as-bermentor", JSON.stringify(role), {
      expires: 7
    });
  }

  store.token = res.list_data.token;
  store.role = res.list_data.user.roles[0].name;
  store.guid = `${res?.list_data.user.id}`;
  const qp = route.query.redirect ?? null;
  const redirect = Array.isArray(qp) ? qp[0] : qp;
  router.push(redirect ? redirect : "/dashboard");
};
</script>
