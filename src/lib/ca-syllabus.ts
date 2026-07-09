// CA (Chartered Accountancy - ICAI) syllabus data
// Structured by level -> paper -> chapter

export interface Chapter {
  id: string;
  name: string;
  topics: string[];
}

export interface Paper {
  id: string;
  code: string;
  name: string;
  marks: number;
  icon: string; // lucide icon name
  color: string; // hex tint
  chapters: Chapter[];
}

export interface SyllabusLevel {
  id: string;
  name: string;
  description: string;
  papers: Paper[];
}

export const SYLLABUS: SyllabusLevel[] = [
  {
    id: "foundation",
    name: "Foundation",
    description: "Entry-level · 4 papers · 400 marks",
    papers: [
      {
        id: "f-1",
        code: "F1",
        name: "Accounting",
        marks: 100,
        icon: "BookOpen",
        color: "#FF9F1C",
        chapters: [
          { id: "f1-c1", name: "Theoretical Framework", topics: ["Meaning & Scope", "Accounting Principles", "Accounting Standards"] },
          { id: "f1-c2", name: "Accounting Process", topics: ["Journal & Ledger", "Trial Balance", "Rectification"] },
          { id: "f1-c3", name: "Bank Reconciliation", topics: ["BPS", "Causes of Differences"] },
          { id: "f1-c4", name: "Depreciation & Provisions", topics: ["SLM", "WDV", "Provisions & Reserves"] },
          { id: "f1-c5", name: "Bills of Exchange", topics: ["Promissory Notes", "Discounting"] },
          { id: "f1-c6", name: "Final Accounts", topics: ["Sole Traders", "Partnership", "Non-Profit"] },
        ],
      },
      {
        id: "f-2",
        code: "F2",
        name: "Business Laws",
        marks: 100,
        icon: "Scale",
        color: "#06D6A0",
        chapters: [
          { id: "f2-c1", name: "Indian Regulatory Framework", topics: ["Constitution", "Acts"] },
          { id: "f2-c2", name: "Indian Contract Act, 1872", topics: ["Offer", "Acceptance", "Consideration"] },
          { id: "f2-c3", name: "Sale of Goods Act, 1930", topics: ["Conditions", "Warranties"] },
          { id: "f2-c4", name: "Indian Partnership Act, 1932", topics: ["Rights", "Duties", "Dissolution"] },
          { id: "f2-c5", name: "Limited Liability Partnership", topics: ["LLP Act, 2008"] },
        ],
      },
      {
        id: "f-3",
        code: "F3",
        name: "Mathematics, Stats & LR",
        marks: 100,
        icon: "Calculator",
        color: "#4F8EF7",
        chapters: [
          { id: "f3-c1", name: "Ratio & Proportion", topics: ["Indices", "Logarithms"] },
          { id: "f3-c2", name: "Equations", topics: ["Linear", "Quadratic"] },
          { id: "f3-c3", name: "Time Value of Money", topics: ["Simple Interest", "Compound Interest"] },
          { id: "f3-c4", name: "Logical Reasoning", topics: ["Number Series", "Coding"] },
          { id: "f3-c5", name: "Statistics", topics: ["Measures of CT", "Correlation"] },
          { id: "f3-c6", name: "Probability", topics: ["Theorems", "Distributions"] },
        ],
      },
      {
        id: "f-4",
        code: "F4",
        name: "Business Economics",
        marks: 100,
        icon: "TrendingUp",
        color: "#EF476F",
        chapters: [
          { id: "f4-c1", name: "Nature & Scope of Economics", topics: ["Micro & Macro"] },
          { id: "f4-c2", name: "Demand & Supply", topics: ["Law", "Elasticity"] },
          { id: "f4-c3", name: "Theory of Production", topics: ["Laws of Returns"] },
          { id: "f4-c4", name: "Market Structures", topics: ["Perfect Competition", "Monopoly"] },
          { id: "f4-c5", name: "National Income", topics: ["GDP", "GNP"] },
        ],
      },
    ],
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "Second level · 6 papers · 600 marks",
    papers: [
      {
        id: "i-1",
        code: "I1",
        name: "Advanced Accounting",
        marks: 100,
        icon: "BookOpen",
        color: "#FF9F1C",
        chapters: [
          { id: "i1-c1", name: "Company Accounts", topics: ["Issue of Shares", "Forfeiture"] },
          { id: "i1-c2", name: "Buyback & Bonus", topics: ["Section 68", "Bonus Issue"] },
          { id: "i1-c3", name: "Consolidated FS", topics: ["Holding & Subsidiary"] },
          { id: "i1-c4", name: "Branch Accounts", topics: ["Independent", "Dependent"] },
          { id: "i1-c5", name: "Amalgamation", topics: ["Purchase Consideration"] },
          { id: "i1-c6", name: "Internal Reconstruction", topics: ["Reduction of Capital"] },
          { id: "i1-c7", name: "Liquidation", topics: ["Winding Up"] },
        ],
      },
      {
        id: "i-2",
        code: "I2",
        name: "Corporate & Other Laws",
        marks: 100,
        icon: "Scale",
        color: "#06D6A0",
        chapters: [
          { id: "i2-c1", name: "Companies Act 2013 — I", topics: ["Types of Companies", "MOA"] },
          { id: "i2-c2", name: "Companies Act 2013 — II", topics: ["AOA", "Share Capital"] },
          { id: "i2-c3", name: "Companies Act 2013 — III", topics: ["Directors", "Meetings"] },
          { id: "i2-c4", name: "Indian Partnership Act", topics: ["Relations of Partners"] },
          { id: "i2-c5", name: "Negotiable Instruments Act", topics: ["Promissory Notes"] },
          { id: "i2-c6", name: "Other Laws", topics: ["SARFAESI", "FCRA"] },
        ],
      },
      {
        id: "i-3",
        code: "I3",
        name: "Cost & Management Accounting",
        marks: 100,
        icon: "Calculator",
        color: "#4F8EF7",
        chapters: [
          { id: "i3-c1", name: "Costing Concepts", topics: ["Elements", "Classification"] },
          { id: "i3-c2", name: "Material Costing", topics: ["EOQ", "Stock Levels"] },
          { id: "i3-c3", name: "Employee Cost", topics: ["Labour Turnover", "Incentives"] },
          { id: "i3-c4", name: "Overheads", topics: ["Absorption", "Distribution"] },
          { id: "i3-c5", name: "Standard Costing", topics: ["Variance Analysis"] },
          { id: "i3-c6", name: "Marginal Costing", topics: ["CVP", "BEP"] },
          { id: "i3-c7", name: "Budget & Budgetary Control", topics: ["Types of Budgets"] },
        ],
      },
      {
        id: "i-4",
        code: "I4",
        name: "Taxation",
        marks: 100,
        icon: "ReceiptText",
        color: "#EF476F",
        chapters: [
          { id: "i4-c1", name: "Income Tax Basics", topics: ["Residential Status", "PAN"] },
          { id: "i4-c2", name: "Salary Income", topics: ["Perquisites", "Profits in lieu"] },
          { id: "i4-c3", name: "HP Income", topics: ["Annual Value", "Deductions"] },
          { id: "i4-c4", name: "PGBP", topics: ["Section 30-37", "Deductions"] },
          { id: "i4-c5", name: "Capital Gains", topics: ["STCG", "LTCG", "Indexation"] },
          { id: "i4-c6", name: "Income from Other Sources", topics: ["Dividend", "Interest"] },
          { id: "i4-c7", name: "GST Basics", topics: ["Levy", "Input Tax Credit"] },
        ],
      },
      {
        id: "i-5",
        code: "I5",
        name: "Auditing & Assurance",
        marks: 100,
        icon: "ShieldCheck",
        color: "#9B5DE5",
        chapters: [
          { id: "i5-c1", name: "Auditing Basics", topics: ["Nature", "Objective"] },
          { id: "i5-c2", name: "Engagement Standards", topics: ["SAs", "Engagement"] },
          { id: "i5-c3", name: "Audit Strategy", topics: ["Planning", "Materiality"] },
          { id: "i5-c4", name: "Risk Assessment", topics: ["Inherent", "Control"] },
          { id: "i5-c5", name: "Internal Control", topics: ["COSO", "Walkthrough"] },
          { id: "i5-c6", name: "Audit of Items", topics: ["FS Items"] },
        ],
      },
      {
        id: "i-6",
        code: "I6",
        name: "Financial Management",
        marks: 100,
        icon: "TrendingUp",
        color: "#118AB2",
        chapters: [
          { id: "i6-c1", name: "FM Basics", topics: ["Scope", "Objective"] },
          { id: "i6-c2", name: "Financial Ratio Analysis", topics: ["Liquidity", "Profitability"] },
          { id: "i6-c3", name: "Cost of Capital", topics: ["WACC", "Marginal Cost"] },
          { id: "i6-c4", name: "Financing Decisions", topics: ["Leverage", "Capital Structure"] },
          { id: "i6-c5", name: "Investment Decisions", topics: ["NPV", "IRR"] },
          { id: "i6-c6", name: "Working Capital", topics: ["Management", "Estimation"] },
        ],
      },
    ],
  },
  {
    id: "final",
    name: "Final",
    description: "Final level · 8 papers · 800 marks",
    papers: [
      {
        id: "fin-1",
        code: "FN1",
        name: "Financial Reporting",
        marks: 100,
        icon: "FileText",
        color: "#FF9F1C",
        chapters: [
          { id: "fn1-c1", name: "Ind AS Basics", topics: ["Framework", "Recognition"] },
          { id: "fn1-c2", name: "Ind AS on Assets", topics: ["IAS 16", "IAS 36"] },
          { id: "fn1-c3", name: "Ind AS on Liabilities", topics: ["Leases", "Provisions"] },
          { id: "fn1-c4", name: "Group Accounts", topics: ["Consolidation", "Ind AS 110"] },
          { id: "fn1-c5", name: "Business Combinations", topics: ["IFRS 3"] },
          { id: "fn1-c6", name: "Integrated Reporting", topics: ["Capitals"] },
        ],
      },
      {
        id: "fin-2",
        code: "FN2",
        name: "Strategic Financial Management",
        marks: 100,
        icon: "Target",
        color: "#06D6A0",
        chapters: [
          { id: "fn2-c1", name: "Financial Policy", topics: ["Strategic Decisions"] },
          { id: "fn2-c2", name: "Risk Management", topics: ["Forex", "Interest Rate"] },
          { id: "fn2-c3", name: "Security Valuation", topics: ["Equity", "Bond"] },
          { id: "fn2-c4", name: "Portfolio Management", topics: ["CAPM", "Beta"] },
          { id: "fn2-c5", name: "Mergers & Acquisitions", topics: ["Valuation", "Synergy"] },
          { id: "fn2-c6", name: "Derivatives", topics: ["Options", "Futures"] },
        ],
      },
      {
        id: "fin-3",
        code: "FN3",
        name: "Advanced Auditing",
        marks: 100,
        icon: "ShieldCheck",
        color: "#4F8EF7",
        chapters: [
          { id: "fn3-c1", name: "Standards on Auditing", topics: ["SAs", "SQM"] },
          { id: "fn3-c2", name: "Professional Ethics", topics: ["Code of Ethics"] },
          { id: "fn3-c3", name: "Audit Strategy", topics: ["Risk", "Materiality"] },
          { id: "fn3-c4", name: "Audit of Banks", topics: ["BFSI"] },
          { id: "fn3-c5", name: "Audit Reports", topics: ["Modified", "Unmodified"] },
          { id: "fn3-c6", name: "Audit of Consolidated FS", topics: ["Group Audit"] },
        ],
      },
      {
        id: "fin-4",
        code: "FN4",
        name: "Corporate Laws",
        marks: 100,
        icon: "Scale",
        color: "#EF476F",
        chapters: [
          { id: "fn4-c1", name: "Companies Act", topics: ["Management", "Administration"] },
          { id: "fn4-c2", name: "Securities Laws", topics: ["SCRA", "SEBI"] },
          { id: "fn4-c3", name: "Competition Act", topics: ["Combinations", "Anti-Competitive"] },
          { id: "fn4-c4", name: "Banking Regulation Act", topics: ["RBI", "Banking"] },
          { id: "fn4-c5", name: "Insurance Act", topics: ["IRDAI"] },
        ],
      },
      {
        id: "fin-5",
        code: "FN5",
        name: "Strategic Cost Mgmt",
        marks: 100,
        icon: "Calculator",
        color: "#9B5DE5",
        chapters: [
          { id: "fn5-c1", name: "Strategic Cost Management", topics: ["Value Chain"] },
          { id: "fn5-c2", name: "Decision Making", topics: ["Pricing", "Make/Buy"] },
          { id: "fn5-c3", name: "Performance Measurement", topics: ["Balanced Scorecard"] },
          { id: "fn5-c4", name: "Lean Systems", topics: ["JIT", "Six Sigma"] },
          { id: "fn5-c5", name: "Pricing Decisions", topics: ["Strategies"] },
        ],
      },
      {
        id: "fin-6",
        code: "FN6",
        name: "Risk Management",
        marks: 100,
        icon: "AlertTriangle",
        color: "#118AB2",
        chapters: [
          { id: "fn6-c1", name: "Risk Basics", topics: ["Risk Types"] },
          { id: "fn6-c2", name: "ERM Framework", topics: ["COSO ERM"] },
          { id: "fn6-c3", name: "Financial Risk", topics: ["Credit", "Market"] },
          { id: "fn6-c4", name: "Operational Risk", topics: ["People", "Process"] },
          { id: "fn6-c5", name: "Strategic Risk", topics: ["Reputation"] },
        ],
      },
      {
        id: "fin-7",
        code: "FN7",
        name: "Direct Tax Laws",
        marks: 100,
        icon: "ReceiptText",
        color: "#F72585",
        chapters: [
          { id: "fn7-c1", name: "Income Tax Act", topics: ["Residency", "Income Heads"] },
          { id: "fn7-c2", name: "Assessment", topics: ["Return", "Assessment"] },
          { id: "fn7-c3", name: "International Taxation", topics: ["Transfer Pricing"] },
          { id: "fn7-c4", name: "Tax Planning", topics: ["DTAA"] },
          { id: "fn7-c5", name: "Wealth Tax Basics", topics: ["Deemed Assets"] },
        ],
      },
      {
        id: "fin-8",
        code: "FN8",
        name: "Indirect Tax Laws",
        marks: 100,
        icon: "Landmark",
        color: "#FB5607",
        chapters: [
          { id: "fn8-c1", name: "GST Framework", topics: ["Levy", "Collection"] },
          { id: "fn8-c2", name: "Input Tax Credit", topics: ["Eligibility", "Reversal"] },
          { id: "fn8-c3", name: "Returns & Payment", topics: ["GSTR", "Payment"] },
          { id: "fn8-c4", name: "Customs Act", topics: ["Duty", "Valuation"] },
          { id: "fn8-c5", name: "Customs Tariff", topics: ["Classification"] },
        ],
      },
    ],
  },
];

// Helper functions
export function getAllChapters(): { paper: Paper; chapter: Chapter }[] {
  const out: { paper: Paper; chapter: Chapter }[] = [];
  SYLLABUS.forEach((level) => {
    level.papers.forEach((paper) => {
      paper.chapters.forEach((chapter) => {
        out.push({ paper, chapter });
      });
    });
  });
  return out;
}

export function countTotalChapters(): number {
  return getAllChapters().length;
}

export function countTotalTopics(): number {
  return getAllChapters().reduce((sum, { chapter }) => sum + chapter.topics.length, 0);
}

export function findChapter(chapterId: string): { paper: Paper; chapter: Chapter; level: SyllabusLevel } | null {
  for (const level of SYLLABUS) {
    for (const paper of level.papers) {
      const chapter = paper.chapters.find((c) => c.id === chapterId);
      if (chapter) return { paper, chapter, level };
    }
  }
  return null;
}
