import React, { useState } from 'react';
import axios from 'axios';
import { TextField, MenuItem, Button, Typography, Container, CircularProgress } from '@mui/material';

const App = () => {
  const [emailText, setEmailText] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const models = [
    { value: 'NB', label: 'Naive Bayes' },
    { value: 'DT', label: 'Decision Tree' },
    { value: 'LR', label: 'Logistic Regression' },
    { value: 'RF', label: 'Random Forest' },
    { value: 'Adaboost', label: 'AdaBoost' },
    // { value: 'BGc', label: 'Gradient Boosting' },
    // { value: 'ETC', label: 'Extra Trees' },
    // { value: 'GBDT', label: 'Gradient Boosting Decision Tree' },
    { value: 'XGB', label: 'XGBoost' }
  ];

  const handlePredict = async () => {
    if (!emailText || !selectedModel) {
      setError('Please provide both email text and select a classifier.');
      return;
    }

    setLoading(true);
    setPrediction(''); // Clear previous prediction
    setError('');

    try {
      const response = await axios.post('https://email-spam-backend-z4mo.onrender.com/predict', {
        email_text: emailText,
        classifier: selectedModel
      });

      setPrediction(response.data.prediction.toUpperCase());
    } catch (err) {
      console.error(err);
      setError('An error occurred while making the prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="min-w-full h-full bg-gray-100 p-12 pt-8">
      <div className="bg-white p-6 rounded-lg shadow-lg min-w-full flex flex-col space-y-8">
        <Typography variant="h4" component="h1" align="center" className="mb-4 font-bold text-blue-500">
          Email Spam Multi - Classifier
        </Typography>
        <TextField
          label="Email Text"
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          className="mb-4"
        />
        <TextField
          select
          label="Select Model"
          fullWidth
          variant="outlined"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="mb-4"
        >
          <MenuItem value="" disabled>
            Select a Model
          </MenuItem>
          {models.map((model) => (
            <MenuItem key={model.value} value={model.value}>
              {model.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePredict}
          className="bg-blue-500 hover:bg-blue-600 h-12" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Predict'}
        </Button>
        {error && (
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        )}
        {prediction && (
          <Typography variant="h6" align="center" className={`${prediction === "SPAM" ? "text-red-600" : "text-green-600"} ${prediction === "SPAM" ? "bg-red-100" : "bg-green-100"} text-xl py-6 rounded-lg`}>
            Prediction: {prediction}
          </Typography>
        )}
      </div>
    </Container>
  );
};

export default App;
