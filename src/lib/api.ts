import { Role } from "@prisma/client";

export async function getVisits(role: Role, id: String) {
  console.log("user params in lib:");
  console.log(id);
  console.log(role);
  const path = "/api/visits";
  const result = await fetch(`${path}?id=${id}&role=${role}`, {
    method: "GET",
  });
  return result;
}

export async function addVisit() {
  const path = "/api/visits";
  const result = await fetch(`${path}`, {
    method: "POST",
  });
  return result;
}

//cancel visit
export async function deleteVisit(
  visit_id: String,
  user_id: String,
  role: Role
) {
  const path = "/api/visits";
  const result = await fetch(`${path}?visit_id=${visit_id}`, {
    method: "DELETE",
  });
  return result;
}

//change visit date
export async function updateVisit() {
  const path = "/api/visits";
  const result = await fetch(`${path}`, {
    method: "PUT",
  });
  return result;
}

export async function addTests(params: type) {}

export async function getTests(params: type) {}

export async function getPatients(params: type) {}

export async function getDoctors(params: type) {}

export async function getReceptionists(params: type) {}

export async function getDiagnosis(params: type) {}

export async function getDescription(params: type) {}

export async function getDate(params: type) {}
