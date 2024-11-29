"use client";
import OverdueTask from "./overdue-task";
import ProjectBudget from "./project-budget";
import ProjectDeadline from "./project-deadline";
import ProjectProgress from "./project-progress";
import ReportChart from "./report-chart";
import TopContributer from "./top-contributer";
import UpcomingDeadline from "./upcoming-deadlines";
import WorkloadChart from "./workload";
import WorksNote from "./works-note";
import SwotList from "@/components/analysis/swot-list";

const Overview = async ({ params }: { params: Promise<{ id: string }> }) => {

  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <UpcomingDeadline />
        </div>
      </div>

      <SwotList projectId={id} />
    </div>
  );
};

export default Overview;
