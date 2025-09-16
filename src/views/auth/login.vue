<template>
  <div
    class="w-full min-h-screen flex items-center justify-center my-background-div"
  >
    <div
      class="w-full max-w-[380px] mx-4 px-10 py-12 rounded-3xl shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] bg-white flex items-center flex-col gap-3"
    >
      <!-- Header -->
      <div class="text-center space-y-2.5">
        <h1 class="text-xl font-bold font-inter">User Login</h1>
        <p class="text-[13px] text-gray-600">
          Hey, Enter your details to get sign in <br />to your account
        </p>
      </div>

      <!-- Error Alert -->
      <Transition name="fade">
        <div
          v-if="generalError"
          class="w-full p-4 mb-1.5 text-sm text-red-500 bg-red-100 rounded-lg flex items-center gap-3"
          role="alert"
          aria-live="polite"
        >
          <h-icon
            name="heroicons:exclamation-triangle"
            size="20"
            class="text-red-500 mt-[1px] flex-shrink-0"
          />
          <span class="text-xs">{{ generalError }}</span>
        </div>
      </Transition>

      <!-- Login Form -->
      <div class="w-full">
        <form @submit.prevent="handleLogin" novalidate>
          <!-- Username/Email Field -->
          <div class="mb-3">
            <h-input
              size="text-[13px]"
              v-model.trim="form.key"
              placeholder="Enter Username / Email"
              :disabled="loading"
              autocomplete="username"
              :aria-invalid="!!errs.key"
              aria-describedby="key-error"
              @blur="validateField('key')"
              @input="clearFieldError('key')"
            />
            <Transition name="slide">
              <p
                v-if="errs.key"
                id="key-error"
                class="text-xs text-red-500 mt-1"
              >
                {{ errs.key }}
              </p>
            </Transition>
          </div>

          <!-- Password Field -->
          <div class="mb-3">
            <h-input-password
              size="text-[13px]"
              v-model.trim="form.password"
              placeholder="Passcode"
              :disabled="loading"
              autocomplete="current-password"
              :aria-invalid="!!errs.password"
              aria-describedby="password-error"
              @blur="validateField('password')"
              @input="clearFieldError('password')"
            />
            <Transition name="slide">
              <p
                v-if="errs.password"
                id="password-error"
                class="text-xs text-red-500 mt-1"
              >
                {{ errs.password }}
              </p>
            </Transition>
          </div>

          <!-- Forgot Password Link -->
          <p
            class="text-xs hover:cursor-pointer block font-medium my-4 text-blue-600 hover:text-blue-800 transition-colors"
          >
            Having trouble signing in?
          </p>

          <!-- ReCAPTCHA -->
          <div class="mb-4">
            <RecaptchaV2
              :key="recaptchaKey"
              @error-callback="handleErrorCallback"
              @expired-callback="handleExpiredCallback"
              @load-callback="handleLoadCallback"
            />
            <Transition name="slide">
              <p v-if="errs.recaptcha" class="text-xs text-red-500 mt-1">
                {{ errs.recaptcha }}
              </p>
            </Transition>
          </div>

          <!-- Submit Button -->
          <h-btn
            class="py-2.5 w-full rounded-md transition-all duration-200"
            type="submit"
            :disabled="loading || !isFormValid"
            :aria-busy="loading"
          >
            <template v-if="!loading"> Login </template>
            <template v-else>
              <div class="flex items-center justify-center gap-3">
                <spinner size="18px" />
                <span>Signing in...</span>
              </div>
            </template>
          </h-btn>

          <!-- Social Login Section -->
          <div class="mt-5 flex flex-col gap-5">
            <p class="flex items-center text-xs text-gray-500">
              <span class="flex-1 border-t border-gray-300"></span>
              <span class="px-3">Or Sign in with</span>
              <span class="flex-1 border-t border-gray-300"></span>
            </p>

            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="provider in socialProviders"
                :key="provider.name"
                type="button"
                @click="handleSocialLogin(provider.name)"
                :disabled="loading"
                class="group hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                :aria-label="`Sign in with ${provider.label}`"
              >
                <div
                  class="flex justify-center items-center border-[1.5px] border-gray-200 hover:bg-slate-50 hover:border-gray-300 transition-all duration-200 py-2.5 rounded-lg space-x-1.5"
                >
                  <h-icon :name="provider.icon" mode="mdi" size="16" />
                  <p class="text-xs font-semibold">{{ provider.label }}</p>
                </div>
              </button>
            </div>

            <!-- Sign Up Link -->
            <p class="text-xs text-center text-gray-600">
              Don't have an account?
              <span
                class="inline-block font-semibold hover:cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
              >
                Request Now
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { RecaptchaV2 } from "vue3-recaptcha-v2";
import Cookies from "js-cookie";
import { mainStore } from "../../store";
import useApi from "../../composables/use-api";
import {
  useEncrypt,
  useFilterProperties,
  useToast
} from "../../composables/use-helper";
import type { RoleIF } from "../../interface/role.interface";

// Types & Interfaces
interface FormLogin {
  key: string;
  password: string;
  "g-recaptcha-response"?: string | null;
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

interface ResponseLogin {
  token: string;
  refresh_token: string;
  payload: UserIF;
}

interface SocialProvider {
  name: string;
  icon: string;
  label: string;
}

// Constants
const COOKIE_OPTIONS = {
  TOKEN: { name: "hAS-aTH", expires: 7 },
  REFRESH: { name: "hAS-rTH", expires: 30 },
  UID: { name: "glbl-unq-hr", expires: 7 },
  ROLE: { name: "as-ereproct", expires: 7 }
} as const;

const socialProviders: SocialProvider[] = [
  { name: "google", icon: "google", label: "Google" },
  { name: "apple", icon: "apple", label: "Apple ID" },
  { name: "facebook", icon: "facebook", label: "Facebook" }
];

// Composables & Store
const api = new useApi();
const router = useRouter();
const route = useRoute();
const store = mainStore();

// Reactive State
const loading = ref(false);
const recaptchaToken = ref<unknown | null>(null);
const recaptchaKey = ref(0);
const generalError = ref("");
const loginAttempts = ref(0);
const maxAttempts = 5;

const form = reactive<Omit<FormLogin, "g-recaptcha-response">>({
  key: "",
  password: ""
});

const errs = reactive<Record<string, string>>({
  key: "",
  password: "",
  recaptcha: ""
});

// Computed Properties
const isFormValid = computed(() => {
  return (
    form.key.length > 0 &&
    form.password.length > 0 &&
    recaptchaToken.value !== null &&
    !loading.value
  );
});

const isRateLimited = computed(() => {
  return loginAttempts.value >= maxAttempts;
});

// Validation Rules
const validationRules = {
  key: (value: string) => {
    if (!value) return "Username or Email is required";
    if (value.length < 3)
      return "Username or Email must be at least 3 characters";
    // Email validation if contains @
    if (value.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Please enter a valid email address";
    }
    return "";
  },
  password: (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  }
};

// Methods
const validateField = (field: keyof typeof form) => {
  if (field in validationRules) {
    errs[field] = validationRules[field as keyof typeof validationRules](
      form[field]
    );
  }
};

const clearFieldError = (field: string) => {
  if (errs[field]) {
    errs[field] = "";
  }
};

const clearAllErrors = () => {
  Object.keys(errs).forEach((key) => {
    errs[key] = "";
  });
  generalError.value = "";
};

const validateForm = (): boolean => {
  clearAllErrors();
  let isValid = true;

  // Validate all fields
  (Object.keys(validationRules) as Array<keyof typeof validationRules>).forEach(
    (field) => {
      const error = validationRules[field](form[field]);
      if (error) {
        errs[field] = error;
        isValid = false;
      }
    }
  );

  // Validate reCAPTCHA
  if (!recaptchaToken.value) {
    errs.recaptcha = "Please complete the reCAPTCHA verification";
    isValid = false;
  }

  return isValid;
};

const handleErrorCallback = () => {
  recaptchaToken.value = null;
  errs.recaptcha = "reCAPTCHA verification failed. Please try again.";
};
const handleExpiredCallback = () => {
  recaptchaToken.value = null;
  errs.recaptcha = "reCAPTCHA expired. Please verify again.";
};
const handleLoadCallback = (response: unknown) => {
  recaptchaToken.value = response;
  errs.recaptcha = "";
};

// Login Handler
const handleLogin = async () => {
  // Check rate limiting
  if (isRateLimited.value) {
    generalError.value = "Too many login attempts. Please try again later.";
    return;
  }

  // Validate form
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  clearAllErrors();
  loginAttempts.value++;

  try {
    const body = {
      ...useFilterProperties(form),
      "g-recaptcha-response": recaptchaToken.value
    };

    const response = await api.post({
      path: "auth/login",
      body
    });

    if (response.data) {
      await handleLoginSuccess(response.data as ResponseLogin);
      useToast(response.message || "Login successful!", "success");
    }
  } catch (error: any) {
    handleLoginError(error);
  } finally {
    loading.value = false;
  }
};

// Handle successful login
const handleLoginSuccess = async (response: ResponseLogin) => {
  // Reset attempts on successful login
  loginAttempts.value = 0;

  // Store tokens and user data
  const cookieData = [
    { value: response.token, config: COOKIE_OPTIONS.TOKEN },
    { value: response.refresh_token, config: COOKIE_OPTIONS.REFRESH },
    { value: String(response.payload.id), config: COOKIE_OPTIONS.UID },
    { value: response.payload.role.name, config: COOKIE_OPTIONS.ROLE }
  ];

  cookieData.forEach(({ value, config }) => {
    const encrypted = useEncrypt(value);
    if (encrypted) {
      Cookies.set(config.name, JSON.stringify(encrypted), {
        expires: config.expires,
        secure: true,
        sameSite: "strict"
      });
    }
  });

  // Update store
  store.token = response.token;
  store.role = response.payload.role.name;
  store.guid = String(response.payload.id);

  // Handle redirect
  const redirectParam = route.query.redirect;
  const redirect = Array.isArray(redirectParam)
    ? redirectParam[0]
    : redirectParam;

  await router.push(redirect || "/");
};

// Handle login error
const handleLoginError = (error: any) => {
  // Reset reCAPTCHA on error
  recaptchaToken.value = null;
  recaptchaKey.value++;

  if (error.errors) {
    // Field-specific errors
    Object.entries(error.errors).forEach(([key, value]) => {
      if (key in errs) {
        errs[key] = Array.isArray(value)
          ? (value as string[]).join(", ")
          : String(value);
      }
    });
  }

  // General error message
  generalError.value = error.message || "Login failed. Please try again.";

  // Show toast for error
  useToast(generalError.value, "error");
};

// Social Login Handler
const handleSocialLogin = async (provider: string) => {
  if (loading.value) return;

  loading.value = true;
  clearAllErrors();

  try {
    // Implement social login logic here
    const response = await api.post({
      path: `auth/social/${provider}`,
      body: {}
    });

    if (response.data) {
      await handleLoginSuccess(response.data as ResponseLogin);
      useToast(`Successfully logged in with ${provider}!`, "success");
    }
  } catch (error: any) {
    generalError.value = `Failed to login with ${provider}. Please try again.`;
    useToast(generalError.value, "error");
  } finally {
    loading.value = false;
  }
};

// Keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && event.ctrlKey && isFormValid.value) {
    handleLogin();
  }
};

// Lifecycle Hooks
onMounted(() => {
  // Add keyboard listener
  window.addEventListener("keydown", handleKeyDown);

  // Clear any existing auth data if not redirected
  if (!route.query.redirect) {
    // Optional: Clear cookies on fresh login page visit
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.my-background-div {
  background-image: url("../../assets/img/login-background.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* Focus styles for accessibility */
input:focus,
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading state styles */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .my-background-div {
    background-size: auto;
  }
}
</style>
