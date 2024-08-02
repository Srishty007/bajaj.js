const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// User details
const user_id = 'john_doe_17091999';
const email = 'john@xyz.com';
const roll_number = 'ABCD123';

// POST /bfhl
app.post('/bfhl', (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      message: "Invalid input format, expected an array."
    });
  }

  let numbers = [];
  let alphabets = [];

  data.forEach(item => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else if (/^[A-Za-z]$/.test(item)) {
      alphabets.push(item);
    }
  });

  const highest_alphabet = alphabets.length > 0 
    ? [alphabets.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).pop()] 
    : [];

  res.json({
    is_success: true,
    user_id,
    email,
    roll_number,
    numbers,
    alphabets,
    highest_alphabet
  });
});

// GET /bfhl
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(
      e.target.checked
        ? [...selectedOptions, value]
        : selectedOptions.filter((option) => option !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedInput = JSON.parse(jsonInput);
      const response = await axios.post('https://your-backend-url/bfhl', parsedInput);
      setResponseData(response.data);
      setError('');
    } catch (err) {
      setError('Invalid JSON or request failed.');
      setResponseData(null);
    }
  };

  const renderResponseData = () => {
    if (!responseData) return null;

    const { numbers, alphabets, highest_alphabet } = responseData;

    return (
      <div>
        {selectedOptions.includes('numbers') && numbers.length > 0 && (
          <div>
            <strong>Numbers:</strong> {numbers.join(', ')}
          </div>
        )}
        {selectedOptions.includes('alphabets') && alphabets.length > 0 && (
          <div>
            <strong>Alphabets:</strong> {alphabets.join(', ')}
          </div>
        )}
        {selectedOptions.includes('highest_alphabet') && highest_alphabet.length > 0 && (
          <div>
            <strong>Highest Alphabet:</strong> {highest_alphabet.join(', ')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Bajaj Finserv Health Dev Challenge</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={handleInputChange}
          placeholder='Enter JSON input'
          rows="5"
          cols="40"
        />
        <button type='submit'>Submit</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {responseData && (
        <div>
          <h2>Response:</h2>
          <div>
            <label>
              <input
                type="checkbox"
                value="numbers"
                onChange={handleOptionChange}
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                value="alphabets"
                onChange={handleOptionChange}
              />
              Alphabets
            </label>
            <label>
              <input
                type="checkbox"
                value="highest_alphabet"
                onChange={handleOptionChange}
              />
              Highest Alphabet
            </label>
          </div>
          {renderResponseData()}
        </div>
      )}
    </div>
  );
}

export default App;
