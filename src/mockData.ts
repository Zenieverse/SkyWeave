/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  MeshNode, 
  Drone, 
  MarketSeed, 
  Course, 
  InventoryProduct, 
  LedgerEntry, 
  MicroLoanProposal, 
  CommunityProposal 
} from './types';

export const INITIAL_NODES: MeshNode[] = [
  {
    id: 'node-1',
    name: 'Valley Center Uplink',
    status: 'online',
    type: 'satellite_uplink',
    battery: 98,
    signal: 95,
    activeUsers: 42,
    bandwidth: 120,
    locX: 50,
    locY: 30,
    lastSync: 'Now'
  },
  {
    id: 'node-2',
    name: 'North Ridge Solar Relay',
    status: 'online',
    type: 'solar',
    battery: 100,
    signal: 82,
    activeUsers: 19,
    bandwidth: 45,
    locX: 30,
    locY: 15,
    lastSync: '2 mins ago'
  },
  {
    id: 'node-3',
    name: 'East River Agro-Coop Server',
    status: 'online',
    type: 'community_server',
    battery: 88,
    signal: 78,
    activeUsers: 34,
    bandwidth: 30,
    locX: 75,
    locY: 45,
    lastSync: '10 mins ago'
  },
  {
    id: 'node-4',
    name: 'Dusk Valley Repeater',
    status: 'warning',
    type: 'solar',
    battery: 14,
    signal: 54,
    activeUsers: 8,
    bandwidth: 12,
    locX: 20,
    locY: 65,
    lastSync: '15 mins ago'
  },
  {
    id: 'node-5',
    name: 'Highlands Drone Relay Node',
    status: 'offline',
    type: 'drone_repeater',
    battery: 0,
    signal: 0,
    activeUsers: 0,
    bandwidth: 0,
    locX: 85,
    locY: 10,
    lastSync: '3 hours ago'
  },
  {
    id: 'node-6',
    name: 'South Forest clinic relay',
    status: 'online',
    type: 'solar',
    battery: 76,
    signal: 70,
    activeUsers: 15,
    bandwidth: 25,
    locX: 45,
    locY: 80,
    lastSync: '5 mins ago'
  }
];

export const INITIAL_DRONES: Drone[] = [
  {
    id: 'drone-alpha',
    name: 'Albatross Sync-Zero',
    battery: 85,
    status: 'idle',
    route: ['Valley Center Uplink', 'Dusk Valley Repeater'],
    progress: 0,
    dataPayloadSize: '4.8 GB',
    task: 'Offline Content Delivery'
  },
  {
    id: 'drone-beta',
    name: 'Nimbus Sync-Plus',
    battery: 42,
    status: 'flying',
    route: ['Valley Center Uplink', 'Highlands Drone Relay Node', 'East River Agro-Coop Server'],
    targetNodeId: 'node-5',
    progress: 62,
    dataPayloadSize: '12.4 GB',
    task: 'Health & Commerce Syncing'
  }
];

export const MARKET_SEEDS: MarketSeed[] = [
  {
    id: 'seed-edu-1',
    title: 'Adult Literacy & Basic Calculations Pack',
    category: 'education',
    size: '14.2 MB',
    downloads: 1240,
    isDownloaded: true,
    rating: 4.8,
    description: 'Bilingual offline interactive course introducing fundamental sentence creation and agricultural financial math templates.',
    contents: [
      'Interactive flashcards with speech synthesis logic',
      'Daily record-keeping templates for rural merchants',
      'Simple arithmetic tests with instant gamified tokens'
    ]
  },
  {
    id: 'seed-crop-ai',
    title: 'Weaver Agro-Expert AI Core Seed',
    category: 'ai',
    size: '80.5 MB',
    downloads: 2450,
    isDownloaded: false,
    rating: 4.9,
    description: 'Local language neural models containing detailed diagnosis protocols for 45 sub-Saharan crops, pests, and rainfall trackers.',
    contents: [
      'Offline diagnostic questionnaires for pest mitigation',
      'Crop pricing forecasts calibrated to community boards',
      'Dynamic voice-guided advice and local dialect translation packs'
    ]
  },
  {
    id: 'seed-hel-1',
    title: 'Maternal Healthcare & Telehealth Manual',
    category: 'healthcare',
    size: '22.1 MB',
    downloads: 830,
    isDownloaded: true,
    rating: 4.7,
    description: 'Fully searchable clinical companion with offline prenatal milestones, nutrition tutorials, and vaccination timelines.',
    contents: [
      'Visual timeline checklist for rural health nurses',
      'Audio-first warning-signs list for remote villages',
      'Offline form cache with automated routing upon drone synchronization'
    ]
  },
  {
    id: 'seed-gov-id',
    title: 'Digital Public Infrastructure Self-Sovereign Identity',
    category: 'government',
    size: '8.4 MB',
    downloads: 940,
    isDownloaded: false,
    rating: 4.6,
    description: 'Decentralized cryptographic credential key generator designed following UNICEF and W3C digital signature frameworks.',
    contents: [
      'Bluetooth peer-to-peer verification interfaces',
      'Biometric cryptographic key storage guidelines',
      'Offline school enrollment and food subsidy distribution registries'
    ]
  },
  {
    id: 'seed-trade-1',
    title: 'Pan-Cooperative Commercial Catalog',
    category: 'commerce',
    size: '15.9 MB',
    downloads: 1100,
    isDownloaded: false,
    rating: 4.5,
    description: 'Decentralized ledger indexing active inventory, pricing directories, and transport availability calendars for 12 local villages.',
    contents: [
      'Live local price comparator tools',
      'Submitting orders offline using Bluetooth vouchers',
      'Automated dispatch alerts for community runner networks'
    ]
  }
];

export const COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Offline Entrepreneurship: Local Craft Accounting',
    category: 'Business & Finance',
    description: 'A 4-part handbook on micro-capital management, building local client circles, and pricing crops for optimum cooperative returns.',
    rewardCredits: 15,
    lessons: [
      'Direct vs. Indirect Costs explained in local terms',
      'Setting up your ledger using community currency blocks',
      'Risk shielding and communal emergency lending circles'
    ],
    quizzes: [
      {
        question: 'If you produce 10 honey jars for 2 credits each and spend 5 credits on custom glass containers, what is your net yield return?',
        options: [
          '20 credits total, 15 credits net yield',
          '35 credits total, 25 credits net yield',
          '15 credits total, 10 credits net yield'
        ],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Solar Mesh Maintenance & Node Engineering',
    category: 'Technology & Infrastructures',
    description: 'Develop technical expertise to install and fine-tune solar relays, battery monitors, and range-extending directional antennas.',
    rewardCredits: 30,
    lessons: [
      'Battery depth of discharge (DoD) optimization tips',
      'Designing robust DIY weather containment for nodes',
      'P2P path inspection to clear signals from thick foliage'
    ],
    quizzes: [
      {
        question: 'Which of the following describes the safest depth of discharge target for lead-crystal or lithium batteries for maximum lifecycle?',
        options: [
          'Discharge completely to 0% as often as possible',
          'Maintain charging cycles while restricting discharge to 20-50%',
          'Leave disconnected entirely during high-sun peaks'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'course-3',
    title: 'First-Responder Health Screenings & Sanitation',
    category: 'Community Healthcare',
    description: 'Practical training for village assistants to execute maternal risk diagnostics and implement sanitizing techniques.',
    rewardCredits: 20,
    lessons: [
      'Deploying clinical maternal screening checklists',
      'Executing emergency water purification recipes',
      'Connecting remote logs using bluetooth sync routines'
    ],
    quizzes: [
      {
        question: 'When telemetry/cellular access is down, what protocol best ensures a high-risk patient log successfully alerts medical teams?',
        options: [
          'Wait indefinitely without record preparation',
          'Export and sign cryptographically, syncing instantly when peer drones traverse the workspace mesh',
          'Request patient travel instantly across long distances'
        ],
        correctAnswer: 1
      }
    ]
  }
];

export const MARKET_PRODUCTS: InventoryProduct[] = [
  {
    id: 'prod-teff',
    name: 'High-Yield Teff Grain (50kg Bag)',
    category: 'Agricultural Crops',
    price: 32,
    unit: 'bag',
    stock: 24,
    description: 'Premium organic teff, high nutrition profile, cultivated locally by East River Agro-Coop using offline tech manuals.',
    vendor: 'East River Agro-Coop',
    demandForecast: 'High. Next month rain forecasts predict limited market harvest; warehouse reserves should be maximized.'
  },
  {
    id: 'prod-honey',
    name: 'Wild Highlands Honey Pot',
    category: 'Natural Produce',
    price: 8,
    unit: 'pot',
    stock: 60,
    description: 'Raw, pesticide-free highlands honey with natural antibacterial qualities. Cultured in solar-monitored apiaries.',
    vendor: 'South Ridge Apiaries',
    demandForecast: 'Moderate. Steady healthcare interest for medicinal supplements keeps demand reliable.'
  },
  {
    id: 'prod-solar',
    name: 'Compact 20W Solar Node Battery Mod',
    category: 'Infrastructure Accessories',
    price: 65,
    unit: 'unit',
    stock: 4,
    description: 'Pre-soldered weatherized lithium power buffer. Extends community relays for up to 48 hours of continuous night operation.',
    vendor: 'SkyWeave Technical Commons',
    demandForecast: 'Critical. Rapid onset of winter weather demands immediate energy safety upgrades in high-elevation nodes.'
  }
];

export const LEDGER_HISTORY: LedgerEntry[] = [
  {
    id: 'tx-1',
    timestamp: '2026-06-01 10:15',
    type: 'reward',
    amount: 15,
    description: 'Credits earned: Finished Entrepreneurship Handbook Course',
    isOffline: false
  },
  {
    id: 'tx-2',
    timestamp: '2026-06-01 08:30',
    type: 'earn',
    amount: 24,
    description: 'Host reward: Network uptime bonus for Node-2 (North Ridge)',
    isOffline: false
  },
  {
    id: 'tx-3',
    timestamp: '2026-05-31 16:45',
    type: 'spend',
    amount: 8,
    description: 'Purchased: Wild Highlands Honey Pot',
    isOffline: true
  },
  {
    id: 'tx-4',
    timestamp: '2026-05-31 11:20',
    type: 'transfer',
    amount: -5,
    description: 'P2P Bluetooth transfer to borrower Amina K.',
    isOffline: true
  }
];

export const MICRO_LOANS: MicroLoanProposal[] = [
  {
    id: 'loan-1',
    borrower: 'Elena Mensah (Weaving Cooperative)',
    purpose: 'Purchasing 4 upgraded foot-looms to increase eco-textile trade outputs.',
    amount: 250,
    funded: 180,
    durationMonths: 6,
    interestRate: 2,
    status: 'funding'
  },
  {
    id: 'loan-2',
    borrower: 'Kojo Boateng (Agro-solar pioneer)',
    purpose: 'Install small pump powered by Solar Mesh relay battery inside crop irrigation area.',
    amount: 400,
    funded: 400,
    durationMonths: 12,
    interestRate: 1.5,
    status: 'active'
  }
];

export const COMMUNITY_PROPOSALS: CommunityProposal[] = [
  {
    id: 'prop-1',
    title: 'Dedicate 120 credits for Dusk Valley Repeater battery upgrade',
    description: 'Allocate collaborative energy funds to supply lithium buffers for node-4, countering current warnings on extreme 14% low voltage.',
    proposer: 'Marcus Finch (Host)',
    category: 'mesh',
    votesYes: 42,
    votesNo: 5,
    status: 'voting',
    deadlineDays: 4
  },
  {
    id: 'prop-2',
    title: 'Establish Offline Clinic Sync-Box in East River Village',
    description: 'Leverage community server storage to index 1,200 local child health profiles, allowing rapid local retrieval even outside satellite coverage intervals.',
    proposer: 'Dr. Sarah Alao (Healthcare)',
    category: 'health',
    votesYes: 112,
    votesNo: 2,
    status: 'passed',
    deadlineDays: 0
  },
  {
    id: 'prop-3',
    title: 'Establish digital learning bounty for adult literacy seed downloads',
    description: 'Create passive community incentives giving 5 mesh credits to any household hosting community classes using the literacy seeds offline.',
    proposer: 'Tutor Kwame (Educator)',
    category: 'education',
    votesYes: 58,
    votesNo: 16,
    status: 'voting',
    deadlineDays: 6
  }
];
