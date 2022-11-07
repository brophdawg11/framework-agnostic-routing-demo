<script lang="ts">
import {
  ActionFunctionArgs,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/router";
import { computed, effect } from "vue";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigation,
} from "remix-router-vue";

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let data = {};
  for (let [name, value] of formData.entries()) {
    data[name] = value;
  }
  let res = await fetch("/api/cart", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return { error: "Unable to add product to cart" };
  }

  return redirect(new URL(request.url).pathname);
}

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
let actionData = useActionData();
let location = useLocation();
let navigation = useNavigation();
let isAdding = computed(
  () => navigation.value.formAction === location.value.pathname
);
</script>

<template>
  <div key="product" class="container">
    <div class="info">
      <h2>{{ data.product.title }}</h2>
      <div v-html="data.product.descriptionHtml" />
      <Form method="post">
        <fieldset v-for="option in data.product.options">
          {{ option.name }}
          <label v-for="(value, index) in option.values">
            <input
              type="radio"
              required
              :name="option.name.toLowerCase().replace(' ', '-')"
              :value="value"
              :checked="index === 0"
            />
            {{ value }}
          </label>
        </fieldset>
        <p v-if="actionData?.error" class="error">
          {{ actionData.error }}
        </p>
        <button type="submit" :disabled="isAdding">
          {{ isAdding ? "Adding..." : "Add to Cart" }}
        </button>
      </Form>
    </div>
    <div>
      <div class="images">
        <img
          v-for="(image, index) in data.product.media.nodes"
          :src="`${image.image.url}&width=640&height=800&crop=center`"
          :id="`faceout-image-${index}`"
        />
      </div>
      <div class="controls">
        <a
          v-for="(image, index) in data.product.media.nodes"
          :href="`#faceout-image-${index}`"
          class="dot"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

.container .info {
  order: 2;
}

.container .images {
  order: 1;
}

.images {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
}
.images::-webkit-scrollbar {
  display: none;
}

.images img {
  display: block;
  width: 100%;
  flex-shrink: 0;
  scroll-snap-align: start;
  aspect-ratio: 640 / 800;
  width: 100%;
  object-fit: contain;
}

.controls {
  width: 100%;
  text-align: center;
  margin-top: -20px;
}

.controls .dot {
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: rgba(100, 100, 100);
  opacity: 0.5;
  transition: opacity 250ms ease-in-out;
  margin: 0 5px;
  text-align: center;
}

.controls .dot:hover,
.controls .dot:active,
.controls .dot:focus {
  opacity: 1;
}

.error {
  color: red;
}
</style>
