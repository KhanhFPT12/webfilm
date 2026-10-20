import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const outDir = "C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\77d547a7-9b70-4c9e-9864-1b4616eeea5c\\screenshots";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  const port = 9333;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "edge-profile-"));
  const browser = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--blink-settings=preferredColorScheme=1",
    "about:blank",
  ]);

  let ver;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const verRes = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (verRes.ok) {
        ver = await verRes.json();
        break;
      }
    } catch {}
  }

  if (!ver) {
    throw new Error("Could not connect to Edge debugging port");
  }

  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data);
      pending.delete(data.id);
    }
  };

  await new Promise((r) => (ws.onopen = r));

  function send(method, params = {}, sessionId) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
    });
  }

  const { result: { targetId } } = await send("Target.createTarget", { url: "about:blank" });
  const { result: { sessionId } } = await send("Target.attachToTarget", { targetId, flatten: true });

  await send("Page.enable", {}, sessionId);

  const viewports = [
    { name: "true-mobile-390x844", w: 390, h: 844, mobile: true, url: "http://localhost:4173/" },
    { name: "true-tablet-768x1024", w: 768, h: 1024, mobile: true, url: "http://localhost:4173/" },
    { name: "true-laptop-1280x800", w: 1280, h: 800, mobile: false, url: "http://localhost:4173/" },
    { name: "true-desktop-1440x900", w: 1440, h: 900, mobile: false, url: "http://localhost:4173/" },
    { name: "true-mobile-search", w: 390, h: 844, mobile: true, url: "http://localhost:4173/tim-kiem" },
    { name: "true-desktop-detail", w: 1440, h: 900, mobile: false, url: "http://localhost:4173/phim/mang-vu-khi-xuyen-ve-dai-tong-phan-4" },
    { name: "true-mobile-detail", w: 390, h: 844, mobile: true, url: "http://localhost:4173/phim/mang-vu-khi-xuyen-ve-dai-tong-phan-4" }
  ];

  for (const vp of viewports) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: vp.mobile,
    }, sessionId);

    await send("Page.navigate", { url: vp.url }, sessionId);
    await sleep(2500);

    const { result: { data } } = await send("Page.captureScreenshot", { format: "png" }, sessionId);
    fs.writeFileSync(`${outDir}\\${vp.name}.png`, Buffer.from(data, "base64"));
    console.log(`Saved ${vp.name}.png`);
  }

  ws.close();
  browser.kill();
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch {}
  process.exit(0);
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});
