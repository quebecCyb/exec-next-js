import { getDictionary } from "@/app/dictionaries";
import ProjectPageView from "./page-view";

interface DashboardProps {
  params: {
    lang: any;
  };
}

const ProjectPage = async ({ params }: Promise<DashboardProps>) => {
  const {lang} = await params;
  const trans = await getDictionary(lang);
  return <ProjectPageView trans={trans} />;
};

export default ProjectPage;
