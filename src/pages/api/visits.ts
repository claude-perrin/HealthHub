import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { Role, Status } from "@prisma/client";

//here we handle all visits-related api calls
//ToDo : update method to change and/or cancel
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions); //authenticate user on the server side
  //   console.log(session);
  if (session) {
    if (req.method === "POST") {
      //Patient or Registrar creating a visit
      try {
        const { patient_id, description, doctor_id, date } = req.body;
        let receptionistId;
        console.log("=============================");
        console.log("pat_id: ", patient_id);
        console.log("doc_id: ", doctor_id);

        if (session.user?.role === Role.RECEPTIONIST) {
          receptionistId = session.user.id;
        }
        const results = await prisma.visit.create({
          data: {
            description: description,
            date: date,
            doctor: { connect: { employee_id: doctor_id } },
            patient: { connect: { patient_id: patient_id } },
            // receptionist: { connect: { employee_id: receptionistId } },
          },
        });
        return res.status(201).json({
          success: true,
          message: "Visit created successfully",
          data: results,
        });
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to create visit" });
      }
    }

    //if method is PUT, check if the user is a doctor, patient or receptionist, and then delete the visit
    //changing date needs to be accomodated
    if (req.method === "PUT") {
      const { visit_id, role, user_id } = req.body;
      if (
        role === Role.DOCTOR ||
        role === Role.PATIENT ||
        role === Role.RECEPTIONIST
      ) {
        //if it was a doctor or patient, check that the visit belongs to them
        try {
          const visit = await prisma.visit.findUnique({
            where: {
              visit_id: Number(visit_id),
            },
          });
          if (
            role !== Role.RECEPTIONIST &&
            visit?.patient_id !== user_id &&
            visit?.doctor_id !== user_id
          ) {
            return res
              .status(401)
              .json({ success: false, message: "Unauthorized" });
          } else {
            try {
              await prisma.visit.update({
                where: {
                  visit_id: Number(visit_id),
                },
                data: {
                  status: Status.CANCELLED,
                },
              });
            } catch (error) {
              return res
                .status(404)
                .json({ success: false, message: "cancelling visit failed" });
            }
            return res
              .status(200)
              .json({ success: true, message: "Visit cancelled" });
          }
        } catch (error) {
          return res
            .status(500)
            .json({ success: false, message: "Failed to find such a visit" });
        }
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
    }

    // Patient, Doctor or Registrar viewing visits
    else if (req.method === "GET") {
      try {
        const { role, id } = req.query;
        let results: string | any[];
        if (role == Role.DOCTOR) {
          results = await prisma.visit.findMany({
            where: {
              doctor_id: Number(id),
            },
            include: {
              patient: {
                include: {
                  user: {
                    select: {
                      fname: true,
                      lname: true,
                    },
                  },
                },
              },
            },
          });
        } else if (role == Role.PATIENT) {
          results = await prisma.visit.findMany({
            where: {
              patient_id: Number(id),
            },
            include: {
              doctor: {
                include: {
                  user: {
                    select: {
                      fname: true,
                      lname: true,
                    },
                  },
                },
              },
            },
          });
        } else if (role == Role.RECEPTIONIST) {
          results = await prisma.visit.findMany({
            where: {
              date: {
                gte: new Date(),
              },
            },
          });
        }

        //I dont think this check is needed (here), the caller checks the response size and renders response or place holder
        if (results.length !== 0) {
          return res.status(207).json(results);
        } else {
          return res.status(400).json({ message: "No visits found" });
        }
      } catch (error) {
        //here should be a redirect to a general purpose error page
        return res
          .status(500)
          .json({ success: false, message: "Failed to retrieve visits" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request method" });
    }
  }
  return res.status(401).json({ success: false, message: "Unauthorized" });
}