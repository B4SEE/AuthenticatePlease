'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    satisfaction: '5',
    usageFrequency: '',
    features: [],
    improvements: '',
    feedbackDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z ]{2,}$/.test(formData.name.trim())) {
      newErrors.name = 'Name must contain only letters and spaces (minimum 2 characters)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
      newErrors.age = 'Age must be between 13 and 120';
    }

    if (!formData.usageFrequency) {
      newErrors.usageFrequency = 'Please select how often you play';
    }

    if (!formData.improvements.trim()) {
      newErrors.improvements = 'Please provide some feedback';
    } else if (formData.improvements.length < 10) {
      newErrors.improvements = 'Feedback must be at least 10 characters long';
    }

    if (!formData.feedbackDate) {
      newErrors.feedbackDate = 'Please select when you last played';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/mblonvqo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Thank you for your feedback!');
        router.push('/dashboard');
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name === 'features') {
        const features = [...(formData.features as string[])];
        if (checkbox.checked) {
          features.push(value);
        } else {
          const index = features.indexOf(value);
          if (index > -1) features.splice(index, 1);
        }
        setFormData(prev => ({ ...prev, features }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-300 mb-2" htmlFor="name">
          Name <span className="text-[#FF4365]">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          autoFocus
          className={`w-full p-3 rounded bg-[#1A2C44] text-white border focus:outline-none focus:ring-2 focus:ring-[#64FFDA] ${
            errors.name ? 'border-[#FF4365]' : 'border-transparent'
          }`}
        />
        {errors.name && <p className="mt-1 text-[#FF4365] text-sm">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-gray-300 mb-2" htmlFor="email">
          Email <span className="text-[#FF4365]">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          className={`w-full p-3 rounded bg-[#1A2C44] text-white border focus:outline-none focus:ring-2 focus:ring-[#64FFDA] ${
            errors.email ? 'border-[#FF4365]' : 'border-transparent'
          }`}
        />
        {errors.email && <p className="mt-1 text-[#FF4365] text-sm">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-gray-300 mb-2" htmlFor="age">
          Age <span className="text-[#FF4365]">*</span>
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min="13"
          max="120"
          placeholder="Your age"
          className={`w-full p-3 rounded bg-[#1A2C44] text-white border focus:outline-none focus:ring-2 focus:ring-[#64FFDA] ${
            errors.age ? 'border-[#FF4365]' : 'border-transparent'
          }`}
        />
        {errors.age && <p className="mt-1 text-[#FF4365] text-sm">{errors.age}</p>}
      </div>

      <div>
        <label className="block text-gray-300 mb-2" htmlFor="satisfaction">
          How satisfied are you with the game? (1-10)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            id="satisfaction"
            name="satisfaction"
            value={formData.satisfaction}
            onChange={handleChange}
            min="1"
            max="10"
            step="1"
            className="flex-1"
          />
          <span className="text-[#64FFDA] font-mono w-8 text-center">{formData.satisfaction}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-sm mt-1">
          <span>Not satisfied</span>
          <span>Very satisfied</span>
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2" htmlFor="usageFrequency">
          How often do you play? <span className="text-[#FF4365]">*</span>
        </label>
        <select
          id="usageFrequency"
          name="usageFrequency"
          value={formData.usageFrequency}
          onChange={handleChange}
          className={`w-full p-3 rounded bg-[#1A2C44] text-white border focus:outline-none focus:ring-2 focus:ring-[#64FFDA] ${
            errors.usageFrequency ? 'border-[#FF4365]' : 'border-transparent'
          }`}
        >
          <option value="">Select frequency</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="rarely">Rarely</option>
        </select>
        {errors.usageFrequency && <p className="mt-1 text-[#FF4365] text-sm">{errors.usageFrequency}</p>}
      </div>

      <div>
        <label className="block text-gray-300 mb-2">
          Which features do you like? (Select all that apply)
        </label>
        <div className="space-y-2">
          {['Email Analysis', 'Statistics', 'Tutorial', 'UI Design'].map((feature) => (
            <label key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="features"
                value={feature}
                checked={formData.features.includes(feature)}
                onChange={handleChange}
                className="form-checkbox text-[#64FFDA]"
              />
              <span className="text-gray-300">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2" htmlFor="improvements">
          What improvements would you suggest? <span className="text-[#FF4365]">*</span>
        </label>
        <textarea
          id="improvements"
          name="improvements"
          value={formData.improvements}
          onChange={handleChange}
          placeholder="Share your suggestions... (minimum 10 characters)"
          minLength={10}
          maxLength={500}
          className={`w-full p-3 rounded bg-[#1A2C44] text-white border focus:outline-none focus:ring-2 focus:ring-[#64FFDA] h-32 ${
            errors.improvements ? 'border-[#FF4365]' : 'border-transparent'
          }`}
        />
        {errors.improvements && <p className="mt-1 text-[#FF4365] text-sm">{errors.improvements}</p>}
      </div>

      <div>
        <label className="block text-gray-300 mb-2" htmlFor="feedbackDate">
          When did you last play the game? <span className="text-[#FF4365]">*</span>
        </label>
        <input
          type="date"
          id="feedbackDate"
          name="feedbackDate"
          value={formData.feedbackDate}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
          className={`w-full p-3 rounded bg-[#1A2C44] text-white border focus:outline-none focus:ring-2 focus:ring-[#64FFDA] ${
            errors.feedbackDate ? 'border-[#FF4365]' : 'border-transparent'
          }`}
        />
        {errors.feedbackDate && <p className="mt-1 text-[#FF4365] text-sm">{errors.feedbackDate}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-[#64FFDA] text-[#0A192F] font-extrabold text-lg py-3 rounded shadow-md transition-colors ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#52E9C2]'
        }`}
      >
        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT FEEDBACK'}
      </button>
    </form>
  );
} 