import { Request, Response } from "express";
import Category from "../models/category-model";
import { ICategory } from "../types";
import { AuthRequest } from "../middleware";
import { request } from "http";

export const getAllCategories = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { user } = request;
    const categories = await Category.find({
      user: user,
    });
    return response.send(categories);
  } catch (error) {
    console.log("Error getting all categories", error);
    response.send({ err: "something went wrong" });
    throw error;
  }
};

export const createCategory = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { color, icon, isEditable, name }: ICategory = request.body;
    const { user } = request;

    const category = await Category.create({
      color,
      icon,
      isEditable,
      name,
      user,
    });

    response.send(category);
  } catch (err) {
    console.error("Error creating category", err);
    response.send({ err: "something went wrong" });
    throw err;
  }
};

export const deleteCategory = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { id } = request.params;

    await Category.deleteMany({ _id: id });

    response.send({ message: "category deleted" });
  } catch (err) {
    console.error("Error in delete category", err);
    response.send({ err: "something went wrong" });
    throw err;
  }
};

export const updateCategory = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { _id, color, icon, isEditable, name }: ICategory = request.body;
    await Category.updateOne(
      {
        _id,
      },
      {
        $set: {
          name,
          color,
          icon,
          isEditable,
        },
      }
    );
    response.send({ message: "Category updated successfully" });
  } catch (err) {
    console.log("error in update category", err);
    response.send({ err: "Error in updating the category" });
    throw err;
  }
};
