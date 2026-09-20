# Official course map - learn-finance-with-phoebe

Bucket `biz`, difficulty d3, 16 sessions, Leader 6 + Practitioner 10.
Company: **Marchmont Instruments**, a fictional maker of laboratory instruments selling B2B on
credit. Scope chosen 2026-09-20: **corporate statements and cash**, not personal finance.

---

## The seam - read this before writing a single page

`biz` was an empty shelf. This is its first course, so the seam is against live siblings in other
buckets and against one planned sibling on this shelf.

| Subject | Owner | This course |
|---|---|---|
| AI applied to finance work: month-end close, FP&A forecasting, reporting narrative | `learn-ai-finance-with-phoebe` (aiap, 16 sessions, LIVE) | Not touched. That course assumes finance literacy; this one supplies it. Verified: it returns **zero hits** on `cash flow statement`, `working capital`, `accrual`, `balance sheet`, `three statements`, `accounts receivable`. |
| Valuation, intrinsic value, DCF, margin of safety, thinking like an owner | `learn-value-investing-with-phoebe` (biz d3, PLANNED) | Named once as where valuation lives. **No DCF, no intrinsic value, no multiples.** This course stops at reading and modelling the statements. |
| CAC, LTV, unit economics, contribution margin | `learn-strategic-thinking`, `learn-okr`, `learn-metric-decomposition`, `learn-customer-retention`, `learn-ecommerce-metrics` | Not taught. These are well covered: `CAC` appears in 10 pages, `LTV` in 10, `unit economics` in 3, `gross margin` in 7. A session on unit economics was **cut from the plan** because of this. |
| Driver trees, decomposing a metric, diagnosing a drop | `learn-metric-decomposition-with-phoebe` (data d2, 16 sessions) | Not taught. |
| Running a data office budget and portfolio | `learn-data-pmo-with-phoebe` | Not taught. |
| Personal finance: budgeting, saving, debt, retirement | Nobody, by choice | **Out of scope.** The hub card said "personal and corporate"; the card is being narrowed at flip. Personal finance is a different discipline and sits close to financial advice. |

**What is genuinely unowned, and therefore what this course is:** the statements themselves and
how cash moves through them. Estate-wide precise counts before this build:
`cash flow statement` **0**, `working capital` **0**, `free cash flow` **0**,
`accounts receivable` **0**, `accounts payable` **0**, `accrual` **0**, `deferred revenue` **0**.
`balance sheet` returned 5 hits, all passing mentions in four unrelated courses
(ai-media-domain, data-governance, metric-decomposition, performance-management), checked
individually rather than assumed.

---

## Frozen canon - the Marchmont model

Computed in node from `assets/fin-live.js` before any page quoted a number. Every figure is
produced by running a real three-statement model. **Any page citing these must match exactly.**

**The balance sheet ties.** Across the full canon set of **50 model runs** (5 growth rates x 5 DSO
settings x 2 horizons) the worst assets-minus-liabilities-and-equity error is **2.24e-8**, which is
floating point noise. `MARCHMONT.ties()` reports this and a model that does not tie is reported as
broken rather than plotted.

### The base case

Assumptions: month 1 revenue £400,000, growth **4% a month**, gross margin **42%**, fixed opex
£95,000, variable opex 11% of revenue, **DSO 75**, DIO 60, **DPO 30**, tax 25%, interest 9% a year,
opening cash £250,000, opening debt £300,000, capex 3% of revenue, 60 month depreciation life,
opening net fixed assets £480,000.

**Opening equity is solved, not assumed.** The model sets it to whatever makes the opening sheet
tie, which is **£1,662,000**. That is not a fudge: it is the accumulated history of a company
that existed before month 1.

**The 50 run canon set** is the five growth rates **0%, 2%, 4%, 6%, 8%** crossed with the five
DSO settings **30, 45, 60, 75, 90 days**, each run to both **24 and 48 months**.

Opening working capital is set consistently with month 1 activity, so the working capital build
starts in month 2 and month 1 shows a delta of zero. That is a modelling choice and pages that
show the month 1 row must not present it as a finding.

| Month | Revenue | Net income | Change in WC | Free cash flow | Cash |
|---|---|---|---|---|---|
| 1 | £400,000 | £14,062 | £0 | £10,062 | £260,062 |
| 2 | £416,000 | £17,732 | £49,280 | -£35,961 | £224,102 |
| 3 | £432,640 | £21,546 | £51,251 | -£34,544 | £189,558 |
| 4 | £449,946 | £25,509 | £53,301 | -£33,070 | £156,488 |
| 5 | £467,943 | £29,628 | £55,433 | -£31,535 | £124,953 |
| 6 | £486,661 | £33,908 | £57,651 | -£29,938 | £95,015 |
| 7 | £506,128 | £38,356 | £59,957 | -£28,276 | £66,738 |
| 8 | £526,373 | £42,980 | £62,355 | -£26,547 | £40,191 |
| 9 | £547,428 | £47,786 | £64,849 | -£24,748 | £15,443 |
| 10 | £569,325 | **£52,781** | £67,443 | -£22,876 | **-£7,432** |
| 11 | £592,098 | £57,973 | £70,141 | -£20,928 | -£28,360 |
| 12 | £615,782 | **£63,370** | £72,946 | -£18,901 | **-£47,261** |

**The two columns move in opposite directions, every month, monotonically.** Net income rises from
£14,062 to £63,370 and never once shows a loss. Cash falls from £260,062 to -£47,261.

Twelve month totals: **net income £445,631**, **free cash flow -£297,261**, a gap of **£742,892**,
of which the working capital build accounts for **£664,607**.

Cash first goes negative in **month 10**, in the same month net income reaches £52,781, its best
month up to that point.

The first negative month and the trough are **nine months and £108,069 apart** (-£7,432 in month 10 against -£115,501 in month 19). Funding the first figure covers month 10 and nothing after it: the balance is -£28,360 in month 11. **Do not write that it buys nine more weeks** - that claim was in an early brief, the model contradicts it, and an agent caught it before it shipped.

### The twelve month bridge, in full

Every row computed from the model. The bridge ties exactly: net income plus depreciation less the
working capital build gives operating cash flow, and operating cash flow less capex gives free
cash flow.

| Line | 12 month total |
|---|---|
| Net income | £445,631 |
| Add back depreciation | £102,025 |
| Less the working capital build | -£664,607 |
| **Operating cash flow** | **-£116,951** |
| Less capital spending | -£180,310 |
| **Free cash flow** | **-£297,261** |

Depreciation is added back because it is a cost that took no cash out of the bank this period.
Capital spending is subtracted because it took cash out without appearing as a cost.

### Monthly working capital balances and operating cash flow

| Month | Operating cash flow | Receivables | Inventory | Payables |
|---|---|---|---|---|
| 1 | £22,062 | £1,000,000 | £464,000 | £232,000 |
| 2 | -£23,481 | £1,040,000 | £482,560 | £241,280 |
| 3 | -£21,565 | £1,081,600 | £501,862 | £250,931 |
| 4 | -£19,571 | £1,124,864 | £521,937 | £260,968 |
| 5 | -£17,497 | £1,169,859 | £542,814 | £271,407 |
| 6 | -£15,338 | £1,216,653 | £564,527 | £282,263 |
| 7 | -£13,093 | £1,265,319 | £587,108 | £293,554 |
| 8 | -£10,756 | £1,315,932 | £610,592 | £305,296 |
| 9 | -£8,325 | £1,368,569 | £635,016 | £317,508 |
| 10 | -£5,796 | £1,423,312 | £660,417 | £330,208 |
| 11 | -£3,165 | £1,480,244 | £686,833 | £343,417 |
| 12 | -£427 | £1,539,454 | £714,307 | £357,153 |

Operating cash flow is negative in every month from month 2 onward and climbs steadily back
towards zero, reaching -£427 by month 12. Receivables alone grow by £539,454 over the year.

### The income statement, priced, for month 1 and month 12

Every line as the model computes it. Costs are shown with a minus sign the way a statement
presents them.

| Line | Month 1 | Month 12 |
|---|---|---|
| Revenue | £400,000 | £615,782 |
| Cost of sales | -£232,000 | -£357,153 |
| Gross profit | £168,000 | £258,628 |
| Operating expenses | -£139,000 | -£162,736 |
| EBITDA | £29,000 | £95,892 |
| Depreciation | -£8,000 | -£9,149 |
| EBIT | £21,000 | £86,743 |
| Interest | -£2,250 | -£2,250 |
| Tax | -£4,687 | -£21,123 |
| **Net income** | **£14,062** | **£63,370** |

Each subtotal was checked against the line above it in both months.

### The opening balance sheet

Total assets at month 0 are **£2,194,000** and the claims against them total the same. The
components are opening cash £250,000, receivables £1,000,000, inventory £464,000 and net fixed
assets £480,000, against payables £232,000, debt £300,000 and the solved equity of £1,662,000.

### It is a funding gap, not a death - the finding that was nearly written wrong

Run the base case to 48 months rather than 24 and the company **recovers on its own in month 28**,
after **18 months underwater**, having troughed at **-£115,501 in month 19**.

**A first pass of this bench stopped at 24 months and the sentence "a profitable company runs out
of cash and dies" was about to be written. It is wrong.** Marchmont is viable: the margins are
fine and the business recovers without any change. What it has is a **financing requirement of
about £115,501** to survive growth it has already committed to. Borrowing is therefore a
legitimate answer here, not a deferral, which is the opposite of what the first draft claimed.
That near-miss is course material and is taught in p9.

### Growth is what creates the gap

Profit rises monotonically with growth while the cash position collapses.

| Monthly growth | Cash out | Trough | Recovers | 12m net income |
|---|---|---|---|---|
| 0% | never | £260,062 (m1) | - | £165,627 |
| 2% | never | £186,555 (m12) | - | £296,285 |
| 4% | month 10 | **-£115,501 (m19)** | month 28 | £445,631 |
| 6% | month 6 | -£897,962 (m31) | not by month 48 | £616,336 |
| 8% | month 5 | -£7,885,358 (m48) | not by month 48 | £811,427 |

Between 2% and 4% a funding gap appears. **Between 4% and 6% it stops being a temporary gap and
becomes unfundable within four years.** At 8% growth Marchmont earns nearly five times the profit
of the flat case and is almost eight million pounds in the hole.

### The levers, measured (24 month horizon, base case otherwise)

Base: cash out month 10, cash at month 12 **-£47,261**.

| Lever | Cash out | Cash at m12 | 12m net income |
|---|---|---|---|
| Collect in 45 days not 75 | never | £168,521 | £445,631 |
| Collect in 60 days not 75 | never | £60,630 | £445,631 |
| Pay suppliers in 60 not 30 | never | £77,892 | £445,631 |
| Hold 30 days stock not 60 | never | £77,892 | £445,631 |
| Grow 2% a month not 4% | never | £186,555 | £296,285 |
| Gross margin 47% not 42% | never | £188,915 | £671,018 |
| Cut fixed opex by £15,000 | never | £87,739 | £580,631 |
| Borrow another £300,000 | never | £232,489 | £425,381 |

**The first four levers change no profit at all.** Collecting faster, paying slower and holding
less stock move cash without touching the income statement by a single pound, which is the
clearest possible demonstration that profit and cash are different questions.

**A claim NOT to make.** Do not write that the working capital levers are free. Collecting in 45
days instead of 75 means changing terms customers have already agreed, paying suppliers in 60
means spending their goodwill, and holding 30 days of stock means risking a stockout. The model
prices the cash and says nothing about those costs, and pages must say so wherever a lever appears.

---

## Coverage per session

`✓` = taught to working depth. `◐` = named and handed to the session or course that owns it.

### Leader track

| Session | Covers | Depth |
|---|---|---|
| a1 What a set of accounts is for | Why three statements and not one; the question each answers; stocks against flows | ✓ |
| a2 Profit is an opinion, cash is a fact | Accruals; revenue recognised before it is collected; the £445,631 against -£297,261 gap | ✓ |
| a3 Where the money actually went | The cash flow statement as the bridge; reading the working capital line | ✓ |
| a4 The cost of growing | The growth ladder; why the best month can be the month you run out | ✓ |
| a5 Reading someone else's accounts | What a set of published accounts can and cannot tell you; the questions to ask | ✓ |
| a6 Defending a number | Taking a funding requirement to a board or a bank; what the £115,501 is and how to justify it | ✓ |
| Valuation, DCF, multiples | Handed to `learn-value-investing` | ◐ |
| CAC, LTV, unit economics | Handed to `learn-strategic-thinking` and `learn-okr` | ◐ |

### Practitioner track

| Session | Covers | Depth |
|---|---|---|
| p1 The three statements, wired together | Building the skeleton; why the sheet must tie | ✓ |
| p2 The income statement | Revenue, COGS, opex, depreciation, interest, tax, down to net income | ✓ |
| p3 Working capital | DSO, DIO, DPO; how each becomes a cash movement | ✓ |
| p4 The cash flow statement | Net income to operating cash flow; the indirect method built line by line | ✓ |
| p5 The balance sheet and the tie | Why it ties, what it means when it does not, the 2.24e-8 check | ✓ |
| p6 Driving the model | Assumptions as inputs; the growth ladder run live | ✓ |
| p7 The levers | The eight levers measured, and the four that move no profit at all | ✓ |
| p8 Sizing a funding requirement | The trough, the buffer, and what to ask for | ✓ |
| p9 The finding that changed at 48 months | A 24 month window said the company died; it recovers in month 28 | ✓ |
| p10 The model bench | Build it, break it, watch the tie fail, size the gap | ✓ |
| AI for close and forecasting | Pointed at `learn-ai-finance` | ◐ |

## Not covered, by design

- **Personal finance.** Budgeting, saving, debt, retirement. Out of scope by decision.
- **Valuation.** `learn-value-investing`.
- **Unit economics, CAC, LTV.** Already owned by five live courses.
- **Tax planning, audit, statutory filing.** Jurisdiction specific and not the point.
- **Investment advice of any kind.** Nothing on any page recommends buying or selling anything.

## Re-verify before delivery

The model is deterministic. If `fin-live.js` is edited, re-run the node harness, confirm the tie
across all 50 canon runs, and update every number in this file before touching a page.
**Any new claim must be run across at least five settings AND to at least 48 months before it is
written down** - the "profitable company dies" headline survived 24 months and died at 48.
