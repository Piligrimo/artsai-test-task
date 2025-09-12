<template>
  <v-container max-width="700">
    <div>
      <h2>Показатели компании</h2>
      <v-select
        v-model="metric"
        :items="metricOptions"
        item-title="title"
        item-value="value"
        label="Выберите показатель"
        persistent-hint
        return-object
        single-line
      />
      <Line :data="data" :options="options" />
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

  const chartData = ref([])
  const metric = ref(metricOptions[0])

  onBeforeMount(async () => {
    chartData.value = await api.getCtrChart()
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
    responsive: true,
    plugins: {
        legend: {
            display: false
        },
    },
    scales: {
      y: { 
          title: {
              display: true, 
              text: metric.value.value === 'ctr' ? 'CTR (%)' : `${metric.value.title} (‰)`
          }
      },
    }
  }))

  watch(metric, async (val) => {
    if (val.value === 'ctr') {
      chartData.value = await api.getCtrChart()
    } else {
      chartData.value = await api.getMvPMChart(val.value)
    }
  })
</script>

<style>
  .title {
    text-align: center;
  }
</style>
