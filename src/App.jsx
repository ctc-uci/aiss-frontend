import './App.css';
import { ChakraProvider, Text } from '@chakra-ui/react'
import EmailSending from './components/EmailTemplates/EmailSending';

const App = () => {
  return (
    <ChakraProvider>
      <Text>Hello World</Text>
      <EmailSending />
    </ChakraProvider>
  );
};

export default App;
