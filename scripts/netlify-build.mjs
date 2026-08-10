import { spawn, spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";
const nodeCmd = process.execPath;
const serverUrl = "http://localhost:3000/";

function runSync(command, args, { shell = false } = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", shell });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with code ${result.status}`);
  }
}

function killTree(child) {
  if (!child.pid) return;
  if (isWindows) {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
  } else {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      child.kill("SIGTERM");
    }
  }
}

async function waitForServer(url, { timeoutMs = 60_000, intervalMs = 500 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server not accepting connections yet — keep polling.
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  // vinext start serves the already-built worker from dist/, and
  // build-netlify-preview.mjs fetches its rendered HTML from localhost —
  // both steps need dist/ populated first.
  console.log("[netlify-build] 1/3 building the vinext production bundle...");
  runSync(npmCmd, ["run", "build"], { shell: isWindows });

  console.log("[netlify-build] 2/3 starting the built worker locally...");
  const server = spawn(npmCmd, ["run", "start"], {
    stdio: "inherit",
    detached: !isWindows,
    shell: isWindows,
  });

  try {
    await waitForServer(serverUrl);
    console.log("[netlify-build] 3/3 exporting the static Netlify bundle...");
    runSync(nodeCmd, ["scripts/build-netlify-preview.mjs"]);
  } finally {
    console.log("[netlify-build] stopping local server...");
    killTree(server);
  }
}

main()
  .then(() => {
    console.log("[netlify-build] done.");
  })
  .catch((error) => {
    console.error("[netlify-build] failed:", error.message);
    process.exitCode = 1;
  });
