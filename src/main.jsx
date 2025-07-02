import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './routes/Routes.jsx'
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 
import { ThemeProvider } from './contexts/ThemeContext'; 
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}> 
      <ThemeProvider> 
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} /> 
    </QueryClientProvider>
  </StrictMode>,
)
