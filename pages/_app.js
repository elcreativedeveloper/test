import { AuthProvider } from '@/contexts/AuthContext';
import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
  return (
    // <AuthProvider>
    //   <Component {...pageProps} />
    // </AuthProvider>

    <Component {...pageProps} />
  )
};

export default App;