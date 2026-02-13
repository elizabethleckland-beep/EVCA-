
export const STAGE_HINTS: Record<number, { function: string; hints: string }> = {
  0: { function: 'Inbound Strategy & Concept', hints: 'Market positioning, brand architecture, concept development, and demand forecasting.' },
  1: { function: 'Product / Service Design', hints: 'Merchandising, feature set, assortment planning, service tiers, and R&D specs.' },
  2: { function: 'Supply & Sourcing', hints: 'Vendor management, production, supplier selection, resource allocation, and raw material intake.' },
  3: { function: 'Operations & Logistics', hints: 'Distribution, infrastructure, inventory flow, backend processing, and warehousing.' },
  4: { function: 'Channel Delivery', hints: 'Store operations, digital platform, service delivery, omni-flows, and physical/digital distribution.' },
  5: { function: 'Sales & Client Acquisition', hints: 'Relationship selling, outreach, conversion flows, data capture, and lead nurturing.' },
  6: { function: 'Post-Sale & Experience', hints: 'Customer success, returns, churn management, CSAT/NPS, and support services.' },
  7: { function: 'Secondary Value / Growth', hints: 'Resale, upsell, retention loops, sustainability, circularity, and expansion revenue.' },
  8: { function: 'Feedback & Innovation', hints: 'Market R&D, continuous improvement, future roadmap, and voice-of-the-customer synthesis.' }
};

export const INDUSTRY_TEMPLATES: Record<string, string[]> = {
  'Retail/Manufacturing': [
    'Brand & Concept',
    'Merchandising',
    'Sourcing & Production',
    'Logistics & DC',
    'Store/Digital Ops',
    'Sales & Clienteling',
    'Returns & Loyalty',
    'Resale & Circularity',
    'R&D Innovation'
  ],
  'Luxury / Heritage': [
    'Artistic Direction',
    'Collection Design',
    'Artisanal Sourcing',
    'White-Glove Logistics',
    'Flagship Experiences',
    'Exclusive Clienteling',
    'Care & Repair',
    'Vintage Authentication',
    'Maison Archives'
  ],
  'SaaS / Digital': [
    'Market Research',
    'Product Management',
    'Infrastructure/Dev',
    'User Acquisition',
    'Platform Interface',
    'Onboarding/Sales',
    'Customer Success',
    'Expansion Revenue',
    'Product Feedback Loop'
  ],
  'Professional Services': [
    'Market Positioning',
    'Service Design',
    'Talent Acquisition',
    'Project Planning',
    'Engagement Delivery',
    'Client Reporting',
    'Account Management',
    'Referral Network',
    'Knowledge Management'
  ],
  'Healthcare / Bio': [
    'Clinical Strategy',
    'Therapeutic Design',
    'Supplier Compliance',
    'Cold Chain Logistics',
    'Patient Delivery',
    'Provider Relations',
    'Care Management',
    'Outcome Monitoring',
    'Medical Innovation'
  ],
  'FinTech / Banking': [
    'Regulatory Strategy',
    'Financial Product Design',
    'Capital Sourcing',
    'Core Ledger Ops',
    'Banking Interface',
    'Advisory/Sales',
    'Support & Security',
    'Cross-Sell Loops',
    'Compliance Feedback'
  ]
};
