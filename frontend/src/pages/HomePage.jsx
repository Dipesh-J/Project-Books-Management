import { Link } from 'react-router-dom';
import Button from '../components/Button';
import useAuthStore from '../stores/authStore';

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
            Your Personal
            <span className="text-primary-variant block mt-2">Book Library</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Discover, organize, and manage your book collection with ease.
            Track your reading progress and share reviews with the community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/books">
                  <Button size="lg" variant="primary">
                    Browse Books
                  </Button>
                </Link>
                <Link to="/books/create">
                  <Button size="lg" variant="secondary">
                    Add New Book
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" variant="primary">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="secondary">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary-variant/20 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-semibold text-white text-center mb-12">
            Why Choose BookShelf?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              title="Organize Your Books"
              description="Keep your entire book collection organized by category, author, or any custom tags you prefer."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
              title="Rate & Review"
              description="Share your thoughts and ratings on books you've read. Help others discover great reads."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Secure & Private"
              description="Your data is secure with us. Only you can access and manage your personal book collection."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Join thousands of book lovers who are already using BookShelf to manage their collections.
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button size="lg" variant="primary">
                Create Free Account
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-surface rounded-lg p-6 text-center hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 text-primary-variant rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-text-secondary">{description}</p>
  </div>
);

export default HomePage;
