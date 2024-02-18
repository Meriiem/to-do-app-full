import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user-model";
import jwt from "jsonwebtoken";
import { IUser } from "../types";
import { Types } from "mongoose";

const getUserToken = (_id: string | Types.ObjectId) => {
  const authenticatedUserToken = jwt.sign({ _id }, "express", {
    expiresIn: "7d",
  });
  return authenticatedUserToken;
};
export const createUser = async (request: Request, response: Response) => {
  try {
    const { name, email, password } = request.body;

    const existingUser = await User.findOne({ email });

    if (existingUser !== null) {
      return response.status(409).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return response.status(201).send({ message: "User created successfully" });
  } catch (e) {
    console.log("Error in createUser", e);
    throw e;
  }
};

export const loginUser = async (request: Request, response: Response) => {
  try {
    const { email, password }: IUser = request.body;
    const existingUser = await User.findOne({ email }); // Add await here
    if (!existingUser) {
      return response.status(409).send({ message: "User does not exist" });
    }

    const isPasswordIdentical = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordIdentical) {
      const token = getUserToken(existingUser._id);
      return response.send({
        token,
        user: {
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    } else {
      return response.status(400).send({ message: "Wrong credentials" });
    }
  } catch (err) {
    console.log("Error in loginUser", err);
    throw err;
  }
};
