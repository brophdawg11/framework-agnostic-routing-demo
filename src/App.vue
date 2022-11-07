<script setup>
import { createBrowserRouter, RouterProvider } from "remix-router-vue";
import { h } from "vue";

import Root, { loader as rootLoader } from "./routes/Root.vue";
import Home from "./routes/Home.vue";
import Collection, {
  loader as collectionLoader,
} from "./routes/Collection.vue";
import Product, {
  action as productAction,
  loader as productLoader,
} from "./routes/Product.vue";
import ProductErrorElement from "./routes/ProductErrorElement.vue";

const routes = [
  {
    path: "/",
    loader: rootLoader,
    element: Root,
    children: [
      {
        index: true,
        element: Home,
      },
      {
        path: "/collection/:handle",
        loader: collectionLoader,
        element: Collection,
      },
      {
        path: "/product/:handle",
        action: productAction,
        loader: productLoader,
        element: Product,
        errorElement: ProductErrorElement,
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
