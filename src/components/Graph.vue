<template>
  <v-container class="mt-4" max-width="900">
    <div>
      <h2 class="mb-2">Показатели компании</h2>
      <div class="select-container">
        <p class="select-label">Выберите показатель</p>
        <v-select
          v-model="metric"
          :items="metricOptions"
          item-title="title"
          item-value="value"
          label="Выберите показатель"
          persistent-hint
          return-object
          single-line
          density="compact"
        />
      </div>
      <v-skeleton-loader v-if="isPending" type="image" class="chart"/>
      <Line 
        v-else
        class="chart bordered" 
        :data="data"
        :options="options"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import api from '@/api';
  import { computed, onBeforeMount, ref, watch } from 'vue';
  import { Line } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js'
  import { metricOptions } from '@/utils/metrics';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  const isPending = ref(false)
  const chartData = ref([])
  const metric = ref(metricOptions[0])

  onBeforeMount(async () => {
    isPending.value = true
    chartData.value = await api.getCtrChart()
    isPending.value = false
  })

  const labels = computed(() => {
    return chartData.value.map((item: {date: string}) =>  {
      if (!item?.date) return ''
      return (new Date(item.date)).toLocaleDateString()
    })
  })

  const value = computed(() => {
    return chartData.value.map(({value}) => {
     return value
    })
  })

  const data = computed(() => {
    return {
      labels: labels.value,
      datasets: [
        {
          label: 'CTR',
          borderColor: '#ae21fc',
          data: value.value,
        }
      ]
    }
  })

  const options = computed(() => ({
    plugins: {
        legend: {
            display: false
        },
    },
    scales: {
      y: { 
          title: {
              display: true, 
              text: metric.value.value === 'ctr' ? 'CTR (%)' : `EvPM ${metric.value.title} (‰)`
          }
      },
    }
  }))

  watch(metric, async (val) => {
    isPending.value = true
    if (val.value === 'ctr') {
      chartData.value = await api.getCtrChart()
    } else {
      chartData.value = await api.getMvPMChart(val.value)
    }
    isPending.value = false
  })
</script>

<style>
  .chart {
    max-height: 250px;
    padding: 20px;
  }
</style>
