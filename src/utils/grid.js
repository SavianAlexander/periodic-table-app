export function getGridPosition(atomicNumber) {
  // Row 1
  if (atomicNumber === 1) return { row: 1, col: 1 };
  if (atomicNumber === 2) return { row: 1, col: 18 };

  // Row 2 & 3
  if (atomicNumber >= 3 && atomicNumber <= 10) {
    return { row: 2, col: atomicNumber <= 4 ? atomicNumber - 2 : atomicNumber + 8 };
  }
  if (atomicNumber >= 11 && atomicNumber <= 18) {
    return { row: 3, col: atomicNumber <= 12 ? atomicNumber - 10 : atomicNumber };
  }

  // Row 4 & 5
  if (atomicNumber >= 19 && atomicNumber <= 36) {
    return { row: 4, col: atomicNumber - 18 };
  }
  if (atomicNumber >= 37 && atomicNumber <= 54) {
    return { row: 5, col: atomicNumber - 36 };
  }

  // Row 6
  if (atomicNumber === 55 || atomicNumber === 56) {
    return { row: 6, col: atomicNumber - 54 };
  }
  if (atomicNumber >= 72 && atomicNumber <= 86) {
    return { row: 6, col: atomicNumber - 68 };
  }

  // Row 7
  if (atomicNumber === 87 || atomicNumber === 88) {
    return { row: 7, col: atomicNumber - 86 };
  }
  if (atomicNumber >= 104 && atomicNumber <= 118) {
    return { row: 7, col: atomicNumber - 100 };
  }

  // f-block
  // Lanthanides (Row 9)
  if (atomicNumber >= 57 && atomicNumber <= 71) {
    return { row: 9, col: atomicNumber - 53 };
  }
  // Actinides (Row 10)
  if (atomicNumber >= 89 && atomicNumber <= 103) {
    return { row: 10, col: atomicNumber - 85 };
  }

  return { row: 1, col: 1 }; // Fallback
}
