/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserType = 'member' | 'host' | 'educator' | 'healthcare' | 'ngo' | 'gov' | 'telecom';

export type NetworkStatus = 'online' | 'satellite' | 'mesh' | 'offline';

export interface MeshNode {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  type: 'solar' | 'satellite_uplink' | 'drone_repeater' | 'community_server';
  battery: number; // Percentage
  signal: number; // dBm/Percentage
  activeUsers: number;
  bandwidth: number; // Mbps
  locX: number; // Percent width of visualization block
  locY: number; // Percent height of visualization block
  lastSync: string;
}

export interface Drone {
  id: string;
  name: string;
  battery: number;
  status: 'idle' | 'flying' | 'charging';
  route: string[]; // List of village/node names
  targetNodeId?: string;
  progress: number; // 0 - 100
  dataPayloadSize: string; // Dynamic gigabytes carried
  task: string;
}

export interface MarketSeed {
  id: string;
  title: string;
  category: 'education' | 'healthcare' | 'commerce' | 'government' | 'ai';
  size: string;
  downloads: number;
  isDownloaded: boolean;
  rating: number;
  description: string;
  contents: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  rewardCredits: number;
  lessons: string[];
  quizzes: QuizQuestion[];
  completed?: boolean;
}

export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  price: number; // In connection credits
  unit: string;
  stock: number;
  description: string;
  vendor: string;
  demandForecast: string; // Explanation of upcoming demand
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  type: 'earn' | 'spend' | 'transfer' | 'reward';
  amount: number;
  description: string;
  isOffline: boolean;
}

export interface MicroLoanProposal {
  id: string;
  borrower: string;
  purpose: string;
  amount: number;
  funded: number;
  durationMonths: number;
  interestRate: number;
  status: 'funding' | 'active' | 'completed';
}

export interface CommunityProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  category: 'mesh' | 'funding' | 'health' | 'education';
  votesYes: number;
  votesNo: number;
  status: 'voting' | 'passed' | 'completed' | 'failed';
  deadlineDays: number;
}
