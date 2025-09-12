
<template>
  <div class="header">
    <div class="header__content">
        <img v-if="isLight" src="@/assets/logo.png"/>
        <img v-else src="@/assets/logo-dark.png"/>
        <h2 class="header__title"> test task </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';

  const theme = useTheme()
  const isLight =  computed(() => theme.name.value === 'light')
  
</script>

<style>
    .header {
        height: 70px;
        box-shadow: 0 0 5px rgba(0,0,0,0.1);
    }
    .header__content {
        height: 100%;
        display: flex;
        max-width: 900px;
        margin: auto;
        align-items: flex-end;
        box-shadow: 0 0 5px rba(0,0,0,0.1);
        padding: 17px;
    }
    .header__title {
     }
    img {
        width: 130px;
        margin-right: 100px;
    }
</style>