// Farah
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/Card';

export default function UserReviewsPage() {
  const { id } = useParams(); // Grabs target user/roommate ID from URL
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserReviews() {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/user/${id}`, { withCredentials: true });
        setReviews(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchUserReviews();
  }, [id]);

  return (
    <div className="page-wrapper max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#111827] mb-2">Roommate History Feedback</h1>
      <p className="text-sm text-[#6B7280] mb-6">Verify peer records regarding lifestyle choices and habits.</p>

      {loading ? (
        <p className="text-sm text-[#6B7280]">Loading roommate profiles metrics...</p>
      ) : (
        <div className="space-y-4">
          {reviews.length === 0 && <p className="text-sm text-[#6B7280]">No roommate reviews listed yet.</p>}
          {reviews.map((r) => (
            <Card key={r.review_id} className="p-4 border border-[#E5E7EB] bg-white">
              <div className="text-amber-500 font-bold mb-2">{'★'.repeat(r.rating)}</div>
              <p className="text-sm text-[#111827] mb-2"><strong>Pros:</strong> {r.pros}</p>
              <p className="text-sm text-[#111827]"><strong>Cons:</strong> {r.cons}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
