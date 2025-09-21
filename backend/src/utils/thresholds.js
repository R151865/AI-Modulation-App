export const MODERATION_THRESHOLDS = {
  LOW: 0.4,
  MEDIUM: 0.7,
  HIGH: 0.9
}

export const getSeverity = (score) => {
  if (score >= MODERATION_THRESHOLDS.HIGH) return 'high'
  if (score >= MODERATION_THRESHOLDS.MEDIUM) return 'medium'
  if (score >= MODERATION_THRESHOLDS.LOW) return 'low'
  return 'none'
}

export const shouldFlagContent = (scores) => {
  return Object.values(scores).some(score => score >= MODERATION_THRESHOLDS.LOW)
}