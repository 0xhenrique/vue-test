<template>
  <VaNavbar class="app-layout-navbar py-2 px-0">
    <template #left>
      <div class="left">
        <RouterLink to="/" aria-label="Home page">
          <h1><b>VUE TEST</b></h1>
        </RouterLink>
      </div>
    </template>

    <template #right>
      <h1>Navbar Right</h1>
    </template>
  </VaNavbar>
</template>
