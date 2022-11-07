<script lang="ts">
import { computed } from "@vue/reactivity";
import {
  Await,
  defer,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
} from "remix-router-vue";

async function getCartCount() {
  let res = await fetch("/api/cart");
  let cart = await res.json();
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}

export async function loader() {
  let res = await fetch("/api/collections");
  let collections = await res.json();
  let cartCount = await getCartCount();
  return {
    collections: collections.collections,
    cartCount,
  };
}
</script>

<script lang="ts" setup>
let data = useLoaderData();
let location = useLocation();
let navigation = useNavigation();

console.log(navigation.value);
let isNavigating = computed(
  () =>
    navigation.value.state !== "idle" &&
    navigation.value.location.pathname !== location.value.pathname
);
</script>

<template>
  <header>
    <div>
      <!-- <Suspense>
        <template #fallback>
          <span>🔄</span>
        </template>
        <Await :resolve="data.cartCount" v-slot="value">
          <span>🛍 {{ value || null }}</span>
        </Await>
      </Suspense> -->
      <span>🛍 {{ data.cartCount || null }}</span>
      <h1><Link to="/">Shop</Link></h1>
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
    <div v-if="isNavigating" class="overlay">
      <p class="spin">🔄</p>
    </div>
    <div :style="{ opacity: isNavigating ? '0.5' : 1 }">
      <Outlet />
    </div>
  </main>
  <footer>
    <p>Built with @remix-run/router and remix-router-vue &copy; 2022</p>
  </footer>
</template>

<style scoped>
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

main {
  position: relative;
}

.overlay {
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spin {
  font-size: 3rem;
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
