import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { QueryClient, QueryClientProvider } from 'react-query';
import App from './app/App';
import 'react-dropzone-uploader/dist/styles.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const client = new QueryClient()

root.render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <App2 />
    </QueryClientProvider>
  </StrictMode>
);
