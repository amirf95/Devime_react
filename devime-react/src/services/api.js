// services/api.js
import axios from "axios";

export const getTypesBeton = async () => {
  const response = await axios.get("/api/fondation/types-beton/");
  return response.data;
};

export const postEstimationGrosBeton = async (data) => {
  const response = await axios.post("/api/fondation/estimation-gros-beton/", data);
  return response.data;
};
