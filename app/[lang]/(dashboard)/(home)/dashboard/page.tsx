import DashboardPageView from "./page-view";
import { getDictionary } from "@/app/dictionaries";

interface DashboardProps {
  params: {
    lang: any;
  };
}
const Dashboard = async ({ params }: Promise<DashboardProps>) => {
  const {lang} = await params;
  const trans = await getDictionary(lang);
  return <DashboardPageView trans={trans} />;
};

export default Dashboard;
