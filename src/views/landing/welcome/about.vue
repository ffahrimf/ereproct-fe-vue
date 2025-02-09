<template>
  <section class="px-10 md:px-20 lg:px-28">
    <div class="flex flex-col md:grid lg:grid-cols-2 gap-8">
      <div class="relative overflow-hidden rounded-3xl">
        <iframe
          class="w-full h-full aspect-video"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <div class="flex flex-col space-y-5 justify-center text-[#373D52]">
        <div class="space-y-5">
          <p class="font-medium text-primary text-sm xl:text-base">
            lebih dekat dengan
          </p>
          <h1 class="font-semibold text-3xl md:text-4xl">Bermentor?</h1>
        </div>
        <p
          class="text-justify text-xs md:text-base lg:text-xs xl:text-base leading-relaxed"
        >
          Bermentor adalah platform konsultasi yang menghubungkan pelajar,
          mahasiswa, dan UMKM dengan mentor berpengalaman. Kami menawarkan
          panduan langkah demi langkah untuk membantu kamu mencapai tujuan
          akademik, profesional, atau bisnis dengan lebih mudah.
        </p>
        <div
          class="flex flex-row space-x-4 text-xs md:text-base lg:text-xs xl:text-base"
        >
          <div class="bg-[#F2F4F7] py-1 px-5 rounded-full">
            Mentor <span class="hidden md:inline">kualitas</span> terbaik
          </div>
          <div class="bg-[#F2F4F7] py-1 px-5 rounded-full">Fleksibel</div>
          <div class="bg-[#F2F4F7] py-1 px-5 rounded-full">Solutif</div>
        </div>
      </div>
    </div>
  </section>
</template>
