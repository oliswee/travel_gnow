// ─── Core Domain Types ───

export interface POI {
  id: string
  name: string
  city: string
  category: string
  subCategory?: string
  rating: number
  lat: number
  lng: number
  address: string
  openHours?: string
  price?: number
  visitDuration: number // minutes
  indoor: boolean
  timeWindow?: TimeWindow
  ugcStats?: UGCStats
  antiHypeScore?: number
}

export interface TimeWindow {
  mu: string // HH:mm
  sigma: number
  weight: number
  sampleCount: number
}

export interface UGCStats {
  totalReviews: number
  positiveRatio: number
  queuePenalty: QueuePenalty[]
  tags: string[]
}

export interface QueuePenalty {
  dayType: 'weekday' | 'weekend'
  hour: number
  avgMinutes: number
}

// ─── Trip & Plan Types ───

export interface TripIntent {
  query: string
  city: string
  days: number
  people: number
  preferences: string[]
  constraints?: {
    maxBudget?: number
    pace?: 'relaxed' | 'normal' | 'intensive'
  }
}

export interface CompleteRouteContract {
  days: DayBlock[]
  totals: RouteTotals
  validation: RouteValidation
}

export type DayBlock = {
  date: string
  blocks: Block[]
}

export type Block =
  | { type: 'poi'; poiId: string; poiName: string; arrive: string; leave: string; reason: string }
  | { type: 'meal'; poiId?: string; arrive: string; leave: string; budget: number; label: string }
  | { type: 'transit'; from: string; to: string; mode: TransitMode; durationMin: number }
  | { type: 'rest'; arrive: string; leave: string; reason: string }
  | { type: 'hotel'; checkIn?: string; checkOut?: string; name: string }

export type TransitMode = 'walk' | 'bike' | 'bus' | 'metro' | 'taxi' | 'drive' | 'highspeed' | 'flight' | 'ferry'

export interface RouteTotals {
  durationMin: number
  budget: number
  steps: number
  transitMin: number
  preferenceMatch: number
  hardConstraintPass: boolean
}

export interface RouteValidation {
  openHoursPass: boolean
  reachablePass: boolean
  noOverlapPass: boolean
  mealCoveragePass: boolean
  pacePass: boolean
}

// ─── Plan A/B/C ───

export interface PlanSet {
  A: Plan
  B: Plan
  C: Plan
}

export interface Plan {
  id: string
  label: string
  description: string
  route: CompleteRouteContract
  preferenceMatch: number
  diversityScore: number
  uniquePois: string[]
}

// ─── User Types ───

export type MockUserId = 'foodie' | 'museum' | 'family'

export interface UserProfile {
  id: MockUserId
  name: string
  city: string
  tripCount: number
  rating: number
  longTermVector: number[]
  topCategories: CategoryWeight[]
  historyTrips: HistoryTrip[]
}

export interface CategoryWeight {
  name: string
  weight: 1 | 2 | 3 | 4 | 5
}

export interface HistoryTrip {
  id: string
  city: string
  rating: number
  date: string
  summary: string
}

export interface SessionAction {
  type: 'view' | 'favorite' | 'reject' | 'pref_adjust'
  target: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface UserSettings {
  backgroundPrompt: string
  memoryEnabled: {
    searchHistory: boolean
    tripHistory: boolean
    favorites: boolean
  }
  preferenceWeights: Record<string, number>
  privacyMode: boolean
}

// ─── API Response Types ───

export interface TripGenerateResponse {
  tripId: string
  intent: TripIntent
  plans: PlanSet
  activePlan: 'A' | 'B' | 'C'
}

export interface ReplanResponse {
  tripId: string
  diff: {
    replaced: string[]
    kept: number
    reason: string
  }
  route: CompleteRouteContract
}

export interface DriftPlanResponse {
  plans: PlanSet
  userProfile: UserProfile
  comparison: PlanComparisonMatrix
}

export interface PlanComparisonMatrix {
  dimensions: Array<{
    name: string
    values: [number, number, number]
    best: 0 | 1 | 2
  }>
}

export interface DebugTrace {
  tripId: string
  agentCalls: AgentStep[]
  solverLog: SolverLog
  ugcSources: UGCSource[]
}

export interface AgentStep {
  agent: string
  durationMs: number
  status: 'success' | 'fail'
}

export interface SolverLog {
  iterations: number
  objectiveValue: number
  hardConstraintSatisfied: boolean
  softWindowReward: number
  diversityScore: number
}

export interface UGCSource {
  poiId: string
  totalTriples: number
  filteredByAntiHype: number
  finalCount: number
}
