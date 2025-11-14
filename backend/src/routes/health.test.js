import { test } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { app } from "../server.js";

test("GET /health should return 200 with status ok", async () => {
  const response = await request(app)
    .get("/health")
    .expect(200);

  assert.strictEqual(response.body.status, "ok");
  assert(typeof response.body.timestamp === "string");
  assert.ok(new Date(response.body.timestamp).getTime() > 0);
});

test("GET /health should have correct response structure", async () => {
  const response = await request(app)
    .get("/health")
    .expect(200);

  assert.ok("status" in response.body);
  assert.ok("timestamp" in response.body);
  assert.strictEqual(Object.keys(response.body).length, 2);
});

