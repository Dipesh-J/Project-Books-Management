import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { booksAPI } from '../services/api';
import useAuthStore from '../stores/authStore';
import { SectionHeader, Card, Input, Textarea, Button } from '../components';

const CreateBookPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userId = user?.userId;
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    ISBN: '',
    category: '',
    subCategory: '',
    releasedAt: '',
  });
  const [errors, setErrors] = useState({});

  const createMutation = useMutation({
    mutationFn: (data) => booksAPI.create({ ...data, userId }),
    onSuccess: () => {
      toast.success('Book created successfully!');
      navigate('/books');
    },
    onError: (error) => {
      const message = error.response?.data?.msg || 'Failed to create book. Please try again.';
      toast.error(message);
    },
  });

  const validateForm = () => {
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
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.subCategory.trim()) {
      newErrors.subCategory = 'Subcategory is required';
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
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <SectionHeader
        title="Add New Book"
        subtitle="Add a new book to your collection"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Fiction"
              error={errors.category}
              required
            />

            <Input
              label="Subcategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              placeholder="e.g., Thriller"
              error={errors.subCategory}
              required
            />
          </div>

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
              onClick={() => navigate('/books')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.isPending}
            >
              Create Book
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateBookPage;
