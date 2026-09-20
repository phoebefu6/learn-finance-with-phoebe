/* fin-live.js - a real three-statement model for Marchmont Instruments.
   Nothing here is a stored result: every figure on every page is produced by
   running this model. The balance sheet is checked to tie every month, and a
   model that does not tie is reported as broken rather than quietly plotted.

   Marchmont makes laboratory instruments and sells B2B on credit terms. It is
   profitable in every month of the base case and still runs out of cash.
*/
(function (root) {
  "use strict";

  var BASE = {
    startRevenue: 400000,   // month 1 revenue, in pounds
    growth: 0.04,           // month on month revenue growth
    grossMargin: 0.42,      // gross profit / revenue
    opexFixed: 95000,       // salaries, rent, the things that do not flex
    opexVariable: 0.11,     // as a share of revenue
    dso: 75,                // days sales outstanding: customers pay in 75 days
    dio: 60,                // days inventory on hand
    dpo: 30,                // days payable: Marchmont pays suppliers in 30
    taxRate: 0.25,
    interestRate: 0.09,     // annual, on drawn debt
    openingCash: 250000,
    openingDebt: 300000,
    capexRate: 0.03,        // capex as a share of revenue
    depreciationLife: 60,   // months
    openingNetFixed: 480000,
    openingEquity: 0        // solved at t0 so the sheet ties
  };

  function assumptions(over) {
    var a = {}, k;
    for (k in BASE) if (BASE.hasOwnProperty(k)) a[k] = BASE[k];
    for (k in (over || {})) if (over.hasOwnProperty(k)) a[k] = over[k];
    return a;
  }

  /* One pass of the model. Returns a month by month array plus the opening
     balance sheet it was solved from. */
  function run(over, months) {
    var a = assumptions(over);
    months = months || 24;

    // Opening working capital, consistent with month 1 activity.
    var rev0 = a.startRevenue;
    var cogs0 = rev0 * (1 - a.grossMargin);
    var ar = rev0 * a.dso / 30;
    var inv = cogs0 * a.dio / 30;
    var ap = cogs0 * a.dpo / 30;
    var cash = a.openingCash;
    var debt = a.openingDebt;
    var netFixed = a.openingNetFixed;

    // Equity is whatever makes the opening sheet tie. This is not a fudge: it
    // is the accumulated history of a company that existed before month 1.
    var equity = (cash + ar + inv + netFixed) - (ap + debt);

    var rows = [];
    var revenue = rev0;

    for (var m = 1; m <= months; m++) {
      if (m > 1) revenue = revenue * (1 + a.growth);
      var cogs = revenue * (1 - a.grossMargin);
      var grossProfit = revenue - cogs;
      var opex = a.opexFixed + a.opexVariable * revenue;
      var ebitda = grossProfit - opex;

      var depreciation = netFixed / a.depreciationLife;
      var ebit = ebitda - depreciation;
      var interest = debt * a.interestRate / 12;
      var pretax = ebit - interest;
      var tax = pretax > 0 ? pretax * a.taxRate : 0;
      var netIncome = pretax - tax;

      // Working capital at the end of this month, driven by this month's activity.
      var arNew = revenue * a.dso / 30;
      var invNew = cogs * a.dio / 30;
      var apNew = cogs * a.dpo / 30;
      var dWC = (arNew - ar) + (invNew - inv) - (apNew - ap);

      var capex = revenue * a.capexRate;
      var operatingCF = netIncome + depreciation - dWC;
      var freeCF = operatingCF - capex;

      var cashNew = cash + freeCF;
      var netFixedNew = netFixed + capex - depreciation;
      var equityNew = equity + netIncome;

      ar = arNew; inv = invNew; ap = apNew;
      netFixed = netFixedNew; equity = equityNew; cash = cashNew;

      var assets = cash + ar + inv + netFixed;
      var liabsEquity = ap + debt + equity;

      rows.push({
        month: m,
        revenue: revenue,
        cogs: cogs,
        grossProfit: grossProfit,
        opex: opex,
        ebitda: ebitda,
        depreciation: depreciation,
        ebit: ebit,
        interest: interest,
        tax: tax,
        netIncome: netIncome,
        ar: ar, inventory: inv, ap: ap,
        workingCapital: ar + inv - ap,
        deltaWC: dWC,
        capex: capex,
        operatingCF: operatingCF,
        freeCF: freeCF,
        cash: cash,
        netFixed: netFixed,
        equity: equity,
        assets: assets,
        liabsEquity: liabsEquity,
        tieError: assets - liabsEquity
      });
    }
    return { rows: rows, assumptions: a };
  }

  /* The integrity check. A three-statement model whose balance sheet does not
     tie is not a model, and this reports that rather than hiding it. */
  function ties(result, tolerance) {
    tolerance = tolerance == null ? 0.01 : tolerance;
    var worst = 0;
    for (var i = 0; i < result.rows.length; i++) {
      var e = Math.abs(result.rows[i].tieError);
      if (e > worst) worst = e;
    }
    return { ok: worst <= tolerance, worst: worst };
  }

  /* First month where cash goes below zero, or 0 if it never does. */
  function cashOutMonth(result) {
    for (var i = 0; i < result.rows.length; i++) {
      if (result.rows[i].cash < 0) return result.rows[i].month;
    }
    return 0;
  }

  /* Was the company profitable in every month up to and including m? */
  function profitableThrough(result, m) {
    for (var i = 0; i < result.rows.length && result.rows[i].month <= m; i++) {
      if (result.rows[i].netIncome <= 0) return false;
    }
    return true;
  }

  function cumulative(result, field, upto) {
    var s = 0;
    for (var i = 0; i < result.rows.length; i++) {
      if (upto && result.rows[i].month > upto) break;
      s += result.rows[i][field];
    }
    return s;
  }

  root.MARCHMONT = {
    BASE: BASE,
    run: run,
    ties: ties,
    cashOutMonth: cashOutMonth,
    profitableThrough: profitableThrough,
    cumulative: cumulative
  };
})(typeof window !== "undefined" ? window : globalThis);

if (typeof module !== "undefined" && module.exports) {
  module.exports = (typeof window !== "undefined" ? window : globalThis).MARCHMONT;
}

/* ---------------------------------------------------------------------------
   The model bench. Renders into [data-model-bench] and runs MARCHMONT live.
   Every figure it shows is computed when you press the button.
--------------------------------------------------------------------------- */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  var host = document.querySelector("[data-model-bench]");
  if (!host || !window.MARCHMONT) return;
  var M = window.MARCHMONT;

  function gbp(n) {
    var s = Math.abs(Math.round(n)).toLocaleString("en-GB");
    return (n < 0 ? "-£" : "£") + s;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function sel(label, opts, value) {
    var w = el("div", "mb-ctl");
    w.appendChild(el("label", null, label));
    var s = el("select", "mb-sel");
    opts.forEach(function (o) {
      var op = document.createElement("option");
      op.value = String(o[0]); op.textContent = o[1];
      if (String(o[0]) === String(value)) op.selected = true;
      s.appendChild(op);
    });
    w.appendChild(s);
    return { wrap: w, input: s };
  }

  host.innerHTML = "";
  var box = el("div", "mb");

  var head = el("div", "mb-head");
  var h = el("h4", null, "MARCHMONT INSTRUMENTS - THE MODEL");
  var hp = el("p", null, "Three statements, linked by two wires, run month by month when you press the button. "
    + "The balance sheet is checked every month and a model that does not tie is reported as broken rather than plotted.");
  head.appendChild(h); head.appendChild(hp);
  box.appendChild(head);

  var ctl = el("div", "mb-controls");
  var cGrowth = sel("Monthly growth", [[0, "0%"], [0.02, "2%"], [0.04, "4%"], [0.06, "6%"], [0.08, "8%"]], 0.04);
  var cDso = sel("Customers pay in", [[30, "30 days"], [45, "45 days"], [60, "60 days"], [75, "75 days"], [90, "90 days"]], 75);
  var cDpo = sel("You pay in", [[30, "30 days"], [45, "45 days"], [60, "60 days"]], 30);
  var cHorizon = sel("Horizon", [[12, "12 months"], [24, "24 months"], [48, "48 months"]], 24);
  [cGrowth, cDso, cDpo, cHorizon].forEach(function (c) { ctl.appendChild(c.wrap); });
  var runBtn = el("button", "mb-run", "Run the model");
  runBtn.type = "button";
  var breakBtn = el("button", "mb-break", "Break the tie");
  breakBtn.type = "button";
  ctl.appendChild(runBtn); ctl.appendChild(breakBtn);
  box.appendChild(ctl);

  var body = el("div", "mb-body");
  var kpis = el("div", "mb-kpis");
  var tie = el("div", "mb-tie ok");
  var note = el("p", "mb-note");
  var scroll = el("div", "mb-scroll");
  var tbl = el("table", "mb-tbl");
  scroll.appendChild(tbl);
  body.appendChild(kpis); body.appendChild(tie); body.appendChild(note); body.appendChild(scroll);
  box.appendChild(body);
  host.appendChild(box);

  function kpi(value, label, neg) {
    var k = el("div", "mb-kpi");
    var b = el("b", neg ? "neg" : null, value);
    k.appendChild(b); k.appendChild(el("span", null, label));
    return k;
  }

  function render(broken) {
    var over = {
      growth: parseFloat(cGrowth.input.value),
      dso: parseFloat(cDso.input.value),
      dpo: parseFloat(cDpo.input.value)
    };
    var months = parseInt(cHorizon.input.value, 10);
    var res = M.run(over, months);

    // "Break the tie" drops one side of a single transaction, the way a real
    // modelling error does, so the check has something genuine to catch.
    if (broken) {
      var i = Math.min(6, res.rows.length - 1);
      for (var j = i; j < res.rows.length; j++) {
        res.rows[j].equity -= res.rows[i].netIncome;
        res.rows[j].liabsEquity -= res.rows[i].netIncome;
        res.rows[j].tieError = res.rows[j].assets - res.rows[j].liabsEquity;
      }
    }

    var t = M.ties(res);
    var outM = M.cashOutMonth(res);
    var trough = res.rows.reduce(function (a, x) { return x.cash < a.cash ? x : a; });
    var recover = outM ? (res.rows.filter(function (x) { return x.month > outM && x.cash >= 0; })[0] || null) : null;
    var ni = M.cumulative(res, "netIncome", 12);
    var fcf = M.cumulative(res, "freeCF", 12);

    kpis.innerHTML = "";
    kpis.appendChild(kpi(outM ? "month " + outM : "never", "cash first goes negative", !!outM));
    kpis.appendChild(kpi(gbp(trough.cash), "deepest point, month " + trough.month, trough.cash < 0));
    kpis.appendChild(kpi(recover ? "month " + recover.month : (outM ? "not within " + months : "-"), "back above zero", !recover && !!outM));
    kpis.appendChild(kpi(gbp(ni), "net income, 12 months", ni < 0));
    kpis.appendChild(kpi(gbp(fcf), "free cash flow, 12 months", fcf < 0));

    tie.className = "mb-tie " + (t.ok ? "ok" : "bad");
    tie.textContent = t.ok
      ? "Balance sheet ties in every month. Worst error " + t.worst.toExponential(2) + ", against a tolerance of 0.01, which is floating point noise."
      : "BROKEN: the balance sheet does not tie. Worst error " + gbp(t.worst) + ". One side of a transaction has been recorded and the other has not, so nothing below this line can be trusted.";

    if (!t.ok) {
      note.textContent = "That is what a modelling error looks like from the outside: every other number still renders, still looks plausible, and is wrong. The check is the only thing that told you.";
    } else if (!outM) {
      note.textContent = "On these assumptions the company funds its own growth and never needs the bank. Raise the growth rate or lengthen the time customers take to pay and watch that stop being true.";
    } else {
      note.textContent = "Profitable in every month up to the crunch: " + (M.profitableThrough(res, outM) ? "yes" : "no")
        + ". The first negative month is month " + outM + ", but the number worth financing is the deepest point, "
        + gbp(trough.cash) + " in month " + trough.month + ". Funding the first figure covers that month and nothing after it.";
    }

    var head2 = "<thead><tr><th>Month</th><th>Revenue</th><th>Net income</th><th>Change in working capital</th><th>Free cash flow</th><th>Cash</th></tr></thead>";
    var rows = res.rows.map(function (x) {
      return "<tr" + (x.cash < 0 ? ' class="out"' : "") + "><td>" + x.month + "</td>"
        + "<td>" + gbp(x.revenue) + "</td>"
        + "<td>" + gbp(x.netIncome) + "</td>"
        + "<td>" + gbp(-x.deltaWC) + "</td>"
        + "<td" + (x.freeCF < 0 ? ' class="neg"' : "") + ">" + gbp(x.freeCF) + "</td>"
        + "<td" + (x.cash < 0 ? ' class="neg"' : "") + ">" + gbp(x.cash) + "</td></tr>";
    }).join("");
    tbl.innerHTML = head2 + "<tbody>" + rows + "</tbody>";
  }

  runBtn.addEventListener("click", function () { render(false); });
  breakBtn.addEventListener("click", function () { render(true); });
  render(false);
})();
