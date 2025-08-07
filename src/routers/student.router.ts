import Elysia, { t } from "elysia";
import { jwtPlugin } from "../plugin/JwtPlugin";
import { studentService } from "../db/services/student.service";

type StudentContext = {
    body: {
        idNumber?: string;
        name?: string;
    }
};

export const student = new Elysia({ prefix: "/student" })
    .use(jwtPlugin)
    .model({
        student: t.Object({
            idNumber: t.String({ description: "The student's ID number" }),
            name: t.String({ description: "The student's name" }),
        }),
    })
    .guard({
        body: "student",
    })
    .post(
        "/admin/add",
        async ({ body }: StudentContext) => {
            if (!body.idNumber || !body.name) {
                return { error: "ID number and name are required." };
            }

            const existingStudent = await studentService.findStudentById(body.idNumber);
            if (existingStudent) {
                return { error: "Student with this ID already exists." };
            }

            const newStudent = await studentService.addStudent({
                id: body.idNumber,
                name: body.name,
            });

            return { message: "Student added successfully", student: newStudent };
        },
        {
            tags: ["Student"],
            detail: {
                description: "Adds a new student to the database.",
                responses: {
                    "200": {
                        description: "Successfully added the student.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: {
                                            type: "string",
                                            description: "Success message",
                                        },
                                        student: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "string",
                                                    description: "The student's ID number",
                                                },
                                                name: {
                                                    type: "string",
                                                    description: "The student's name",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Bad request if ID number or name is missing.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        error: {
                                            type: "string",
                                            description: "Error message",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    )
