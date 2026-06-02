const EXACT_AGGREGATE_LABELS = new Set([
  "city states",
  "greek city states",
  "islamic states",
  "thai kingdoms",
  "rajput clans and small states",
  "minor states",
  "minor hindu and buddhist kingdoms",
  "minor hindu and buddhist states",
  "minor hindu buddhist states",
  "minor hindu kingdoms",
  "minor states under indian influence",
  "hindu kingdoms and republics",
  "maya city states",
  "maya chiefdoms and states",
  "maya states",
  "mesoamerican city states and chiefdoms",
  "islamic city states",
  "islamic and hindu states",
  "state societies and aramaean kingdoms",
  "laotian states",
  "hausa states",
  "mossi states",
  "mon states",
  "zhou states",
  "zhow states",
]);

const AGGREGATE_PATTERNS = [
  /\bcity states\b/i,
  /\bchiefdoms\b/i,
  /\bminor .*\b(states|kingdoms)\b/i,
  /\bclans and small states\b/i,
  /\bkingdoms and republics\b/i,
  /\bstates and chiefdoms\b/i,
  /\bstate societies\b/i,
  /\bkingdoms\b/i,
];

function normaliseLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[–—-]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isAggregateLabel(labelOrSlug: string): boolean {
  const n = normaliseLabel(labelOrSlug);
  if (!n) return false;
  if (EXACT_AGGREGATE_LABELS.has(n)) return true;
  return AGGREGATE_PATTERNS.some((re) => re.test(n));
}
