import { useForm } from "react-hook-form";
import {
  Input,
  Textarea,
  Box,
  useClipboard,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Heading
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { FormLabel, FormControl, Button } from "@chakra-ui/react";
import { xsdValue, xmlValue, xpath } from "./DemoData";

export default function HookForm() {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  const apiUrl = "/avroconverterbackend";
  const [avroValueSchema, setAvroValueSchema] = useState();
  const [avroValue, setAvroValue] = useState();
  const [avroKeySchema, setAvroKeySchema] = useState();
  const [avroKey, setAvroKey] = useState();

  const [xml, setXml] = useState();
  const [xsd, setXsd] = useState();
  const [namespace, setNamespace] = useState();
  const [xpathRecordKey, setXpathRecordKey] = useState();
  const [convertError, setConvertError] = useState();

  const { onCopy, value, setValueOfClipBoard, hasCopied } = useClipboard(avroValueSchema);
  const clipboardValue = useClipboard(avroValue);
  const clipboardKeySchema = useClipboard(avroKeySchema);
  const clipboardKey = useClipboard(avroKey);

  const { isOpen, onOpen, onClose } = useDisclosure();

  async function onSubmit(values) {
    console.log(values);
    try {
      const res = await axios.post(`${apiUrl}/connect/xsd`, values, {
        validateStatus: () => true
      });
      console.log(res.data);

      if (typeof res.data === "string" && res.data.startsWith("Error")) {
        console.log(res.data);
        setConvertError(res.data);
        onOpen();
        return;
      }

      setAvroKey(res.data.key);
      setAvroKeySchema(res.data.keySchema);
      setAvroValue(res.data.value);
      setAvroValueSchema(res.data.valueSchema);
    } catch (error) {
      console.log(error);
      setConvertError(error);
      onOpen();
      return;
    }

    console.log("no error...");
  }

  const handleClick = (event) => {
    event.preventDefault();

    setValue("xml", xmlValue);
    setValue("xsd", xsdValue);
    setValue("xpathRecordKey", xpath);
  };

  const handleReset = (event) => {
    event.preventDefault();

    reset();
    setConvertError("");
    setXpathRecordKey("");
    setXml("");
    setXsd("");
    setAvroKey("");
    setAvroKeySchema("");
    setAvroValue("");
    setAvroValueSchema("");
  };

  const handleNamespaceChange = (event) => setNamespace(event.target.value);
  const handleXpathChange = (event) => setXpathRecordKey(event.target.value);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error while converting...</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{convertError}</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box>
        <form id="avroForm" onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.name}>
            <FormLabel htmlFor="xsd">XML Schema</FormLabel>
            <Textarea
              id="xsd"
              value={xsd}
              placeholder="paste xsd content here"
              {...register("xsd", {
                required: "This is required",
                minLength: { value: 20, message: "Minimum length should be 4" }
              })}
            />
            {errors.xsd && errors.xsd.message}
            <FormLabel htmlFor="xml">XML</FormLabel>
            <Textarea
              min="12"
              value={xml}
              id="xml"
              placeholder="paste xml with example data according to xsd here"
              {...register("xml", {
                required: "This is required",
                minLength: { value: 4, message: "Minimum length should be 4" }
              })}
            />
            {errors.xml && errors.xml.message}
            <FormLabel htmlFor="namespace">Namespace</FormLabel>
            <Input
              id="namespace"
              defaultValue="de.deepshore.kafka"
              onChange={handleNamespaceChange}
              placeholder="Namespace for your avro"
              {...register("namespace", {
                required: "please define a namespace",
                minLength: { value: 4, message: "Minimum length should be 4" }
              })}
            />
            {errors.namespace && errors.namespace.message}
            <FormLabel htmlFor="xpathRecordKey">
              Optional: Key extraction xpath expression
            </FormLabel>
            <Input
              id="xpathRecordKey"
              defaultValue={xpathRecordKey}
              value={xpathRecordKey}
              onChange={handleXpathChange}
              placeholder="Xpath for your avro key"
              {...register("xpathRecordKey")}
            />
            {errors.xpathRecordKey && errors.xpathRecordKey.message}
          </FormControl>
          <Button
            mt={4}
            colorScheme="green"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
          &nbsp;&nbsp;
          <Button mt={4} colorScheme="green" onClick={handleClick}>
            Insert Demo Values
          </Button>
          &nbsp;&nbsp;
          <Button mt={4} colorScheme="green" onClick={handleReset}>
            Reset
          </Button>
        </form>
        <br />
        <Heading as="h3" size="lg">
          Avro
        </Heading>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>ValueSchema</Tab>
            <Tab>Value</Tab>
            <Tab>KeySchema</Tab>
            <Tab>Key</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Textarea
                placeholder="Your avro value schema will be shown here after pressing submit."
                size="sm"
                isReadOnly
                value={avroValueSchema}
              ></Textarea>
              <Button onClick={onCopy} ml={2}>
                {hasCopied ? "Copied" : "Copy"}
              </Button>
            </TabPanel>
            <TabPanel>
              <Textarea
                placeholder="Your avro value will be shown here after pressing submit."
                size="sm"
                isReadOnly
                value={avroValue}
              ></Textarea>
              <Button onClick={clipboardValue.onCopy} ml={2}>
                {clipboardValue.hasCopied ? "Copied" : "Copy"}
              </Button>
            </TabPanel>
            <TabPanel>
              <Textarea
                placeholder="Your avro key schema will be shown here after pressing submit."
                size="sm"
                isReadOnly
                value={avroKeySchema}
              ></Textarea>
              <Button onClick={clipboardKeySchema.onCopy} ml={2}>
                {clipboardKeySchema.hasCopied ? "Copied" : "Copy"}
              </Button>
            </TabPanel>
            <TabPanel>
              <Textarea
                placeholder="Your avro key will be shown here after pressing submit."
                size="sm"
                isReadOnly
                value={avroKey}
              ></Textarea>
              <Button onClick={clipboardKey.onCopy} ml={2}>
                {clipboardKey.hasCopied ? "Copied" : "Copy"}
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
