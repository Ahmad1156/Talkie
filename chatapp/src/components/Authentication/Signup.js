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
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";


export const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
const Signup = () => {
  const [show, setShow] = useState(false);
  const [image, setImage] = useState({ name: "", url: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      Name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      Name: Yup.string()
        .min(3, "must be at least 3 characters")
        .required("Required"),
      email: Yup.string()
        .email("please enter a valid email")
        .required("Required"),
      password: Yup.string()
        .min(8, "must be at least 8 characters")
        .required("Required"),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Passwords must match"
      ),
      pic: null,
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/user",
          { ...values, image },
          config
        );
        setLoading(false);
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/chats");
      } catch (error) {
        toast({
          title: "Error Occured",
          description: error.response.data.message,
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      }
    },
  });
  const handleImageChange = (file) => {
    if (file === undefined) {
      toast({
        title: "Warning",
        description: "Please select an image!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    const reader = (readFile) =>
      new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.readAsDataURL(readFile);
      });
    reader(file).then((result) => setImage({ name: file?.name, url: result }));
  };
  return (
    <VStack spacing="7px">
      <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
        <FormControl
          isInvalid={formik.errors.Name && formik.touched.Name}
          isRequired
        >
          <FormLabel>Name</FormLabel>
          <Input
            name="Name"
            placeholder="Enter your fullName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.Name}
          />
          <FormErrorMessage>{formik.errors.Name}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={formik.errors.email && formik.touched.email}
          isRequired
        >
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            placeholder="Enter your E-mail"
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
        <FormControl
          isInvalid={
            formik.errors.confirmPassword && formik.touched.confirmPassword
          }
          isRequired
        >
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              name="confirmPassword"
              type={show ? "text" : "password"}
              placeholder="confirm your password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
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
          <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Upload your picture</FormLabel>
          <Input
            name="pic"
            type="file"
            p={1.5}
            accept="image/*"
            placeholder="upload your Image"
            onChange={(e) => handleImageChange(e.currentTarget.files[0])}
          />
        </FormControl>
        <Button type="submit" width="100%" marginTop={10} isLoading={loading}>
          Submit
        </Button>
      </form>
    </VStack>
  );
};

export default Signup;
