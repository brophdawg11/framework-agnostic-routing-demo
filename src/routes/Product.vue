<script lang="ts">
import { type LoaderFunctionArgs } from "@remix-run/router";
import { Link, useLoaderData } from "remix-router-vue";

export async function loader({ request, params }: LoaderFunctionArgs) {
  let res = await fetch(`/api/products/${params.handle}`, {
    signal: request.signal,
  });
  if (!res.ok) {
    throw new Error("Product Not Found!");
  }
  let data = await res.json();
  return {
    product: data.product,
  };
}
</script>

<script lang="ts" setup>
let data = useLoaderData();
</script>

<template>
  <h2>{{ data.product.title }}</h2>
</template>

<style scoped></style>
