<template>
  <div
    style="
      background-image: url(/src/assets/img/login-background.svg);
      background-size: cover;
    "
    class="w-full min-h-screen flex items-center justify-center"
  >
    <div
      class="w-[380px] px-10 py-12 rounded-3xl shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] bg-white flex items-center flex-col gap-3"
    >
      <div class="text-center space-y-2.5">
        <p class="text-xl font-axiforma-xtrabold">User Login</p>

        <p class="text-[13px]">
          Hey, Enter your details to get sign in <br />to your account
        </p>
      </div>

      <!-- Pesan Error -->
      <div
        v-if="generalError"
        class="w-full p-4 mb-1.5 text-sm text-red-500 bg-red-100 rounded-lg flex items-center gap-3"
        role="alert"
      >
        <h-icon
          name="heroicons:exclamation-triangle"
          size="20"
          class="text-red-500 mt-[1px]"
        />
        <span class="text-xs">{{ generalError }}</span>
      </div>

      <div class="w-full">
        <form @submit.prevent="login">
          <div class="mb-3">
            <h-input
              size="text-[13px]"
              v-model="form.key"
              placeholder="Enter Username / Email"
            ></h-input>
            <p class="text-xs text-red-500" v-html="errs.key"></p>
          </div>
          <div class="mb-3">
            <h-input-password
              size="text-[13px]"
              v-model="form.password"
              placeholder="Passcode"
            ></h-input-password>
            <p class="text-xs text-red-500" v-html="errs.password"></p>
          </div>
          <p class="text-xs hover:cursor-pointer block font-medium my-5">
            Having trouble in sign in?
          </p>
          <h-btn v-if="!loading" class="py-2.5 w-full rounded-md" type="submit"
            >Login</h-btn
          >
          <h-btn
            v-else
            class="py-2.5 w-full flex items-center justify-center gap-3"
            type="submit"
          >
            <spinner size="18px" />
            <p>Loading...</p></h-btn
          >
          <div class="mt-5 flex flex-col gap-5">
            <p class="flex items-center text-xs">
              <span class="flex-1 border-t border-gray-300"></span>
              <span class="px-2">Or Sign in with</span>
              <span class="flex-1 border-t border-gray-300"></span>
            </p>
            <div class="grid grid-cols-3 gap-1">
              <div class="hover:cursor-pointer">
                <div
                  class="flex justify-center items-center border-[1.5px] hover:bg-slate-50 transition duration-300 py-2.5 rounded-lg space-x-1.5"
                >
                  <h-icon name="google" mode="mdi" size="16" />
                  <p class="text-xs font-semibold">Google</p>
                </div>
              </div>
              <div class="hover:cursor-pointer">
                <div
                  class="flex justify-center items-center border-[1.5px] hover:bg-slate-50 transition duration-300 py-2.5 rounded-lg space-x-1.5"
                >
                  <h-icon name="apple" mode="mdi" size="16" />
                  <p class="text-xs font-semibold">Apple ID</p>
                </div>
              </div>
              <div class="hover:cursor-pointer">
                <div
                  class="flex justify-center items-center border-[1.5px] hover:bg-slate-50 transition duration-300 py-2.5 rounded-lg space-x-1.5"
                >
                  <h-icon name="facebook" mode="mdi" size="16" />
                  <p class="text-xs font-semibold">Facebook</p>
                </div>
              </div>
            </div>
            <p class="text-xs text-center">
              Don't have an account?
              <span class="font-semibold hover:cursor-pointer"
                >Request Now</span
              >
            </p>
          </div>
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
      useToast(res.message, "success");
    })
    .catch((err) => {
      loading.value = false;

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

  const refreshToken = useEncrypt(res.refresh_token);
  if (refreshToken) {
    Cookies.set("hAS-rTH", JSON.stringify(refreshToken), {
      expires: 30
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
    Cookies.set("as-ereproct", JSON.stringify(role), {
      expires: 7
    });
  }
  store.token = res.token;
  store.role = res.payload.role.name;
  store.guid = `${res?.payload?.id}`;
  const qp = route.query.redirect ?? null;
  const redirect = Array.isArray(qp) ? qp[0] : qp;
  router.push(redirect ? redirect : "/overview");
};
</script>
