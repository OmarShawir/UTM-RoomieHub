// Farah
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';

export default function ListingReviewsPage() {
  const { id } = useParams(); // Grabs the listing ID from the URL path
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/listing/${id}`, { withCredentials: true });
        setReviews(response.data);
      } catch (err) {
        setError('Failed to load reviews for this listing.');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchReviews();
  }, [id]);

  return (
    <div className="page-wrapper max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Listing Reviews</h1>
      
      {loading && <p className="text-sm text-[#6B7280]">Loading reviews...</p>}
      {error && <div className="p-3 bg-red-50 text-[#EF4444] rounded text-sm mb-4">{error}</div>}
      {!loading && reviews.length === 0 && <p className="text-sm text-[#6B7280]">No reviews found for this listing yet.</p>}

      <div className="space-y-4">
        {reviews.map((rev) => (
          <Card key={rev.review_id} className="p-4 bg-white border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-500 font-bold">{'★'.repeat(rev.rating)}</span>
              <span className="text-xs text-[#6B7280]">{new Date(rev.created_at).toLocaleDateString()}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
              <div className="p-2 bg-green-50 rounded border border-green-100">
                <strong className="text-green-800 block text-xs uppercase mb-1">Pros</strong>
                <p className="text-[#111827]">{rev.pros}</p>
              </div>
              <div className="p-2 bg-red-50 rounded border border-red-100">
                <strong className="text-red-800 block text-xs uppercase mb-1">Cons</strong>
                <p className="text-[#111827]">{rev.cons}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
