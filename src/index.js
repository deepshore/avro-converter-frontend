// author: Abhishek Kumar Singh - https://abheist.com/

import React from "react";
import ReactDOM from "react-dom";
import HookForm from "./HookForm";
import { ChakraProvider, CSSReset, Box, Heading } from "@chakra-ui/react";
import "./style.css";

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <Box p={4}>
        <Heading>XSD 2 Avro Converter</Heading>
        <br />
        <HookForm />
      </Box>
    </ChakraProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
