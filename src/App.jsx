import './App.css';
import { ChakraProvider, Text } from '@chakra-ui/react'

const App = () => {
  return (
    <ChakraProvider>
      <Text>Hello World</Text>
    </ChakraProvider>
  );
};

export default App;
