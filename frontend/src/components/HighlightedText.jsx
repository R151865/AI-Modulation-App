const HighlightedText = ({ text, highlights }) => {
  if (!highlights || highlights.length === 0) {
    return <span>{text}</span>
  }

  // Sort highlights by start offset
  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start)
  
  let lastIndex = 0
  const parts = []

  sortedHighlights.forEach((highlight, index) => {
    // Add text before highlight
    if (highlight.start > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, highlight.start),
        highlighted: false
      })
    }

    // Add highlighted text
    parts.push({
      text: text.slice(highlight.start, highlight.end),
      highlighted: true,
      severity: highlight.severity
    })

    lastIndex = highlight.end
  })

  // Add remaining text after last highlight
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      highlighted: false
    })
  }

  return (
    <span>
      {parts.map((part, index) =>
        part.highlighted ? (
          <span
            key={index}
            className="incident-highlight"
            title={`${part.severity} risk`}
          >
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </span>
  )
}

export default HighlightedText