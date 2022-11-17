<script lang="ts">
import { LoaderFunctionArgs } from "@remix-run/router";
import { computed } from "@vue/reactivity";
import {
  Await,
  defer,
  Link,
  Outlet,
  useLoaderData,
  useNavigation,
} from "remix-router-vue";

// export async function loader({ request }: LoaderFunctionArgs) {
//   return fetch("/api/collections", { signal: request.signal });
// }

async function getCartCount(signal: AbortSignal) {
  let res = await fetch("/api/cart", { signal });
  let cart = await res.json();
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}

async function getCollections(signal: AbortSignal) {
  let res = await fetch("/api/collections", { signal });
  return await res.json();
}

export async function loader({ request }: LoaderFunctionArgs) {
  let cartCount = getCartCount(request.signal);
  let [collections] = await Promise.all([getCollections(request.signal)]);
  return defer({
    collections: collections.collections,
    cartCount,
  });
}
</script>

<script lang="ts" setup>
let data = useLoaderData();
let navigation = useNavigation();
</script>

<template>
  <span v-if="navigation.state !== 'idle'" class="global-spinner spin">🔄</span>

  <header>
    <div>
      <!-- <span class="cart">🛍 {{ data.cartCount }}</span> -->

      <Suspense>
        <template #fallback>
          <span class="cart spin">🔄</span>
        </template>
        <Await :resolve="data.cartCount" v-slot="value">
          <span class="cart">🛍 {{ value }}</span>
        </Await>
      </Suspense>

      <h1><Link to="/">Board Shop</Link></h1>
    </div>

    <nav>
      <div v-for="c in data.collections">
        <Link :to="`/collection/${c.handle}`">
          {{ c.title }}
        </Link>
      </div>
    </nav>
  </header>

  <main>
    <Outlet />
  </main>

  <footer>
    <p>Built with @remix-run/router and remix-router-vue &copy; 2022</p>
  </footer>
</template>

<style scoped>
header {
  position: relative;
}

.global-spinner {
  font-size: 3rem;
  position: absolute;
  top: 20px;
  left: 20px;
}

h1 a {
  color: black;
  text-decoration: none;
}
nav {
  display: flex;
  border-bottom: 1px solid black;
  padding: 1rem;
}

header h1 {
  text-align: center;
}

header span {
  float: right;
}

nav > * {
  flex-grow: 1;
  text-align: center;
}

.cart {
  font-size: 1.5rem;
}

.spin {
  animation-name: spin;
  animation-iteration-count: infinite;
  animation-duration: 1s;
}

footer {
  padding: 1rem;
  text-align: center;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
