<script setup>
import { createBrowserRouter, RouterProvider } from "remix-router-vue";
import { h } from "vue";

import Root, { loader as rootLoader } from "./routes/Root.vue";
import Collection, {
  loader as collectionLoader,
} from "./routes/Collection.vue";
import Product, { loader as productLoader } from "./routes/Product.vue";

const routes = [
  {
    path: "/",
    loader: rootLoader,
    element: Root,
    children: [
      {
        path: "/collection/:handle",
        loader: collectionLoader,
        element: Collection,
      },
      {
        path: "/product/:handle",
        loader: productLoader,
        element: Product,
      },
    ],
  },
];

const router = createBrowserRouter(routes);
const fallbackElement = () => h("p", "Loading...");
</script>

<template>
  <RouterProvider :router="router" :fallbackElement="fallbackElement" />
</template>

<style scoped></style>
