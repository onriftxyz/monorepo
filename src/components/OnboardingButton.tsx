import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export const OnboardingButton = () => {
  return (
    <DynamicWidget
      variant="modal"
      innerButtonComponent={<span>Write &rarr;</span>}
    />
  );
};
