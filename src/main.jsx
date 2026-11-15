import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter,Navigate,Route,Routes} from 'react-router-dom';
import {DemoProvider} from './context/DemoContext';
import {Toast} from './components/UI';
import Auth from './pages/Auth';
import {StudentDashboard,EvaluationList,EvaluationWizard,EvaluationResponse,UnpublishedModule} from './pages/Student';
import {StaffDashboard,SurveyManager,ResultsOverview,ResultDetails} from './pages/Staff';
import './styles/main.css';

function App(){return <><Routes>
  <Route path="/" element={<Navigate to="/login/student" replace/>}/>
  <Route path="/login" element={<Navigate to="/login/student" replace/>}/>
  <Route path="/login/:role" element={<Auth/>}/>
  <Route path="/recover/:role" element={<Auth recovery/>}/>
  <Route path="/student/dashboard" element={<StudentDashboard/>}/>
  <Route path="/student/teachers" element={<EvaluationList type="teacher"/>}/>
  <Route path="/student/facilities" element={<EvaluationList type="facility"/>}/>
  <Route path="/student/module/:module" element={<UnpublishedModule/>}/>
  <Route path="/student/evaluation/:type/:id/:step" element={<EvaluationWizard/>}/>
  <Route path="/student/response/:type/:id" element={<EvaluationResponse/>}/>
  <Route path="/staff/dashboard" element={<StaffDashboard/>}/>
  <Route path="/staff/surveys" element={<SurveyManager/>}/>
  <Route path="/staff/results" element={<ResultsOverview/>}/>
  <Route path="/staff/results/:id" element={<ResultDetails/>}/>
  <Route path="*" element={<Navigate to="/login/student" replace/>}/>
</Routes><Toast/></>}

createRoot(document.getElementById('root')).render(<React.StrictMode><HashRouter><DemoProvider><App/></DemoProvider></HashRouter></React.StrictMode>);
