import React, { useState } from "react";

/**
 * OptionalParamsMenu component renders the dropdown shown when the `+` button is clicked.
 *
 * Props
 *  - open (boolean): whether the dropdown should be visible.
 *  - onClose (function): callback to close the dropdown (called on Escape key or outside click).
 *  - selected (array<string>): list of currently-selected optional rows.
 *  - onChange (function): (newSelected: string[]) => void – sent whenever the selection changes.
 */
const PARAM_OPTIONS = [
  "Sales",
  "Promotion/Marketing",
  "Inventory Level %",
  "Stock out days",
  "On Hand",
];

export default function OptionalParamsMenu({
  open,
  onClose,
  selected,
  onChange,
}) {
  const [search, setSearch] = useState("");

  // Filter options by search query (case-insensitive contains)
  const filteredOptions = PARAM_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (option) => {
    const newSel = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    onChange(newSel);
  };

  // Close dropdown when user presses Escape
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  if (!open) return null;

  return (
    <div
      className="position-absolute end-0 mt-2 p-2 border bg-white shadow rounded"
      style={{ minWidth: "220px" }}
      role="menu"
      aria-label="Optional parameters menu"
      onKeyDown={handleKeyDown}
    >
      {/* Search box */}
      <div className="p-2 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search Data Rows"
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Options list */}
      <ul className="max-h-60 overflow-y-auto p-2 text-sm">
        <li className="d-flex align-items-center py-1">
          <input
            id="chk-all"
            type="checkbox"
            checked={selected.length === PARAM_OPTIONS.length}
            onChange={() =>
              onChange(
                selected.length === PARAM_OPTIONS.length ? [] : PARAM_OPTIONS
              )
            }
          />
          <label htmlFor="chk-all" className="ms-2 cursor-pointer select-none">
            All
          </label>
        </li>
        {filteredOptions.map((opt) => (
          <li key={opt} className="d-flex align-items-center py-1">
            <input
              id={`chk-${opt}`}
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => handleToggle(opt)}
            />
            <label
              htmlFor={`chk-${opt}`}
              className="ms-2 cursor-pointer select-none"
            >
              {opt}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
