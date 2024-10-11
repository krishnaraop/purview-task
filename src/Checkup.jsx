import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const Checkup = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    questions: [
      {
        section: "Training and Policy",
        items: [
          { question: "Has the member of staff completed training on the safe handling of medicines?", answer: null },
          { question: "Has the member of staff read the medication policy and signed to indicate that they have done so?", answer: null },
          { question: "Does the member of staff know how to access the medication policy if they wish to check any information?", answer: null },
        ]
      },
      {
        section: "Administration of Medicines",
        subsection: "Preparation and hygiene",
        items: [
          { question: "Did the member of staff wash their hands before starting to administer any medication and follow appropriate hygiene measures throughout the medication round? E.g. wear gloves when applying creams.", answer: null },
          { question: "Did the member of staff make sure that everything was properly prepared before starting the medication round, e.g. was there plenty of medication cups, jug of water, beakers etc.", answer: null },
        ]
      }
    ],
    signatures: {
      first: null,
      second: null
    }
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHistorical, setShowHistorical] = useState(false);
  const [historicalAssessments, setHistoricalAssessments] = useState([]);

  const handleAnswerChange = (sectionIndex, itemIndex, value) => {
    const newFormData = { ...formData };
    newFormData.questions[sectionIndex].items[itemIndex].answer = value;
    setFormData(newFormData);
  };

  const handleSignature = (user, name, date) => {
    const newFormData = { ...formData };
    newFormData.signatures[user] = { name, date };
    setFormData(newFormData);
    if (user === 'second') {
      setIsSubmitted(true);
      setHistoricalAssessments([...historicalAssessments, { ...newFormData, date: new Date().toISOString() }]);
    }
  };

  const handleSubmit = () => {
    if (currentUser === 'first') {
      setCurrentUser('second');
    } else {
      setIsSubmitted(true);
    }
  };

  const renderQuestions = () => (
    formData.questions.map((section, sectionIndex) => (
      <Box key={sectionIndex} mb={4}>
        <Typography variant="h6" gutterBottom>
          {section.section}
        </Typography>
        {section.subsection && (
          <Typography variant="subtitle1" gutterBottom>
            {section.subsection}
          </Typography>
        )}
        {section.items.map((item, itemIndex) => (
          <Box key={itemIndex} mb={2}>
            <Typography variant="body1" gutterBottom>
              {item.question}
            </Typography>
            <RadioGroup
              row
              value={item.answer}
              onChange={(e) => handleAnswerChange(sectionIndex, itemIndex, e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </Box>
        ))}
      </Box>
    ))
  );

  const renderSignatureSection = (user) => (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        {user === 'first' ? 'First Signature' : 'Second Signature'}
      </Typography>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <TextField
          label="Name"
          variant="outlined"
          value={formData.signatures[user]?.name || ''}
          onChange={(e) => handleSignature(user, e.target.value, formData.signatures[user]?.date || '')}
          disabled={isSubmitted || (user === 'first' && currentUser === 'second')}
          sx={{ width: '48%' }}
        />
        <TextField
          label="Date"
          variant="outlined"
          value={formData.signatures[user]?.date || ''}
          onChange={(e) => handleSignature(user, formData.signatures[user]?.name || '', e.target.value)}
          disabled={isSubmitted || (user === 'first' && currentUser === 'second')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CalendarTodayIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: '48%' }}
        />
      </Box>
    </Box>
  );

  const renderHistoricalAssessments = () => (
    <Dialog open={showHistorical} onClose={() => setShowHistorical(false)} maxWidth="md" fullWidth>
      <DialogTitle>Historical Assessments</DialogTitle>
      <DialogContent>
        <List>
          {historicalAssessments.map((assessment, index) => (
            <ListItem key={index} button onClick={() => {}}>
              <ListItemText 
                primary={`Assessment ${index + 1}`} 
                secondary={`Date: ${new Date(assessment.date).toLocaleDateString()}`} 
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowHistorical(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Card sx={{  margin: 'auto', mt: 4 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="div">
            Competency Assessment
          </Typography>
          {!currentUser && (
            <Button variant="contained" color="primary" onClick={() => setCurrentUser('first')}>
              Start Assessment
            </Button>
          )}
        </Box>
        
        {currentUser && (
          <>
            {renderQuestions()}
            {renderSignatureSection('first')}
            {currentUser === 'second' && renderSignatureSection('second')}
            
            <Box display="flex" justifyContent="space-between" mt={4}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit}
                disabled={isSubmitted}
              >
                {currentUser === 'first' ? 'Submit First Signature' : 'Complete Assessment'}
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => setShowHistorical(true)}
              >
                Historical Assessments
              </Button>
            </Box>
          </>
        )}
      </CardContent>
      {renderHistoricalAssessments()}
    </Card>
  );
};

export default Checkup;