import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/apiAuth/[...nextauth]";
import { Role } from "@prisma/client";

interface JSONClause {
    [key: string]: any;
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions); //authenticate user on the server side

    let accessGranted = false;

    if (!session)
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized because not logged in" });

    if (req.method === "GET") {
        try {
            const { doctor } = req.query;
            let results: string | any[];
            if (doctor) { // user is admin or reciptionist 
                if (session.user?.role == Role.RECEPTIONIST || session.user?.role == Role.ADMIN) {
                    accessGranted = true;
                    results = await prisma.physicalExamination.findMany({
                        where: {
                            visit: { doctorId: doctor.toString() }
                        },
                    });
                }
                else {
                    accessGranted = false;
                    // return res
                    //     .status(401)
                    //     .json({ success: false, message: "You can see this patient's data" });
                }
            }
            else { //no params passed, logged in user should be the patient
                if (session.user?.role == Role.DOCTOR) {
                    results = await prisma.physicalExamination.findMany({
                        where: {
                            visit: { doctorId: session.user?.id }
                        },
                    });
                }
                return res.status(200).json({ success: true, data: results });
            }

        } catch (error) {
            //here should be a redirect to a general purpose error page
            return res
                .status(500)
                .json({ success: false, message: "ERROR : Failed to retrieve data" });
        }
        if (!accessGranted) {
            return res
                .status(401)
                .json({ success: false, message: "You are not authorized to perform this action" });
        }
    }


    //doctor creating a a new examination 
    else if (req.method == "POST") {
        if (session.user?.role == Role.DOCTOR) {
            accessGranted = true
            try {
                const { dictionaryCode, visitId } = req.body;
                const result = await prisma.physicalExamination.create({
                    data: {
                        visit: { connect: { visitId: visitId } },
                        examinationDictionary: { connect: { code: dictionaryCode } },
                    },
                });
                return res.status(200).json({ success: true, data: result });
            } catch (error) {
                return res
                    .status(500)
                    .json({ success: false, message: "ERROR : Failed to create test" });
            }
        }
        else {
            return res
                .status(401)
                .json({ success: false, message: "You are not authorized to perform this action" });
        }
    }
    else {
        return res
            .status(400)
            .json({ success: false, message: "Invalid request method" });
    }
}
