<template>
  <v-app>
    <Header/>
    <v-main>
      <Graph />
      <v-divider class="ma-8"/>
      <Table />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">

</script>


<style>
  .select-label {
    color: #484848;
    font-size: 12px;
  }
  .select-container {
    width: 250px;
  }
  .bordered {
    border: 1px solid #212121;
    border-radius: 7px;
  }
</style>