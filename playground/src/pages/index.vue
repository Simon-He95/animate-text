<script setup lang="ts">
// import animateText from '@simon_he/animate-text'
import animateText from "../../../src";
animateText({
  text: "大家好,我是Simon;来自上海;我热爱coding".split(";"),
  infinity: true,
  container: "#app",
});
</script>

<template>
  <div />
</template>
