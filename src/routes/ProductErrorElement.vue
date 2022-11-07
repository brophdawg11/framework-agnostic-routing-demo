<script lang="ts" setup>
import { useRouteError } from "remix-router-vue";

let error = useRouteError();
</script>

<template>
  <h2>Oh no!</h2>
  <p>{{ error.message }}</p>
</template>

<style scoped>
h2,
p {
  color: red;
  text-align: center;
}
</style>
