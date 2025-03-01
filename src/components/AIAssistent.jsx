import React, { useState, useEffect } from "react";

export const AIAssistant = ({ elements, onSuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Analyze current design and generate suggestions
    if (elements.length > 0) {
      const newSuggestions = analyzeDesign(elements);
      setSuggestions(newSuggestions);
    }
  }, [elements]);

  const analyzeDesign = (elements) => {
    const suggestions = [];

    // Check for alignment issues
    const xPositions = elements.map((el) => el.x);
    const yPositions = elements.map((el) => el.y);
    const uniqueX = [...new Set(xPositions)];

    if (uniqueX.length > 1 && uniqueX.length < elements.length / 2) {
      suggestions.push({
        type: "alignment",
        message: "Consider aligning elements to improve visual hierarchy",
        action: "align-elements",
      });
    }

    // Check for color harmony
    const backgrounds = elements
      .map((el) => el.backgroundColor)
      .filter(Boolean);
    if (backgrounds.length > 2) {
      suggestions.push({
        type: "color",
        message: "Try using a more consistent color scheme for better harmony",
        action: "suggest-colors",
      });
    }

    // Check for spacing consistency
    const paddings = elements.map((el) => el.padding).filter(Boolean);
    if (new Set(paddings).size > 2) {
      suggestions.push({
        type: "spacing",
        message: "Use consistent padding values for better visual rhythm",
        action: "normalize-spacing",
      });
    }

    // Check for responsiveness issues
    if (elements.some((el) => el.width > 800)) {
      suggestions.push({
        type: "responsive",
        message: "Some elements might be too wide for mobile screens",
        action: "make-responsive",
      });
    }

    return suggestions;
  };

  return (
    <div className="ai-assistant">
      <div className="assistant-header">
        <h3>AI Design Assistant</h3>
      </div>
      <div className="assistant-content">
        {suggestions.length === 0 ? (
          <p className="no-suggestions">
            Your design looks good! Add more elements to get AI suggestions.
          </p>
        ) : (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} className={`suggestion ${suggestion.type}`}>
                <p>{suggestion.message}</p>
                <button onClick={() => onSuggestion(suggestion)}>
                  Apply Suggestion
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
