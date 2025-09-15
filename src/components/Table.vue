<template>
  <v-container max-width="900">
    <div>
      <h2 class="mb-2">Агрегационные таблицы </h2>
      <div class="selects-row"> 
        <div class="select-container">
          <p class="select-label">Выберите событие для EvPM</p>
          <v-select
            v-model="event"
            :items="selectOptions"
            item-title="title"
            item-value="value"
            label="Выберите событие"
            persistent-hint
            return-object
            single-line
            density="compact"
            @update:model-value="handleSelect"
          />
        </div>
        <div  class="select-container">
          <p class="select-label">Выберите поле для агрегации</p>
          <v-select
            v-model="type"
            :items="tableTypes"
            item-title="title"
            item-value="value"
            :label="'Выберите поле'"
            persistent-hint
            return-object
            single-line
            density="compact"
            @update:model-value="handleSelect"
          />
        </div>
      </div>
      <v-data-table-server 
        class="bordered"
        :loading="isPending"
        :items="tableData" 
        :headers="headers"
        :page="pagination.page"
        :items-per-page="pagination.itemsPerPage"
        :disable-sort="true"
        :items-length="totalRows"
        :items-per-page-options="itemsPerPageOptions"
        @update:options="updatePagination"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import api from '@/api';
  import { metricOptions } from '@/utils/metrics';
  import { computed, onBeforeMount, ref } from 'vue';

  const isPending = ref(false)
  const tableData = ref([])
  const totalRows = ref(0)

  const selectOptions = metricOptions.slice(1)
  const event = ref(selectOptions[0])

  const pagination = ref( {
    itemsPerPage: 10,
    page: 1
  })

  const tableTypes: Array<{title: string, value: 'site'| 'dma'}> = [
    {
      title: 'Сайт',
      value: 'site',
    },
    {
      title: 'DMA',
      value: 'dma',
    },
  ]
  const type = ref(tableTypes[0])


  onBeforeMount(async () => {
    isPending.value = true
    const {data, total}  = await api.getTable({
      event: event.value.value,
      type: type.value.value,
      page: pagination.value.page - 1,
      pageSize: pagination.value.itemsPerPage
    })
    isPending.value = false

    tableData.value = data
    totalRows.value = total 
  })

   const headers = computed(() => [
    { title:  type.value.value === 'site' ? 'Сайт' : 'MDA', key: 'site_id', align: 'start' },
    { title: 'Число показов', key: 'impression_count', align: 'start' },
    { title: 'CTR (%)', key: 'ctr', align: 'start' },
    { title: 'EvPM (‰)', key: 'evpm', align: 'start' },
  ])

  const updatePagination = async (options :{ page: any; itemsPerPage: any; }) => {
    const {page, itemsPerPage} = options
    pagination.value = {page, itemsPerPage}
    isPending.value = true
    const {data, total}  = await api.getTable({
      event: event.value.value,
      type: type.value.value,
      page: pagination.value.page - 1,
      pageSize: pagination.value.itemsPerPage
    })
    isPending.value = false
    tableData.value = data
    totalRows.value = total 
  } 

  const handleSelect = async () => {
    isPending.value = true
    const {data, total}  = await api.getTable({
      event: event.value.value,
      type: type.value.value,
      page: 0,
      pageSize: pagination.value.itemsPerPage
    })
    isPending.value = false
    pagination.value.page = 1
    tableData.value = data
    totalRows.value = total 
  }

  const itemsPerPageOptions = [ 
    {value: 10, title: '10'},
    {value: 20, title: '20'},
    {value: 50, title: '50'},
    {value: 100, title: '100'}
  ]
</script>

<style>
  .selects-row {
    display: flex;
    gap: 20px;
  }
</style>
