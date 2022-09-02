import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "../types";
export const withGlobalProps = (Component: any) => {
  function ComponentWithRouterProp(props: any) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: StateType) => state.user);
    const album = useSelector((state: StateType) => state.album);
    const albumPhotos = useSelector((state: StateType) => state.albumPhotos);
    const openHiddenPhotos = useSelector(
      (state: StateType) => state.openHiddenPhotos
    );

    const params = useParams();
    return (
      <Component
        {...props}
        globalProps={{
          location,
          navigate,
          params,
          user,
          dispatch,
          album,
          albumPhotos,
          openHiddenPhotos,
        }}
      />
    );
  }
  return ComponentWithRouterProp;
};
