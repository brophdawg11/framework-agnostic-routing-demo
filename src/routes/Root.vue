<script lang="ts">
import { Link, Outlet, useLoaderData } from "remix-router-vue";

export async function loader() {
  return fetch("/api/collections");
}
</script>

<script lang="ts" setup>
let data = useLoaderData();
</script>

<template>
  <header>
    <h1><Link to="/">Super Awesome Snowboard Shop</Link></h1>
    <nav>
      <Link v-for="c in data.collections" :to="`/collection/${c.handle}`">
        {{ c.title }}
      </Link>
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

nav a {
  flex-grow: 1;
  text-align: center;
}

footer {
  padding: 1rem;
  text-align: center;
}
</style>
