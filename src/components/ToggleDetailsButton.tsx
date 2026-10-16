"use client";

import { useState } from "react";

export function ToggleDetailsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen((current) => !current)}>
        Toggle details
      </button>
      {isOpen && <p>Extra information about this property.</p>}
    </div>
  );
}
