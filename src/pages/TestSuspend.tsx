const TestSuspend = () => {
  throw new Promise((res) => setTimeout(res, 3000)); // forces 3 sec suspense
};

export default TestSuspend;
