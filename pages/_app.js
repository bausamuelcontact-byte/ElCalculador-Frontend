import '../styles/globals.css';
import Head from 'next/head';
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import user from '../reducers/user';
import categories from '../reducers/categories';

const store = configureStore({
 reducer: { user , categories },
});


function App({ Component, pageProps }) {

  return (
    <Provider store={store}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poiret+One&display=swap"
          rel="stylesheet"
        />
       
        <title>El Calculador</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
