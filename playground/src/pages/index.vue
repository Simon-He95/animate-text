<script setup lang="ts">
import { animateText } from '../../../src/animate-text'
animateText({
  text: '大家好,我是Simon;来自上海;我热爱coding'.split(';'),
  infinity: true,
  container: '#app',
})
</script>

<template>
  <div />
</template>
