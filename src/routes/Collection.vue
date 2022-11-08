<script lang="ts">
import { type LoaderFunctionArgs } from "@remix-run/router";
import { Link, useLoaderData, useLocation } from "remix-router-vue";

const PAGE_SIZE = 4;
const getPrice = (p) => parseFloat(p.variants.nodes[0].priceV2.amount);

export async function loader({ request, params }: LoaderFunctionArgs) {
  let url = new URL(request.url);
  let page = parseInt(url.searchParams.get("page") || "1", 10);
  let sort = url.searchParams.get("sort");
  let order = url.searchParams.get("order");

  // Fetch data
  let res = await fetch(`/api/collections/${params.handle}`, {
    signal: request.signal,
  });
  let data = await res.json();

  // Sort products and pick active page
  let startIndex = (page - 1) * PAGE_SIZE;
  let sortedProducts = [...data.collection.products.nodes];
  sortedProducts.sort((a, b) => {
    if (sort === "alphabetical") {
      return a.title.localeCompare(b.title) * (order === "desc" ? -1 : 1);
    } else {
      return (
        (getPrice(a) < getPrice(b) ? -1 : getPrice(a) > getPrice(b) ? 1 : 0) *
        (order === "desc" ? -1 : 1)
      );
    }
  });
  let products = sortedProducts.slice(startIndex, startIndex + PAGE_SIZE);
  let totalPages = Math.ceil(data.collection.products.nodes.length / PAGE_SIZE);

  // Generate prev/next links
  let prevParams = new URLSearchParams();
  if (page > 2) prevParams.append("page", String(page - 1));
  if (sort) prevParams.append("sort", sort);
  if (order) prevParams.append("order", order);
  let prevPageHref =
    page === 1 ? null : `${url.pathname}?${prevParams.toString()}`;

  let nextParams = new URLSearchParams();
  if (page < totalPages) nextParams.append("page", String(page + 1));
  if (sort) nextParams.append("sort", sort);
  if (order) nextParams.append("order", order);
  let nextPageHref =
    page >= totalPages ? null : `${url.pathname}?${nextParams.toString()}`;

  return {
    title: data.collection.title,
    products,
    currentSort: sort,
    currentOrder: order,
    currentPage: page,
    totalPages,
    prevPageHref,
    nextPageHref,
  };
}
</script>

<script lang="ts" setup>
let data = useLoaderData();
let location = useLocation();
</script>

<template>
  <div class="meta">
    <h2>{{ data.title }}</h2>

    <div class="sort">
      Price
      <Link :to="location.pathname"> ⬆️</Link>&nbsp;
      <Link :to="`${location.pathname}?sort=price&order=desc`">⬇️</Link>
      | Alphabetical
      <Link :to="`${location.pathname}?sort=alphabetical&order=asc`">⬆️</Link
      >&nbsp;
      <Link :to="`${location.pathname}?sort=alphabetical&order=desc`">⬇️</Link>
    </div>

    <div class="pagination">
      <Link v-if="data.prevPageHref" :to="data.prevPageHref">⏪</Link>
      <span v-else>⏪</span>
      Page {{ data.currentPage }} of {{ data.totalPages }}
      <Link v-if="data.nextPageHref" :to="data.nextPageHref">⏩</Link>
      <span v-else>⏩</span>
    </div>
  </div>

  <div class="grid">
    <div class="item" v-for="product in data.products">
      <Link :to="`/product/${product.handle}`">
        <img
          :src="`${product.variants.nodes[0].image.url}&width=640&height=800&crop=center`"
          :alt="product.variants.nodes[0].image.altText"
        />
        <h3>{{ product.title }}</h3>
        <h4>
          ${{ parseFloat(product.variants.nodes[0].priceV2.amount).toFixed(2) }}
        </h4>
      </Link>
    </div>
  </div>
</template>

<style scoped>
.meta {
  display: flex;
}

.meta > * {
  flex-grow: 1;
}

.pagination {
  font-size: 1.25rem;
  padding-top: 1rem;
  text-align: right;
}

.sort {
  font-size: 1.25rem;
  padding-top: 1rem;
  text-align: right;
}

.pagination a,
.sort a {
  text-decoration: none;
}

.pagination span {
  opacity: 0.25;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.item {
  text-align: center;
  transition: transform 100ms ease-in-out;
}

.item:hover {
  transform: scale3d(1.05, 1.05, 1.05);
}

.item a {
  color: black;
  text-decoration: none;
}

.item img {
  aspect-ratio: 640 / 800;
  width: 100%;
  object-fit: contain;
}
</style>
