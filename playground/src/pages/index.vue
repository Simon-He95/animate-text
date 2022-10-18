<script setup lang="ts">
// import animateText from '@simon_he/animate-text'
import animateText from '../../../src'
animateText({
  text: 'Hi, I am Simon He;From ShangHai;I love coding;Nice to meet you ❤ '.split(
    ';',
  ),
  infinity: true,
  container: '#app',
})
</script>

<template>
  <div />
</template>
