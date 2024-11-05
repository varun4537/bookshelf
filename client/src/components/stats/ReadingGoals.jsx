import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { userService } from '../../services/userService';
import { showToast } from '../../utils/toast';

const ReadingGoals = () => {
  const [yearlyGoal, setYearlyGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await userService.updateReadingGoal(Number(yearlyGoal));
      showToast.success('Reading goal updated successfully');
    } catch (error) {
      showToast.error('Failed to update reading goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold">Reading Goals</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Books to read this year
          </label>
          <input
            type="number"
            value={yearlyGoal}
            onChange={(e) => setYearlyGoal(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            placeholder="Enter your goal"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Set Goal'}
        </button>
      </form>
    </div>
  );
};

export default ReadingGoals;