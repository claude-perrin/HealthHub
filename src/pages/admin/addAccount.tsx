import React, { useState } from "react";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import { Role } from "@prisma/client";
import { Specializations } from "@prisma/client";
import CustomButton from "@/components/CustomButton";

const AddAccount = () => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [pesel, setPesel] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState("");

    const roles = Object.values(Role);
    const specializations = Object.values(Specializations);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        setSelectedSpecialization("");
    };

    const handleSpecializationChange = (event) => {
        setSelectedSpecialization(event.target.value);
    };

    return (
        <div className="mx-auto max-w-screen-lg my-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Add an account</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={selectedRole}
                        onChange={handleRoleChange}
                        variant="outlined"
                        label="Role"
                        required
                    >
                        {roles.map((role) => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedRole === Role.DOCTOR && (
                    <FormControl fullWidth>
                        <InputLabel>Specialization</InputLabel>
                        <Select
                            value={selectedSpecialization}
                            onChange={handleSpecializationChange}
                            variant="outlined"
                            required
                        >
                            {specializations.map((specialization) => (
                                <MenuItem key={specialization} value={specialization}>
                                    {specialization}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <TextField
                    label="PESEL"
                    variant="outlined"
                    value={pesel}
                    onChange={(e) => setPesel(e.target.value)}
                    required
                />
                <CustomButton buttonText={"Add account"} width="full" />
            </form>
        </div>
    );
};

export default AddAccount;
