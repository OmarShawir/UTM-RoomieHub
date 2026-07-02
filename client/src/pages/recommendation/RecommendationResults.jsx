import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// This page redirects to the real listing detail page.
// The recommendation results now use /listings/:id directly.
export default function RecommendedListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/listings/${id}`, { replace: true });
  }, [id, navigate]);

  return null;
}
