// Farah
import React, { useState } from 'react';
import { submitReview } from '../../services/farahApi';
import Button from '../../components/Button';

export default function SubmitReviewPage({ targetType = 'listing', targetId }) {
  const [rating, setRating] = useState(5);
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Map payload attributes seamlessly based on review context
    const reviewPayload = {
      [targetType === 'listing' ? 'listing_id' : 'target_user_id']: targetId,
      rating,
      pros,
      cons
    };

    try {
      await submitReview(reviewPayload);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected platform error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="p-8 text-center bg-white rounded-lg shadow-md max-w-md mx-auto my-12 border border-[#E5E7EB]">
          <div className="text-[#10B981] text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Review Submitted</h2>
          <p className="text-[#6B7280]">Thank you! Your feedback helps maintain a trustworthy environment across UTM RoomieHub.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-8 border border-[#E5E7EB]">
        <h1 className="text-2xl font-bold text-[#111827] mb-6 border-b pb-3 border-[#E5E7EB]">
          Submit Experience Review
        </h1>

        {error && (
          <div className="p-3 mb-4 bg-red-50 text-[#EF4444] border border-red-200 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Selection Control */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors focus:outline-none ${
                    star <= rating ? 'text-amber-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Pros Input Field */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Pros</label>
            <textarea
              required
              rows={4}
              className="w-full p-2.5 border border-[#E5E7EB] rounded bg-[#F9FAFB] text-sm focus:outline-none focus:border-[#7B1E1E]"
              placeholder="What positive factors made this experience or property layout recommendable?"
              value={pros}
              onChange={(e) => setPros(e.target.value)}
            />
          </div>

          {/* Cons Input Field */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Cons</label>
            <textarea
              required
              rows={4}
              className="w-full p-2.5 border border-[#E5E7EB] rounded bg-[#F9FAFB] text-sm focus:outline-none focus:border-[#7B1E1E]"
              placeholder="Detail lifestyle disputes, distance hurdles, or infrastructure concerns faced."
              value={cons}
              onChange={(e) => setCons(e.target.value)}
            />
          </div>

          {/* Actions Bar */}
          <Button 
            type="submit" 
            disabled={loading} 
            style={{ backgroundColor: '#7B1E1E', color: '#FFF', width: '100%', padding: '12px' }}
          >
            {loading ? 'Processing Submission...' : 'Post Verified Review'}
          </Button>
        </form>
      </div>
    </div>
  );
}
