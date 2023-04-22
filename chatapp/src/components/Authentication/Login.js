import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  Button,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { config } from "./Signup";
import axios from "axios";

const Login = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("please enter a valid email")
        .required("Required"),
      password: Yup.string()
        .min(8, "must be at least 8 characters")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      console.log(values);
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/user/login",
          { values },
          config
        );
        setLoading(false);
        toast({
          title: "login Successfull",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/chat");
      } catch (error) {
        toast({
          title: "Error occured",
          description: error.response.data.message,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
      setLoading(false);
    },
  });
  return (
    <VStack spacing="7px">
      <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
        <FormControl
          isInvalid={formik.errors.email && formik.touched.email}
          isRequired
        >
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            placeholder="Enter your email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={formik.errors.password && formik.touched.password}
          isRequired
        >
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              name="password"
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <InputRightElement width="5.5rem">
              <Button
                hight="1.75rem"
                padding="10px"
                width={20}
                size="sm"
                onClick={() => setShow((prevState) => !prevState)}
              >
                {show ? "hide" : "show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
        </FormControl>

        <Button width="100%" type="submit" marginTop={5} isLoading={loading}>
         Login
        </Button>
      </form>
    </VStack>
  );
};

export default Login;
