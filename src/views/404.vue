<template>
  <div
    class="flex w-full h-screen justify-center items-center bg-primary relative"
  >
    <img
      src="../assets/img/logo-text-white.png"
      alt=""
      class="absolute top-5 left-5 w-[150px]"
    />
    <div class="flex flex-col gap-5 justify-center items-center">
      <p
        class="text-4xl font-bold font-inter text-white [text-shadow:0.5px_3px_0_black]"
      >
        Page not found
      </p>
      <p
        class="line-clamp-3 text-center font-inter text-white text-lg leading-loose"
      >
        We can’t seem to find the page you’re looking for. Try going back<br />to
        the previous page or use the button below to return to the <br />
        home page.
      </p>
      <button
        @click="$router.push('/')"
        class="bg-white active:scale-75 rounded-full font-inter tracking-tight relative overflow-hidden flex justify-center items-center transition-all duration-700 ease-in-out group"
      >
        <span
          class="text-black font-semibold tracking-normal group-hover:text-transparent mx-7 my-2.5 transition-colors duration-100 ease-out relative z-10"
        >
          Back to Home
        </span>

        <span
          class="aspect-square flex items-center text-white rounded-full w-full h-auto bg-black absolute hover-element"
        >
        </span>

        <span
          class="absolute text-white hover-text z-10 font-semibold tracking-normal"
          >Back to Home</span
        >
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUpFromBottom {
  0% {
    transform: translateY(100%);
  }
  50% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes slideBackUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

.hover-element {
  transform: translateY(-100%);
  transition: none;
}

.group:hover .hover-element {
  animation: slideUpFromBottom 0.7s ease-in-out forwards;
}

.group:not(:hover) .hover-element {
  animation: slideBackUp 0.7s ease-in-out forwards;
}

.hover-text {
  transform: translateY(120%);
  transition: none;
}

.group:hover .hover-text {
  animation: slideUpFromBottom 1s ease-in-out forwards;
}
</style>
