// src/registration-form/RegistrationForm.js
import React, { useState } from 'react';
import FormInput from './components/FormInput';
import './components/registrationForm.css'; // Updated path to point to the components folder

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="card p-4 registration-form">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
          required
        />
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;