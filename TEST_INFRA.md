# E2E Test Infra: periodic-table-app

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Standard IUPAC Layout (118 elements) | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 2 | Difficulty Mode Toggle | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 3 | Card Content updates via Difficulty | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 4 | Detailed View Modal (open/close) | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 5 | Modal Content updates via Difficulty | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |

## Test Architecture
- Test runner: Playwright (`npx playwright test`)
- Test case format: Playwright TS test files
- Directory layout: `tests/e2e/`
  - `tests/e2e/tier1.spec.ts`
  - `tests/e2e/tier2.spec.ts`
  - `tests/e2e/tier3.spec.ts`
  - `tests/e2e/tier4.spec.ts`

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | A beginner exploring basic elements and their uses | F1, F2, F3, F4, F5 | Medium |
| 2 | An advanced user studying electron configurations and spectra | F1, F2, F3, F4, F5 | High |
| 3 | A user rapidly switching modes while exploring different element groups | F2, F3, F4, F5 | High |
| 4 | A user opening modals and closing them across random elements | F1, F4 | Medium |
| 5 | A complete walkthrough from beginner to advanced on a single element | F2, F3, F4, F5 | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature
- Tier 2: ≥5 per feature (where boundaries exist)
- Tier 3: pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios
