import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { Input, Button, Card, Select } from '../components';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    address: {
      street: '',
      city: '',
      pincode: '',
    },
  });
  const [errors, setErrors] = useState({});

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    },
    onError: (error) => {
      const message = error.response?.data?.msg || 'Registration failed. Please try again.';
      toast.error(message);
    },
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z ]+(([',. -][a-zA-Z ])?[a-zA-Z ])*$/.test(formData.name)) {
      newErrors.name = 'Please enter a valid name';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(formData.password)) {
      newErrors.password = 'Password must be 8-15 chars with uppercase, lowercase, and number';
    }
    
    if (!formData.address.street) {
      newErrors.street = 'Street is required';
    }
    
    if (!formData.address.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.address.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.address.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      registerMutation.mutate(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
      if (errors[addressField]) {
        setErrors((prev) => ({ ...prev, [addressField]: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const titleOptions = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Miss', label: 'Miss' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">Create Account</h1>
          <p className="text-text-secondary">Join our book community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              options={titleOptions}
              error={errors.title}
              required
            />
            
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              error={errors.name}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              error={errors.email}
              required
            />
            
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit phone"
              error={errors.phone}
              required
            />
          </div>

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="8-15 characters"
            error={errors.password}
            required
          />

          <div className="border-t border-background pt-5">
            <h3 className="text-sm font-medium text-text-secondary mb-4">Address</h3>
            
            <div className="space-y-4">
              <Input
                label="Street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Street address"
                error={errors.street}
                required
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City name"
                  error={errors.city}
                  required
                />
                
                <Input
                  label="Pincode"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  error={errors.pincode}
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={registerMutation.isPending}
          >
            Create Account
          </Button>
        </form>

        <p className="text-center mt-6 text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-variant hover:text-primary">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
