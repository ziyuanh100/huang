import React from 'react';

interface SubjectInputProps {
  id: string;
  name: string;
  weight: number;
  value: number;
  onChange: (id: string, value: number) => void;
  category: 'general' | 'professional' | 'special';
}

export const SubjectInput: React.FC<SubjectInputProps> = ({
  id,
  name,
  weight,
  value,
  onChange,
  category,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    onChange(id, val);
  };

  const getBorderColor = () => {
    switch (category) {
      case 'general': return 'border-l-blue-500';
      case 'professional': return 'border-l-indigo-500';
      case 'special': return 'border-l-teal-500';
      default: return 'border-l-gray-300';
    }
  };

  const getBadgeColor = () => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-indigo-100 text-indigo-800';
      case 'special': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`relative bg-white p-4 rounded-lg shadow-sm border border-gray-100 ${getBorderColor()} border-l-4 transition-transform hover:-translate-y-1 hover:shadow-md`}>
      <div className="flex justify-between items-start mb-2">
        <label htmlFor={id} className="font-semibold text-gray-700 text-lg">
          {name}
        </label>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeColor()}`}>
          x{weight}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          id={id}
          value={value === 0 ? '' : value}
          onChange={handleChange}
          placeholder="0"
          className="w-full text-2xl font-bold text-gray-800 border-b-2 border-gray-200 focus:border-indigo-500 outline-none py-1 transition-colors placeholder-gray-300"
          min="0"
          max="100"
        />
        <span className="text-gray-400 font-medium">分</span>
      </div>
      <div className="mt-2 text-xs text-gray-400 text-right">
        加權分: {(value * weight).toFixed(1)}
      </div>
    </div>
  );
};