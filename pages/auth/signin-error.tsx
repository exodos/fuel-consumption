const errors = {
  Signin: "Try signing with a different account.",
  Callback: "Try signing with a different account.",
  CredentialsSignin: "Wrong credentials. Try again",
  default: "Unable to sign in.",
};

const SignInError = ({ error }) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return <div>{errorMessage}</div>;
};

export default SignInError;
