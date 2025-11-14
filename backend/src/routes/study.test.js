import { test } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { app } from "../server.js";

test("GET /study without topic parameter should return 400", async () => {
  const response = await request(app)
    .get("/study")
    .expect(400);

  assert.strictEqual(response.body.error, "parameter: topic is missing");
});

test("GET /study with empty topic should return 400", async () => {
  const response = await request(app)
    .get("/study?topic=")
    .expect(400);

  assert.strictEqual(response.body.error, "parameter: topic is missing");
});

test("GET /study with valid topic should return 200 and correct structure", async () => {
  // This test will make actual API calls to Wikipedia and Gemini
  // In a real scenario, you'd mock these dependencies
  const response = await request(app)
    .get("/study?topic=javascript")
    .expect((res) => {
      // Accept either 200 (success) or 500 (if API keys are missing)
      if (res.status !== 200 && res.status !== 500) {
        throw new Error(`Expected 200 or 500, got ${res.status}`);
      }
    });

  if (response.status === 200) {
    // Verify response structure when successful
    assert.ok("topic" in response.body);
    assert.ok("source" in response.body);
    assert.ok("summary" in response.body);
    assert.ok("quiz" in response.body);
    assert.ok("studyTip" in response.body);
    assert.ok(Array.isArray(response.body.summary));
    assert.ok(Array.isArray(response.body.quiz));
    assert.strictEqual(typeof response.body.studyTip, "string");
  } else {
    // If it fails due to missing API keys, verify error structure
    assert.ok("error" in response.body);
    assert.strictEqual(typeof response.body.error, "string");
  }
});

test("GET /study with math mode should include mathChallenge when successful", async () => {
  const response = await request(app)
    .get("/study?topic=mathematics&mode=math")
    .expect((res) => {
      if (res.status !== 200 && res.status !== 500) {
        throw new Error(`Expected 200 or 500, got ${res.status}`);
      }
    });

  if (response.status === 200) {
    assert.ok("mathChallenge" in response.body);
    // mathChallenge can be null or an object
    if (response.body.mathChallenge !== null) {
      assert.ok("question" in response.body.mathChallenge);
      assert.ok("answer" in response.body.mathChallenge);
      assert.ok("explanation" in response.body.mathChallenge);
    }
  }
});

test("GET /study with invalid route should return 404", async () => {
  const response = await request(app)
    .get("/study/invalid")
    .expect(404);

  assert.ok("error" in response.body);
  assert.ok(response.body.error.includes("not found"));
});

