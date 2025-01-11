<template>
  <div class="p-5">
    <div class="grid grid-cols-12 gap-3">
      <div class="col-span-8">
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 rounded-lg bg-white h-[200px]">
            <p class="font-bold text-slate-600 mb-5">Company</p>

            <div class="flex justify-between mb-3">
              <p class="text-slate-600">Admin</p>
              <p class="text-slate-600 font-bold">1</p>
            </div>
            <div class="flex justify-between mb-3">
              <p class="text-slate-600">Branch</p>
              <p class="text-slate-600 font-bold">0</p>
            </div>
          </div>
          <div class="p-3 rounded-lg bg-white h-[200px]">
            <p class="font-bold text-slate-600 mb-3">Employee Status</p>
            <div class="flex justify-between mb-3">
              <p class="text-slate-600">Total</p>
              <p class="text-slate-600 font-bold">50</p>
            </div>
            <div
              class="w-full rounded-lg h-[10px] bg-slate-50 flex overflow-hidden mb-1"
            >
              <div
                v-for="item in employeeStatus"
                :class="`${item.color}`"
                class="h-[10px]"
                :style="{
                  width: `${item.percent}%`
                }"
              ></div>
            </div>
            <div class="flex justify-between mb-3 text-sm">
              <p class="text-slate-600">0%</p>
              <p class="text-slate-600">10%</p>
            </div>
            <div class="grid grid-cols-12 mb-2" v-for="item in employeeStatus">
              <div class="col-span-10 flex items-center gap-2">
                <div
                  class="w-[10px] h-[10px] rounded-full"
                  :class="item.color"
                ></div>
                <p class="text-slate-600">{{ item.name }}</p>
              </div>
              <p class="text-slate-600">{{ item.value }}</p>
              <p class="text-slate-600">{{ item.percent }}%</p>
            </div>
          </div>
          <div class="p-3 rounded-lg bg-white h-[200px] flex flex-col">
            <p class="font-bold text-slate-600">Job Positioning</p>
            <div class="flex justify-between mb-3">
              <p class="text-slate-600">Total</p>
              <p class="text-slate-600 font-bold">50</p>
            </div>
            <div>
              <div
                class="w-full rounded-lg h-[10px] overflow-hidden bg-slate-50 flex items-center mb-1"
              >
                <div
                  v-for="item in position"
                  :class="item.color"
                  class="h-[10px]"
                  :style="{
                    width: `${(item.value / 50) * 100}%`
                  }"
                ></div>
              </div>
            </div>
            <div class="flex justify-between mb-3 text-sm">
              <p class="text-slate-600">0%</p>
              <p class="text-slate-600">10%</p>
            </div>
            <div class="flex-1 styled-scroll pr-5">
              <div
                class="grid grid-cols-12 mb-2 gap-1"
                v-for="item in position"
              >
                <div class="col-span-10 flex items-center gap-2">
                  <div
                    class="w-[10px] h-[10px] rounded-full"
                    :class="item.color"
                  ></div>
                  <p class="text-slate-600">{{ item.name }}</p>
                </div>
                <p class="text-slate-600 col-span-1">{{ item.value }}</p>
                <p class="text-slate-600 col-span-1">
                  {{ (item.value / 50) * 100 }}%
                </p>
              </div>
            </div>
          </div>
          <div class="p-3 rounded-lg bg-white h-[200px]">
            <p class="font-bold text-slate-600">Gender Diversity</p>
            <div class="flex justify-between mb-3">
              <p class="text-slate-600">Total</p>
              <p class="text-slate-600 font-bold">50</p>
            </div>
            <div
              class="w-full rounded-lg h-[10px] bg-slate-50 flex overflow-hidden mb-1"
            >
              <div
                v-for="item in Gender"
                :class="`${item.color}`"
                class="h-[10px]"
                :style="{
                  width: `${item.percent}%`
                }"
              ></div>
            </div>
            <div class="flex justify-between mb-3 text-sm">
              <p class="text-slate-600">0%</p>
              <p class="text-slate-600">10%</p>
            </div>
            <div class="grid grid-cols-12 mb-2" v-for="item in Gender">
              <div class="col-span-10 flex items-center gap-2">
                <div
                  class="w-[10px] h-[10px] rounded-full"
                  :class="item.color"
                ></div>
                <p class="text-slate-600">{{ item.name }}</p>
              </div>
              <p class="text-slate-600">{{ item.value }}</p>
              <p class="text-slate-600">{{ item.percent }}%</p>
            </div>
          </div>
        </div>
      </div>
      <div class="p-3 rounded-lg bg-white col-span-4">
        <div class="flex justify-between items-start mb-1">
          <p class="font-bold text-slate-600">Who's Off</p>
          <p class="text-blue-600 text-sm font-medium">See All</p>
        </div>
        <button
          class="outline-none font-medium text-slate-500 flex items-center gap-2 mb-3"
        >
          <p class="text-sm">
            {{ day().format("DD MMM, YYYY") }}
          </p>
          <h-icon name="menu-down" mode="mdi"></h-icon>
        </button>

        <div
          class="bg-white rounded-lg border p-2 flex items-center gap-3 mb-3 last:mb-0"
          v-for="i in 5"
        >
          <div class="bg-blue-500 rounded-md p-5"></div>
          <div>
            <p class="text-slate-600">Example Employee {{ i }}</p>
            <p class="text-slate-500 text-xs">Sick - Only Today</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import day from "../../plugins/day";
const employeeStatus = [
  {
    name: "Permanent",
    value: 10,
    percent: 20,
    color: "bg-[#FFA60A]"
  },
  {
    name: "Contract",
    value: 40,
    percent: 80,
    color: "bg-[#2F3CED]"
  }
];

const position = [
  {
    name: "CEO",
    value: 10,
    color: "bg-[#FFA60A]"
  },
  {
    name: "Manager",
    value: 30,
    color: "bg-[#2F3CED]"
  },
  {
    name: "Marbot",
    value: 10,
    color: "bg-[#1FC7D2]"
  }
];

const Gender = [
  {
    name: "Male",
    value: 10,
    percent: 20,
    color: "bg-[#FFA60A]"
  },
  {
    name: "Female",
    value: 40,
    percent: 80,
    color: "bg-[#2F3CED]"
  }
];
</script>
