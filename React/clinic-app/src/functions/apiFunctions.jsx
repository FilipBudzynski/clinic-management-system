import api from "../api";
import { CURRENT_USER } from "../apiurls";

const fetchUserData = async (accessToken) => {
  await api
    .get(CURRENT_USER, {
      headers: { Authorization: accessToken },
    })
    .then((response) => {
      sessionStorage.setItem("userGroup", response.data.groupe);
      sessionStorage.setItem("isActive", response.data.is_active);
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export default fetchUserData;
