import { performance } from "node:perf_hooks";

type StudentRecord = {
  id: string;
  name: string;
};

type RequestStat = {
  label: string;
  ok: boolean;
  status: number;
  durationMs: number;
  error?: string;
};

const BASE_URL = process.env.LOAD_TEST_BASE_URL || "http://localhost:5000";
const STUDENT_COUNT = Number(process.env.LOAD_TEST_STUDENTS || 1000);
const CREATE_PARALLELISM = Number(process.env.LOAD_TEST_CREATE_PARALLEL || 50);
const STUDENT_PARALLELISM = Number(process.env.LOAD_TEST_STUDENT_PARALLEL || 200);
const CLEANUP_PARALLELISM = Number(process.env.LOAD_TEST_CLEANUP_PARALLEL || 80);

async function requestJson(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return { ok: res.ok, status: res.status, data };
}

async function runPool<T>(items: T[], parallelism: number, worker: (item: T, index: number) => Promise<void>) {
  let current = 0;

  const runners = Array.from({ length: parallelism }).map(async () => {
    while (true) {
      const index = current;
      current += 1;
      if (index >= items.length) break;
      await worker(items[index], index);
    }
  });

  await Promise.all(runners);
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}

function summarize(stats: RequestStat[]) {
  const durations = stats.map((s) => s.durationMs);
  const okCount = stats.filter((s) => s.ok).length;

  return {
    total: stats.length,
    success: okCount,
    failed: stats.length - okCount,
    successRate: stats.length ? ((okCount / stats.length) * 100).toFixed(2) : "0.00",
    minMs: durations.length ? Math.min(...durations).toFixed(2) : "0.00",
    avgMs: durations.length ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2) : "0.00",
    p50Ms: percentile(durations, 50).toFixed(2),
    p95Ms: percentile(durations, 95).toFixed(2),
    p99Ms: percentile(durations, 99).toFixed(2),
    maxMs: durations.length ? Math.max(...durations).toFixed(2) : "0.00",
  };
}

async function main() {
  console.log(`Load test target: ${BASE_URL}`);
  console.log(`Students: ${STUDENT_COUNT} (parallel student simulation: ${STUDENT_PARALLELISM})`);

  const initRes = await requestJson("/api/init", { method: "POST" });
  if (!initRes.ok) {
    throw new Error(`Failed to initialize app: status ${initRes.status}`);
  }

  const students: StudentRecord[] = [];

  const createStart = performance.now();
  await runPool(Array.from({ length: STUDENT_COUNT }), CREATE_PARALLELISM, async (_, idx) => {
    const tag = `${Date.now()}_${idx}`;
    const payload = {
      name: `Load Student ${idx}`,
      teamName: `Load Team ${Math.floor(idx / 5)}`,
      phone: `9${String(100000000 + idx).slice(0, 9)}`,
      email: `load_${tag}@test.local`,
      assignedRound: "round1",
      autoAssignScenario: false,
    };

    const created = await requestJson("/api/participants", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (created.ok && created.data?.participant?.id) {
      students.push({ id: created.data.participant.id, name: payload.name });
      return;
    }

    throw new Error(`Create failed for index ${idx}: status ${created.status}`);
  });
  const createDuration = performance.now() - createStart;

  console.log(`Created ${students.length}/${STUDENT_COUNT} participants in ${createDuration.toFixed(2)}ms`);

  const requestStats: RequestStat[] = [];
  const overallStart = performance.now();

  await runPool(students, STUDENT_PARALLELISM, async (student) => {
      const steps = [
        {
          label: "GET participant",
          run: async () => requestJson(`/api/participants/${student.id}`),
        },
        {
          label: "START round1",
          run: async () => requestJson(`/api/round1/questions?participantId=${student.id}&action=start`),
        },
      ];

      for (const step of steps) {
        const started = performance.now();
        try {
          const result = await step.run();
          requestStats.push({
            label: step.label,
            ok: result.ok,
            status: result.status,
            durationMs: performance.now() - started,
          });
        } catch (error) {
          requestStats.push({
            label: step.label,
            ok: false,
            status: 0,
            durationMs: performance.now() - started,
            error: String(error),
          });
        }
      }
    });

  const overallDuration = performance.now() - overallStart;

  const summaryAll = summarize(requestStats);
  const byLabel = Array.from(new Set(requestStats.map((s) => s.label))).map((label) => {
    const filtered = requestStats.filter((s) => s.label === label);
    return { label, ...summarize(filtered) };
  });

  const throughput = requestStats.length > 0 ? (requestStats.length / (overallDuration / 1000)).toFixed(2) : "0.00";

  console.log("\n=== OVERALL RESULTS ===");
  console.log(summaryAll);
  console.log(`Total test duration: ${overallDuration.toFixed(2)}ms`);
  console.log(`Throughput: ${throughput} req/s`);

  console.log("\n=== BY ENDPOINT STEP ===");
  for (const row of byLabel) {
    console.log(row);
  }

  const failedSamples = requestStats.filter((s) => !s.ok).slice(0, 10);
  if (failedSamples.length > 0) {
    console.log("\n=== SAMPLE FAILURES ===");
    for (const sample of failedSamples) {
      console.log(sample);
    }
  }

  const cleanupStart = performance.now();
  await runPool(students, CLEANUP_PARALLELISM, async (student) => {
    await requestJson(`/api/participants/${student.id}`, { method: "DELETE" });
  });
  const cleanupDuration = performance.now() - cleanupStart;

  console.log(`\nCleanup completed in ${cleanupDuration.toFixed(2)}ms`);
}

main().catch((error) => {
  console.error("Load test failed:", error);
  process.exitCode = 1;
});
