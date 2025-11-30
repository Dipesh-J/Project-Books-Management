import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { booksAPI, reviewsAPI } from '../services/api';
import useAuthStore from '../stores/authStore';
import { 
  SectionHeader, Card, Button, Badge, Loader, APIError, 
  Modal, Input, Textarea
} from '../components';

const BookDetailPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.userId || localStorage.getItem('userId');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const { data: book, isLoading, error, refetch } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => booksAPI.getById(bookId),
    select: (response) => response.data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: () => booksAPI.delete(bookId),
    onSuccess: () => {
      toast.success('Book deleted successfully!');
      navigate('/books');
    },
    onError: (error) => {
      const message = error.response?.data?.msg || 'Failed to delete book.';
      toast.error(message);
    },
  });

  const isOwner = book?.userId === userId;

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)]">
        <APIError error={error} onRetry={refetch} title="Failed to load book" />
      </div>
    );
  }

  if (!book) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <SectionHeader
        title={book.title}
        action={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/books')}>
              Back to Books
            </Button>
            {isOwner && (
              <>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate(`/books/${bookId}/edit`)}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Book Details */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="primary">{book.category}</Badge>
              <Badge variant="default">{book.subCategory}</Badge>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">{book.title}</h2>
            
            <p className="text-text-secondary mb-6">{book.excerpt}</p>

            <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-background">
              <InfoItem label="ISBN" value={book.ISBN} />
              <InfoItem label="Released" value={formatDate(book.releasedAt)} />
              <InfoItem label="Reviews" value={book.reviews?.length || 0} />
              <InfoItem label="Added" value={formatDate(book.createdAt)} />
            </div>
          </Card>
        </div>

        {/* Reviews Summary */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Reviews</h3>
              <Button 
                size="sm" 
                variant="primary"
                onClick={() => {
                  setEditingReview(null);
                  setShowReviewModal(true);
                }}
              >
                Add Review
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-bold text-primary-variant">
                {calculateAvgRating(book.reviews)}
              </div>
              <div>
                <StarRating rating={calculateAvgRating(book.reviews)} />
                <p className="text-text-secondary text-sm mt-1">
                  {book.reviews?.length || 0} reviews
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">All Reviews</h3>
        {!book.reviews || book.reviews.length === 0 ? (
          <Card>
            <p className="text-text-secondary text-center py-4">
              No reviews yet. Be the first to review this book!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {book.reviews.map((review) => (
              <ReviewCard 
                key={review._id} 
                review={review} 
                bookId={bookId}
                onEdit={() => {
                  setEditingReview(review);
                  setShowReviewModal(true);
                }}
                queryClient={queryClient}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Book"
      >
        <p className="text-text-secondary mb-6">
          Are you sure you want to delete this book? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => deleteMutation.mutate()}
            loading={deleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setEditingReview(null);
        }}
        bookId={bookId}
        review={editingReview}
        queryClient={queryClient}
      />
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-text-secondary text-sm">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
);

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  
  for (let i = 0; i < 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-5 h-5 ${i < fullStars ? 'text-primary-variant' : 'text-surface'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }
  
  return <div className="flex">{stars}</div>;
};

const calculateAvgRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

const ReviewCard = ({ review, bookId, onEdit, queryClient }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const deleteMutation = useMutation({
    mutationFn: () => reviewsAPI.delete(bookId, review._id),
    onSuccess: () => {
      toast.success('Review deleted!');
      queryClient.invalidateQueries(['book', bookId]);
      setShowDeleteModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || 'Failed to delete review');
    },
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium text-white">{review.reviewedBy}</p>
            <p className="text-text-secondary text-sm">{formatDate(review.reviewedAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} />
            <div className="flex gap-2 ml-4">
              <button 
                onClick={onEdit}
                className="text-text-secondary hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="text-text-secondary hover:text-error transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {review.review && (
          <p className="text-text-secondary">{review.review}</p>
        )}
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Review"
        size="sm"
      >
        <p className="text-text-secondary mb-6">
          Are you sure you want to delete this review?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => deleteMutation.mutate()}
            loading={deleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

const ReviewModal = ({ isOpen, onClose, bookId, review, queryClient }) => {
  const [formData, setFormData] = useState({
    reviewedBy: review?.reviewedBy || '',
    rating: review?.rating || 5,
    review: review?.review || '',
  });
  const [errors, setErrors] = useState({});

  const createMutation = useMutation({
    mutationFn: (data) => reviewsAPI.create(bookId, data),
    onSuccess: () => {
      toast.success('Review added!');
      queryClient.invalidateQueries(['book', bookId]);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || 'Failed to add review');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => reviewsAPI.update(bookId, review._id, data),
    onSuccess: () => {
      toast.success('Review updated!');
      queryClient.invalidateQueries(['book', bookId]);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || 'Failed to update review');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const data = {
        ...formData,
        rating: parseInt(formData.rating),
      };
      
      if (review) {
        updateMutation.mutate(data);
      } else {
        createMutation.mutate(data);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={review ? 'Edit Review' : 'Add Review'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Name"
          name="reviewedBy"
          value={formData.reviewedBy}
          onChange={handleChange}
          placeholder="Enter your name (optional)"
        />

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                className="focus:outline-none"
              >
                <svg
                  className={`w-8 h-8 ${
                    star <= formData.rating ? 'text-primary-variant' : 'text-surface'
                  } transition-colors hover:text-primary-variant`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-error">{errors.rating}</p>
          )}
        </div>

        <Textarea
          label="Review"
          name="review"
          value={formData.review}
          onChange={handleChange}
          placeholder="Write your review (optional)"
          rows={4}
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {review ? 'Update' : 'Submit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookDetailPage;
