import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './utils/Context';
import MainScreen from './Screens/MainScreen';

export default function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}
