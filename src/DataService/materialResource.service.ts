import { IMaterialResource } from "../models/materialResource.model";
import axios from "../api/axios";

export async function fetchMaterialResources() {
  let raw = await axios.get(`/material-resources`);
  let data = raw.data;
  return data as IMaterialResource[];
}

export async function createMaterialResources(material: any) {
  let raw = await axios.post(`/material-resources`, material);
  let data = raw.data;
  return data as IMaterialResource;
}

export async function updateMaterialResources(id: string, material: any) {
  let raw = await axios.put(`/material-resources/${id}`, material);
  let data = raw.data;
  return data as IMaterialResource;
}

export async function deleteMaterialResources(id: string) {
  let raw = await axios.delete(`/material-resources/${id}`);
  let data = raw.data;
  return data as IMaterialResource;
}
