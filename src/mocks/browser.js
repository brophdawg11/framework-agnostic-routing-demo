import { rest, setupWorker } from "msw";
import collections from "./data/collections.json";
import collectionsFull from "./data/collections-full.json";
import products from "./data/products.json";

let sleep = (n) => new Promise((r) => setTimeout(r, n));

let handlers = [
  rest.get("/api/collections", async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(collections));
  }),

  rest.get("/api/collections/:handle", async (req, res, ctx) => {
    let collection = collectionsFull.find(
      (c) => c.collection.handle === req.params.handle
    );
    if (!collection) {
      return res(ctx.status(404));
    }
    return res(ctx.status(200), ctx.json(collection));
  }),

  rest.get("/api/products/:handle", async (req, res, ctx) => {
    await sleep(2000);
    console.log("looking for ", req.params.handle);
    let product = products.find((p) => {
      console.log("checking against", p.product.handle);
      return p.product.handle === req.params.handle;
    });
    if (!product) {
      return res(ctx.status(404));
    }
    return res(ctx.status(200), ctx.json(product));
  }),
];

export const worker = setupWorker(...handlers);
