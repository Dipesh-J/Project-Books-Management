import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { booksAPI } from '../services/api';
import { SectionHeader, Card, Button, Input, Loader, APIError, Badge } from '../components';

const BooksListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subCategory: searchParams.get('subCategory') || '',
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['books', filters],
    queryFn: () => booksAPI.getAll(filters),
    select: (response) => response.data.data,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({ category: '', subCategory: '' });
    setSearchParams({});
  };

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
        <APIError error={error} onRetry={refetch} title="Failed to load books" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <SectionHeader
        title="Books Library"
        subtitle="Explore our collection of books"
        action={
          <Button onClick={() => navigate('/books/create')} variant="primary">
            Add New Book
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-surface rounded-lg p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Filter by category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          />
          <Input
            placeholder="Filter by subcategory"
            name="subCategory"
            value={filters.subCategory}
            onChange={handleFilterChange}
          />
          {(filters.category || filters.subCategory) && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Books Grid */}
      {!data || data.length === 0 ? (
        <EmptyState onAdd={() => navigate('/books/create')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((book) => (
            <BookCard 
              key={book._id} 
              book={book} 
              onClick={() => navigate(`/books/${book._id}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BookCard = ({ book, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card hoverable onClick={onClick}>
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="primary">{book.category}</Badge>
          <div className="flex items-center text-primary-variant">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm">{book.reviews || 0}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {book.title}
        </h3>
        
        <p className="text-text-secondary text-sm flex-grow line-clamp-3 mb-4">
          {book.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-text-secondary pt-4 border-t border-background">
          <span>Released: {formatDate(book.releasedAt)}</span>
        </div>
      </div>
    </Card>
  );
};

const EmptyState = ({ onAdd }) => (
  <div className="text-center py-16">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-surface rounded-full mb-6">
      <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No Books Found</h3>
    <p className="text-text-secondary mb-6">Start building your library by adding your first book.</p>
    <Button onClick={onAdd} variant="primary">
      Add Your First Book
    </Button>
  </div>
);

export default BooksListPage;
