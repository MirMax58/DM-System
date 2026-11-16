import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { apolloClient } from './lib/apollo.js'
import { AuthProvider } from './auth/AuthContext.jsx'

const Router = window.dmSystemDesktop ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)
