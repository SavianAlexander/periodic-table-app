# Workspace Customization Rules

## 1. Z-Index Layer Stacking Pattern
*   **Overlay Masks**: `z-index: 900`
*   **Page Controls & Headers**: `z-index: 950` (Higher than overlay so they remain clickable, lower than details panels so they do not bleed through).
*   **Floating Visualizers / Canvas / Media Players**: `z-index: 1000`
*   **Primary Details Panels**: `z-index: 1000`
*   *Rationale*: Prevents controls from overlapping panels, maintains page buttons clickable under modal overlays, and keeps floating elements fully interactable.

## 2. Desktop Fixed vs. Scroll Click Blockage
*   *Warning*: Avoid placing large fixed-position containers (like centering frames) over the main viewport with a higher z-index than page buttons. Because Playwright centers targets vertically before clicking, a fixed-position centered container will intercept the click coordinates.

## 3. Small-Screen Column Grid Overflow Guardrails
*   *18-Column Grids*: On viewports below `640px` (or `320px` mobile screens), 18-column grid columns must shrink below 17.7px.
*   *Action*: Downscale card symbols to `7px`, and remove padding, borders, and gaps from card grids to prevent horizontal viewport overflow.

## 4. E2E Cross-Origin Iframe Mocking
*   *Rule*: Never load real YouTube/cross-origin embeds inside E2E tests, which causes WebKit/Firefox to hang or timeout. Detect testing environments (`window.__speechSynthesisCalls` or testing parameters) and render `about:blank?hl=...` with the required parameters to accelerate test speeds.

## 5. Mandatory Feature Showcase and Screenshot Updates
*   *Rule*: Whenever a new application feature, sub-panel, or visual tab is implemented or modified:
  1. Immediately capture high-definition screenshots representing the new feature states.
  2. Append or update the screenshots and their corresponding visual descriptions in the `README.md` file under the feature showcase sections.
  3. Ensure the visual files are added to git version tracking (`git add docs/ux_journey/`) and committed alongside the feature code.

