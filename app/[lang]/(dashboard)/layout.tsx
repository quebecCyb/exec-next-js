import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { authOptions } from "@/lib/auth";
import { getServerSession, NextAuthOptions } from "next-auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/app/dictionaries";
import {getSession} from "next-auth/react";

const layout = async ({ children, params }: Promise<{ children: React.ReactNode; params: { lang: any } }>) => {
  const { lang } = await params;

  const session = await getServerSession(authOptions as NextAuthOptions as any);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const trans = await getDictionary(lang);

  return (
    <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>
  );
};

export default layout;
