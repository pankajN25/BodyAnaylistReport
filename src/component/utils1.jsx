// ValueBadge - show circular colored badge + optional diff
import React from 'react';
import { getStatusTagText } from './utils';
const formatNumber = (n) => {
  if (isNaN(n) || n === null) return '-';
  return Number.isInteger(n) ? String(n) : Number(n).toFixed(1);
};

const statusToColor = (status) => {
  if (!status) return 'neutral';
  if (status === 'Standard') return 'green';
  if (status === 'High') return 'amber';
  if (status === 'Risk') return 'red';
  if (status === 'Low') return 'red'; // low muscle -> red
  return 'neutral';
};

/**
 * Props:
 *  - value: numeric (customer value)
 *  - statusType: string used by getStatusTagText ('bodyFat', 'visceralFat', or 'muscleRate' / 'bmi' etc.)
 *  - gender: 'Male' | 'Female' (we normalize inside)
 *  - standard: numeric standard value for this metric (to compute diff)
 *  - betterHigher: boolean -> true if higher value is better (e.g. muscle), false if lower is better (e.g. fat)
 */
const ValueBadge = ({ value, statusType, gender, standard, betterHigher = false }) => {
  const v = Number(value);
  const genderNorm = ('' + (gender || '')).charAt(0).toUpperCase() + ('' + (gender || '')).slice(1).toLowerCase();
  const status = getStatusTagText(v, statusType, genderNorm);
  const color = statusToColor(status);
  const showDiff =
    !isNaN(v) &&
    standard != null &&
    ((statusType === 'bodyFat' || statusType === 'visceralFat') ? (status === 'High' || status === 'Risk') :
     (betterHigher ? status === 'Low' : (status === 'High' || status === 'Risk')));
  let diffText = null;
  if (showDiff) {
    // For fat/visceral: diff = v - standard. For muscle: diff = v - standard (will be negative if low)
    const rawDiff = v - Number(standard);
    // Show absolute with sign appropriate
    const disp = rawDiff >= 0 ? `+${rawDiff.toFixed(1)}%` : `${rawDiff.toFixed(1)}%`;
    diffText = disp;
  }

  return (
    <div className={`value-badge ${color}`}>
      <div className="value-text">{isNaN(v) ? '-' : formatNumber(v)}%</div>
      {diffText && <div className="value-diff">{diffText}</div>}
    </div>
  );
};


export default ValueBadge;


