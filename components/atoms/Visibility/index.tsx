import { ReactNode, Fragment } from "react";

interface IVisibilityProps {
  state: boolean;
  children: ReactNode;
}

const Visibility: React.FunctionComponent<IVisibilityProps> = ({
  state,
  children,
}) => {
  return <Fragment>{state && children}</Fragment>;
};

export default Visibility;
