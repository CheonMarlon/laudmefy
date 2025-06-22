export const calculateGWA = (data) => {
  const totalUnits = data.reduce((sum, r) => sum + r.units, 0)
  const totalPoints = data.reduce((sum, r) => sum + r.units * r.grade, 0)
  return totalUnits > 0 ? totalPoints / totalUnits : 0
}

export const getHonor = (gwa) => {
  if (gwa >= 3.75) return 'Summa Cum Laude'
  if (gwa >= 3.5) return 'Magna Cum Laude'
  if (gwa >= 3.25) return 'Cum Laude'
  return 'Not qualified yet'
}

export const getNeededUnits = (data, currentGWA) => {
  const thresholds = [
    { target: 'Cum Laude', min: 3.25 },
    { target: 'Magna Cum Laude', min: 3.5 },
    { target: 'Summa Cum Laude', min: 3.75 }
  ]
  const totalUnits = data.reduce((sum, r) => sum + r.units, 0)
  const totalPoints = data.reduce((sum, r) => sum + r.grade * r.units, 0)

  for (let { target, min } of thresholds) {
    if (currentGWA < min) {
      const x = ((min * totalUnits) - totalPoints) / (4.0 - min)
      if (x > 0 && x < 100) {
        return { target, grade: '4.0', units: Math.ceil(x) }
      }
    }
  }

  return null
}

export const getHonorProjection = (data, totalRequired = 145) => {
  const currentUnits = data.reduce((sum, r) => sum + r.units, 0)
  const currentPoints = data.reduce((sum, r) => sum + r.grade * r.units, 0)
  const remainingUnits = totalRequired - currentUnits

  const checkIfPossible = (threshold) => {
    const possibleGWA = (currentPoints + remainingUnits * 4.0) / totalRequired
    return possibleGWA >= threshold
  }

  return {
    entered: currentUnits,
    possible: {
      cum: checkIfPossible(3.25),
      magna: checkIfPossible(3.5),
      summa: checkIfPossible(3.75)
    }
  }
}

// ✅ Add and export this too
export const getTargetAverageGrade = (data, totalRequired = 145) => {
  const currentUnits = data.reduce((sum, r) => sum + r.units, 0)
  const currentPoints = data.reduce((sum, r) => sum + r.grade * r.units, 0)
  const remainingUnits = totalRequired - currentUnits
  if (remainingUnits <= 0) return null

  const neededGrades = []
  const honors = [
    { name: 'Cum Laude', min: 3.25 },
    { name: 'Magna Cum Laude', min: 3.5 },
    { name: 'Summa Cum Laude', min: 3.75 }
  ]

  for (const { name, min } of honors) {
    const requiredTotalPoints = min * totalRequired
    const neededPoints = requiredTotalPoints - currentPoints
    const neededGrade = neededPoints / remainingUnits

    if (neededGrade <= 4.0) {
      neededGrades.push({
        target: name,
        avgGrade: neededGrade.toFixed(2),
        remainingUnits
      })
    }
  }

  return neededGrades.length > 0 ? neededGrades : null
}
