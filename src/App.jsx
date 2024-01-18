import './App.css';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import { Button } from '@chakra-ui/react';

const App = () => {
  return (
    <>
      <p>Hello World</p>
      <CatalogPage />
      <Button colorScheme="blue">Button</Button>
    </>
  );
};

export default App;
