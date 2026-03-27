import { ReactNode, Fragment } from "react";

interface VisibilityProps {
  state: boolean;
  children: ReactNode;
}

const Visibility: React.FunctionComponent<VisibilityProps> = ({
  state,
  children,
}) => {
  return <Fragment>{state && children}</Fragment>;
};

export default Visibility;
