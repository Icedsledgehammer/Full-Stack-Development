// src/App.js
import React from 'react';
import RegistrationForm from './registration-form/RegistrationForm'; // Corrected path
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container mt-5">
        <h1 className="text-center mb-4">Registration Form</h1>
        <RegistrationForm />
      </div>
    </div>
  );
}

export default App;