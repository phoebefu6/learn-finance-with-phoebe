# Learn Finance with Phoebe

**Reading a company's numbers.** Sixteen 45-minute sessions on the three statements, why profit
and cash pull apart, what growth actually costs, and how to size a funding gap and ask for it.

Live: https://phoebefu6.github.io/learn-finance-with-phoebe/

In month 10, Marchmont Instruments earned £52,781. It was the best month the company had ever
had, every month before it had also been profitable, and nobody had made a mistake. In the same
month the bank balance went to minus £7,432. Both numbers are correct and both come out of the
same set of books.

## Two tracks

**Leader, six sessions, no spreadsheets.** What a set of accounts is for; profit is an opinion and
cash is a fact; where the money actually went; the cost of growing; reading accounts somebody else
prepared; and defending a number in front of a board or a bank.

**Practitioner, ten sessions, hands on.** The three statements wired together; the income
statement line by line; working capital; the cash flow statement; the balance sheet and the tie;
driving the model; the eight levers; sizing a funding requirement; a finding that changed when the
horizon changed; and a capstone bench.

## The model is real

`assets/fin-live.js` is a working three-statement model. Every figure on every page is computed
from it, and the capstone runs it live in the browser.

- **The balance sheet ties.** Across the 50 run canon set the worst assets-minus-claims error is
  **2.24e-8**, which is floating point noise. A model that does not tie is reported as broken
  rather than plotted, and the bench has a button that breaks it on purpose so you can watch the
  check catch it.
- **Profit and cash diverge, hard.** Over twelve months Marchmont earns **£445,631** of net income
  and **minus £297,261** of free cash flow. £664,607 of the gap is money sitting in unpaid
  invoices and unsold stock.
- **Growth is what creates the gap.** At 0% monthly growth the company never dips. At 8% it earns
  nearly five times the profit and is almost eight million pounds in the hole.
- **Four of the eight rescue levers change profit by exactly nothing.** Collecting faster, paying
  slower and holding less stock move cash without touching the income statement by a penny.

## A finding that changed

Run to 24 months, the model says a profitable company runs out of cash in month 10 and the obvious
headline is that it dies. Run to 48 months, the same model unchanged recovers on its own in month
28 after 18 months underwater, troughing at minus £115,501. It is a financing gap, not a failure,
and borrowing is a legitimate answer rather than a deferral. The horizon was the assumption nobody
had written down. Practitioner session 9 keeps the record.

## Running it

No build step. Any static server:

```
python3 -m http.server 8683
```

Then open http://localhost:8683/

## Scope

This course covers corporate statements and cash. Valuation and what a business is worth belong to
a different subject. **Nothing here is investment advice.**

## Credits

by Phoebe Fu. Part of [Learn with Phoebe](https://phoebefu6.github.io/learn-with-phoebe/).

AI applied to finance work, month-end close and forecasting lives in
[learn AI finance](https://phoebefu6.github.io/learn-ai-finance-with-phoebe/), and unit economics
in [learn strategic thinking](https://phoebefu6.github.io/learn-strategic-thinking-with-phoebe/).
