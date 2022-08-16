import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "../types";
export const withGlobalProps = (Component: any) => {
  function ComponentWithRouterProp(props: any) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: StateType) => state.user);
    const params = useParams();
    return (
      <Component
        {...props}
        globalProps={{ location, navigate, params, user, dispatch }}
      />
    );
  }
  return ComponentWithRouterProp;
};
