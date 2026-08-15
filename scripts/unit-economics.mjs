const plans = {
  pilot: { name: "Pilot", monthlySek: 2_900, setupSek: 2_000, includedMinutes: 500 },
  premium: { name: "Premium", monthlySek: 4_900, setupSek: 0, includedMinutes: 1_500 },
};

const parsedArgs = parseArgs(process.argv.slice(2));
const selectedPlan = plans[parsedArgs.plan || "pilot"];

if (!selectedPlan) {
  fail(`Unknown plan. Use --plan pilot or --plan premium.`);
}

const costInput = numberInput(parsedArgs.cost, process.env.LEADMAP_BLENDED_COST_SEK_PER_MINUTE);
const sharedCostSek = numberInput(
  parsedArgs.shared,
  process.env.LEADMAP_SHARED_COST_SEK_PER_CUSTOMER,
  300,
);
const targetMarginPercent = numberInput(
  parsedArgs.margin,
  process.env.LEADMAP_TARGET_GROSS_MARGIN_PERCENT,
  70,
);
const usageMinutes = numberInput(parsedArgs.minutes, undefined, selectedPlan.includedMinutes);
const acquisitionCostSek = numberInput(parsedArgs.cac, undefined, 0);
const overageSekPerMinute = 2.5;

if (costInput === undefined) {
  console.log("No blended per-minute cost supplied.");
  console.log(
    "Run: npm run economics -- --plan pilot --cost 1.20 --shared 300 --minutes 500 --cac 4000",
  );
  console.log("\nIllustrative scenarios only; replace them with the configured provider cost.\n");
  for (const scenarioCost of [0.75, 1.5, 3]) {
    printResult(
      calculate({
        plan: selectedPlan,
        costSekPerMinute: scenarioCost,
        sharedCostSek,
        targetMarginPercent,
        usageMinutes,
        acquisitionCostSek,
        overageSekPerMinute,
      }),
    );
  }
  process.exitCode = 1;
} else {
  const result = calculate({
    plan: selectedPlan,
    costSekPerMinute: costInput,
    sharedCostSek,
    targetMarginPercent,
    usageMinutes,
    acquisitionCostSek,
    overageSekPerMinute,
  });
  printResult(result);
  if (!result.passesTarget || !result.overagePassesTarget) process.exitCode = 2;
}

function calculate({
  plan,
  costSekPerMinute,
  sharedCostSek,
  targetMarginPercent,
  usageMinutes,
  acquisitionCostSek,
  overageSekPerMinute,
}) {
  const overageMinutes = Math.max(0, usageMinutes - plan.includedMinutes);
  const recurringRevenueSek = plan.monthlySek + overageMinutes * overageSekPerMinute;
  const usageCostSek = usageMinutes * costSekPerMinute;
  const grossProfitSek = recurringRevenueSek - usageCostSek - sharedCostSek;
  const grossMarginPercent = recurringRevenueSek ? (grossProfitSek / recurringRevenueSek) * 100 : 0;
  const firstMonthContributionSek = grossProfitSek + plan.setupSek - acquisitionCostSek;
  const targetMargin = targetMarginPercent / 100;
  const maxCostAtIncludedUsage =
    (plan.monthlySek * (1 - targetMargin) - sharedCostSek) / plan.includedMinutes;
  const overageMarginPercent =
    ((overageSekPerMinute - costSekPerMinute) / overageSekPerMinute) * 100;
  const remainingCacAfterSetup = Math.max(0, acquisitionCostSek - plan.setupSek);
  const monthsToRecoverCac =
    grossProfitSek > 0 ? Math.ceil(remainingCacAfterSetup / grossProfitSek) : null;

  return {
    plan,
    costSekPerMinute,
    sharedCostSek,
    targetMarginPercent,
    usageMinutes,
    overageMinutes,
    recurringRevenueSek,
    usageCostSek,
    grossProfitSek,
    grossMarginPercent,
    firstMonthContributionSek,
    acquisitionCostSek,
    maxCostAtIncludedUsage,
    overageMarginPercent,
    monthsToRecoverCac,
    passesTarget: grossMarginPercent >= targetMarginPercent,
    overageProfitable: costSekPerMinute < overageSekPerMinute,
    overagePassesTarget: overageMarginPercent >= targetMarginPercent,
  };
}

function printResult(result) {
  const money = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });
  const decimal = new Intl.NumberFormat("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  console.log(`${result.plan.name} · ${result.usageMinutes} minutes`);
  console.log(`Recurring revenue: ${money.format(result.recurringRevenueSek)} SEK`);
  console.log(`Usage cost: ${money.format(result.usageCostSek)} SEK`);
  console.log(`Shared cost allocation: ${money.format(result.sharedCostSek)} SEK`);
  console.log(`Gross profit: ${money.format(result.grossProfitSek)} SEK`);
  console.log(`Gross margin: ${decimal.format(result.grossMarginPercent)}%`);
  console.log(
    `First-month contribution after setup and CAC: ${money.format(result.firstMonthContributionSek)} SEK`,
  );
  console.log(
    `Maximum blended minute cost for ${result.targetMarginPercent}% margin at included usage: ${decimal.format(Math.max(0, result.maxCostAtIncludedUsage))} SEK`,
  );
  console.log(
    `Overage gross margin at 2.50 SEK/min: ${decimal.format(result.overageMarginPercent)}%`,
  );
  console.log(
    `CAC recovery including setup: ${result.monthsToRecoverCac === null ? "never at this usage" : `${result.monthsToRecoverCac} recurring month(s)`}`,
  );
  console.log(
    `Decision: ${result.passesTarget && result.overagePassesTarget ? "PASS" : "HOLD — reprice, reduce included minutes, or lower provider cost"}`,
  );
  console.log("");
}

function parseArgs(args) {
  const result = {};
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (!value.startsWith("--")) continue;
    result[value.slice(2)] = args[index + 1];
    index += 1;
  }
  return result;
}

function numberInput(primary, secondary, fallback) {
  const raw = primary ?? secondary;
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) fail(`Invalid numeric input: ${raw}`);
  return value;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
