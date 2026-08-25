import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

}

test("renders the medical atlas homepage and production metadata", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const markup = await response.text();
  assert.match(markup, /Human Anatomy, Physiology &amp; Pathology Atlas/i);
  assert.match(markup, /Anatomica/i);
  assert.doesNotMatch(markup, /Starter Project/i);
});

for (const route of [
  "/atlas",
  "/atlas/structure/ANAT_HEART_LV",
  "/systems/cardiovascular",
  "/disease/DIS_AORTIC_STENOSIS",
  "/references",
  "/admin/login",
  "/admin",
  "/atlas/respiratory",
  "/imaging/IMG_CHEST_CT_EDU",
  "/admin/imaging",
]) {
  test(`renders ${route}`, async () => {
    const response = await render(route);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.doesNotMatch(await response.text(), /Starter Project/i);
  });
}
