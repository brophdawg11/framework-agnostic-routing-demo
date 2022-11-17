import { rest, setupWorker } from "msw";
import collections from "./data/collections.json";
import collectionsFull from "./data/collections-full.json";
import products from "./data/products.json";

window.ALL_SLOW = false;
window.CART_SLOW = false;

let sleep = (n) => new Promise((r) => setTimeout(r, n));
let sleepIfSlow = () => (window.ALL_SLOW ? sleep(1500) : sleep(500));

let handlers = [
  rest.get("/api/collections", async (req, res, ctx) => {
    await sleepIfSlow();
    return res(ctx.status(200), ctx.json(collections));
  }),

  rest.get("/api/collections/:handle", async (req, res, ctx) => {
    await sleepIfSlow();
    let collection = collectionsFull.find(
      (c) => c.collection.handle === req.params.handle
    );
    if (!collection) {
      return res(ctx.status(404));
    }
    return res(ctx.status(200), ctx.json(collection));
  }),

  rest.get("/api/products/:handle", async (req, res, ctx) => {
    await sleepIfSlow();
    let product = products.find((p) => p.product.handle === req.params.handle);
    if (!product) {
      return res(ctx.status(404));
    }
    return res(ctx.status(200), ctx.json(product));
  }),

  rest.get("/api/cart", async (req, res, ctx) => {
    await (window.CART_SLOW ? sleep(1500) : sleepIfSlow());
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : { items: [] };
    return res(ctx.status(200), ctx.json(cart));
  }),

  rest.post("/api/cart", async (req, res, ctx) => {
    await sleepIfSlow();
    let data = JSON.parse(await req.text());
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : { items: [] };

    if (data.material === "Wood-composite") {
      return res(ctx.status(400), ctx.json({ message: "Bad request" }));
    }

    let existingItem = cart.items.find(
      (item) => JSON.stringify(item.data) === JSON.stringify(data)
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ data, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return res(ctx.status(201), ctx.json(data));
  }),
];

export const worker = setupWorker(...handlers);
