// Fallback moderation service when APIs are not available
export const mockTextModeration = (text) => {
  const hasBadWords = /bad|hate|stupid|idiot|kill|attack|sex/i.test(text)
  const score = hasBadWords ? 0.8 : 0.1
  
  return {
    flagged: hasBadWords,
    severity: hasBadWords ? 'high' : 'low',
    categories: {
      toxicity: score,
      hate_speech: score * 0.8,
      sexual_content: score * 0.6
    },
    scores: {
      toxicity: score,
      hate_speech: score * 0.8,
      sexual_content: score * 0.6
    },
    highlights: hasBadWords ? [
      {
        start: text.search(/bad|hate|stupid|idiot|kill|attack|sex/i),
        end: text.search(/bad|hate|stupid|idiot|kill|attack|sex/i) + 3,
        severity: 'medium',
        reason: 'Potentially offensive term'
      }
    ] : []
  }
}

export const mockAudioTranscription = () => {
  const transcripts = [
    "This is a sample transcription of audio content.",
    "Hello there, how are you doing today?",
    "I think this is a wonderful application for content moderation.",
    "Please don't say bad words or hateful things to other people."
  ]
  
  return transcripts[Math.floor(Math.random() * transcripts.length)]
}

export const mockImageModeration = () => {
  return {
    flagged: Math.random() > 0.7,
    severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    categories: {
      explicit_content: Math.random() * 0.3,
      violence: Math.random() * 0.2,
      hate_symbols: Math.random() * 0.1,
      drugs: Math.random() * 0.4,
      weapons: Math.random() * 0.5,
      nudity: Math.random() * 0.6
    },
    scores: {
      explicit_content: Math.random() * 0.3,
      violence: Math.random() * 0.2,
      hate_symbols: Math.random() * 0.1,
      drugs: Math.random() * 0.4,
      weapons: Math.random() * 0.5,
      nudity: Math.random() * 0.6
    },
    description: "A sample image description for development purposes."
  }
}