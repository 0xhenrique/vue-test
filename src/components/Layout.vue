<template>
  <VaLayout
    :top="{ fixed: true, order: 2 }"
    :left="{
      fixed: true,
      order: 1,
    }"
  >
    <template #top>
      <Navbar />
    </template>

    <template #content>
      <main class="p-4">
        <article>
	  <slot></slot>
        </article>
      </main>
    </template>
  </VaLayout>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
</script>
