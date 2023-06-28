import React, { useState } from 'react';

export default function SuggestionsList({ suggestions }) {
  const [highlightedItem, setHighlightedItem] = useState(null);

  const handleMouseEnter = (item) => {
    setHighlightedItem(item);
  };

  const handleMouseLeave = () => {
    setHighlightedItem(null);
  };

  return (
      <div className="list-container max-h-60 overflow-y-auto">
        <ul
            data-testid="results-list"
            className="list rounded-md w-96 text-lg bg-white"
        >
          {suggestions.map((item) => (
              <li key={item.id}
                  data-testid={`suggestion-item-${item.id}`}
                  className={`p-1${highlightedItem === item ? ' bg-blue-200' : ''}`}
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}>
                <span>{item.title || item.name}</span>
              </li>
          ))}
        </ul>
      </div>
  );
}
