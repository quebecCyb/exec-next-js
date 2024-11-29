import { NextResponse, NextRequest } from "next/server";
import Project from "./data";
import connectDB from "@/lib/mongodb";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import User from "@/app/api/user/data";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    // Extract email from the URL query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email"); // Get 'email' parameter

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Подключение к базе данных
    await connectDB();

    // Поиск пользователя по email
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Поиск проектов пользователя
    const projects = await Project.find({ user: user._id }).exec();

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, response: NextResponse) {
  const newItem = await request.json();
  await connectDB();

  const user = await User.findOne({ email: newItem.email }).exec();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  console.log(newItem)
  const project = new Project({
    ...newItem,
    name: newItem.title,
    user: user._id
  });

  const savedProject = await project.save();

  return NextResponse.json(newItem, { status: 201 });
}
