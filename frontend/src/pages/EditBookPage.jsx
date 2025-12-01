import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { booksAPI } from '../services/api';
import { SectionHeader, Card, Input, Textarea, Button, Loader, APIError } from '../components';

const EditBookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => booksAPI.getById(bookId),
    select: (response) => response.data.data,
  });

  // Initialize form data from book when first loaded
  if (book && !isInitialized) {
    setFormData({
      title: book.title || '',
      excerpt: book.excerpt || '',
      ISBN: book.ISBN || '',
      releasedAt: book.releasedAt ? book.releasedAt.split('T')[0] : '',
    });
    setIsInitialized(true);
  }

  const updateMutation = useMutation({
    mutationFn: (data) => booksAPI.update(bookId, data),
    onSuccess: () => {
      toast.success('Book updated successfully!');
      queryClient.invalidateQueries(['book', bookId]);
      queryClient.invalidateQueries(['books']);
      navigate(`/books/${bookId}`);
    },
    onError: (err) => {
      const message = err.response?.data?.msg || err.response?.data?.message || 'Failed to update book.';
      toast.error(message);
    },
  });

  const validateForm = () => {
    if (!formData) return false;
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }
    
    if (!formData.ISBN.trim()) {
      newErrors.ISBN = 'ISBN is required';
    } else if (!/^(?:ISBN(?:-13)?:? )?(?=[0-9]{13}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)97[89][- ]?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9]$/.test(formData.ISBN)) {
      newErrors.ISBN = 'Please enter a valid ISBN-13 (e.g., 978-0-618-05676-7)';
    }
    
    if (!formData.releasedAt) {
      newErrors.releasedAt = 'Release date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updateMutation.mutate(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : prev);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)]">
        <APIError error={error} title="Failed to load book" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <SectionHeader
        title="Edit Book"
        subtitle={`Editing: ${book?.title}`}
      />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Book Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
            error={errors.title}
            required
          />

          <Textarea
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Brief description of the book"
            error={errors.excerpt}
            required
            rows={4}
          />

          <Input
            label="ISBN"
            name="ISBN"
            value={formData.ISBN}
            onChange={handleChange}
            placeholder="e.g., 978-0-618-05676-7"
            error={errors.ISBN}
            required
          />

          <Input
            label="Release Date"
            type="date"
            name="releasedAt"
            value={formData.releasedAt}
            onChange={handleChange}
            error={errors.releasedAt}
            required
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/books/${bookId}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={updateMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditBookPage;
