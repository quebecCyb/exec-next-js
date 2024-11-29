import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/api/user/data";

import avatar3 from "@/public/images/avatar/avatar-3.jpg";
import connectDB from "@/lib/mongodb";

export async function POST(request: NextRequest, response: any) {
  try {
    await connectDB();

    let reqBody = await request.json();

    const foundUser = await User.findOne({
      email: reqBody.email
    }).exec();

    if (foundUser) {
      return NextResponse.json({
        status: "fail",
        message: "User already exists" + JSON.stringify(foundUser),
      });
    }

    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    reqBody.image = avatar3;

    const user = new User({
      ...reqBody,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    return NextResponse.json({
      status: "success",
      message: "User created successfully",
      data: reqBody,
    });
  } catch (e) {
    console.log("An error occurred:", e);
    return NextResponse.json({
      status: "fail",
      message: "Something went wrong",
      data: e,
    });
  }
}
