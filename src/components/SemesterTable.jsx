import React, { useState, useEffect, useRef } from 'react';

const SemesterTable = ({ title, onUpdate }) => {
  const [rows, setRows] = useState([{ grade: '', units: '' }]);
  const [errors, setErrors] = useState([]);
  const inputRefs = useRef([]);

  // Validate and update parent only when rows change
  useEffect(() => {
    const validRows = rows
      .filter((r) => isValidGrade(r.grade) && isValidUnits(r.units))
      .map((r) => ({
        grade: parseFloat(r.grade),
        units: parseFloat(r.units),
      }));

    const currentErrors = rows.map((r) => ({
      grade: r.grade && !isValidGrade(r.grade),
      units: r.units && !isValidUnits(r.units),
    }));

    setErrors(currentErrors);

    if (typeof onUpdate === 'function') {
      onUpdate(validRows); // ✅ safe from causing loops
    }
  }, [rows]); // ✅ only runs when rows change

  // Grade & Unit validators
  const isValidGrade = (value) =>
    value !== '' && !isNaN(value) && value >= 1 && value <= 4;

  const isValidUnits = (value) =>
    value !== '' && !isNaN(value) && value > 0;

  // Update a single row field
  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // Add new blank row
  const addRow = () => {
    setRows((prev) => [...prev, { grade: '', units: '' }]);
  };

  // Auto-focus logic when pressing Enter
  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const isLastRow = rowIndex === rows.length - 1;

      if (isLastRow) {
        addRow();
        setTimeout(() => {
          inputRefs.current[rowIndex + 1]?.[colIndex]?.focus();
        }, 0);
      } else {
        inputRefs.current[rowIndex + 1]?.[colIndex]?.focus();
      }
    }
  };

  // Keep refs in sync with number of rows
  useEffect(() => {
    inputRefs.current.length = rows.length;
    rows.forEach((_, i) => {
      inputRefs.current[i] = inputRefs.current[i] || [];
    });
  }, [rows.length]);

  return (
    <div className="semester">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Units</th>
            <th>Grade (1.00 - 4.00)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <input
                  type="number"
                  value={row.units}
                  placeholder="e.g. 3"
                  min="0.5"
                  step="0.5"
                  className={errors[i]?.units ? 'invalid' : ''}
                  ref={(el) => {
                    inputRefs.current[i] = inputRefs.current[i] || [];
                    inputRefs.current[i][0] = el;
                  }}
                  onChange={(e) => updateRow(i, 'units', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i, 0)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.grade}
                  placeholder="e.g. 1.75"
                  min="1"
                  max="4"
                  step="0.01"
                  className={errors[i]?.grade ? 'invalid' : ''}
                  ref={(el) => {
                    inputRefs.current[i] = inputRefs.current[i] || [];
                    inputRefs.current[i][1] = el;
                  }}
                  onChange={(e) => updateRow(i, 'grade', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i, 1)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>+ Add Subject</button>
    </div>
  );
};

export default SemesterTable;
