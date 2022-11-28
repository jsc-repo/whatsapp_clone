import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("username required")
        .min(6, "username too short")
        .max(28, "username too long"),
      password: Yup.string()
        .required("password required")
        .min(6, "password too short")
        .max(28, "password too long"),
    }),
    onSubmit: (values, actions) => {
      const vals = { ...values }; //saves the values so we can reset form right away
      actions.resetForm();
      fetch("http://localhost:4000/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          //   "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(vals),
      })
        .catch((err) => {
          return;
        })
        .then((res) => {
          if (!res || !res.ok || res.status >= 400) {
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (!data) {
            return;
          }
          console.log(data);
        });
    },
  });

  return (
    <VStack
      as="form"
      m="auto"
      justify="center"
      h="100vh"
      w={{ base: "90%", md: "500px" }}
      spacing={1}
      onSubmit={formik.handleSubmit}
    >
      <Heading>Register </Heading>
      <FormControl
        isInvalid={formik.errors.username && formik.touched.username}
      >
        <FormLabel fontSize="lg">Username</FormLabel>
        <Input
          name="username"
          placeholder="enter username"
          autoComplete="off"
          size="lg"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={formik.errors.password && formik.touched.password}
      >
        <FormLabel fontSize="lg">Password</FormLabel>
        <Input
          name="password"
          type="password"
          placeholder="enter username"
          autoComplete="off"
          size="lg"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
      </FormControl>

      <ButtonGroup pt="1rem">
        <Button colorScheme="teal" type="submit">
          Create Account
        </Button>
        <Button onClick={() => navigate("/")} leftIcon={<ArrowBackIcon />}>
          Back
        </Button>
      </ButtonGroup>
    </VStack>
  );
};

export default SignUp;
