"use client";
import React, { useState, useEffect, useTransition } from "react";
import { toast } from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm, Controller } from "react-hook-form";
import Select, { components } from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, formatDate } from "@/lib/utils";
import { addProjectAction, editProjectAction } from "@/action/project-action";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { faker } from "@faker-js/faker";
const assignOption = [
  {
    value: "mahedi",
    label: "Mahedi Amin",
    image: faker.image.avatarLegacy(),
  },
  {
    value: "sovo",
    label: "Sovo Haldar",
    image: faker.image.avatarLegacy(),
  },
  {
    value: "rakibul",
    label: "Rakibul Islam",
    image: faker.image.avatarLegacy(),
  },
  {
    value: "pritom",
    label: "Pritom Miha",
    image: faker.image.avatarLegacy(),
  },
];
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
import Project from "@/app/api/projects/data";

const OptionComponent = ({ data, ...props }: any) => {
  //const Icon = data.icon;

  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 ring-1 ring-border   ring-offset-background">
          <AvatarImage src={data.image} />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium text-default-900">{data.label}</div>
      </div>
    </components.Option>
  );
};
const schema = z.object({
  title: z.string().min(2, { message: "Your email is invalid." }),
  description: z.string().optional(),
  subtitle: z.string().optional(),
});

const ProjectsSheet = ({ open, project, onClose, selectedId }: {
  open: boolean;
  project: Project;
  onClose: () => void;
  selectedId: string;
}) => {
  // form state
  const [priority, setPriority] = React.useState<string | undefined>(undefined);
  const [assign, setAssign] = React.useState<any | []>([]);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const ResetForm = async () => {
    reset();
  };

  const onSubmit = (data: any) => {
    data.priority = priority;
    data.assign = assign;
    data.assignDate = formatDate(startDate);
    data.dueDate = formatDate(endDate);
    const updatedProject = {
      ...project,
      title: data.title,
      assign: data.assign,
      assignDate: data.assignDate,
      dueDate: data.dueDate,
      description: data.description,
    };

    if (project) {
      startTransition(() => {
        editProjectAction(selectedId, updatedProject).then(() => toast.success("Successfully Update"));
      });
    } else {
      startTransition(() => {
        addProjectAction(data).then(() => toast.success("Successfully Added"));
      });
    }

    onClose();
    reset();
  };

  useEffect(() => {
    setValue("title", project?.title || "");
    setValue("description", project?.description || "");
    setValue("assign", project?.assign || []);
    setValue("priority", project?.priority || "");
    const parsedAssignDate = project?.assignDate
      ? new Date(project.assignDate)
      : null;
    const parsedDueDate = project?.dueDate ? new Date(project.dueDate) : null;
    // Set state for startDate and endDate
    setStartDate(parsedAssignDate ?? new Date());
    setEndDate(parsedDueDate ?? new Date());
  }, [open]);

  return (
    <>
      <Sheet open={open}>
        <SheetContent
          onClose={() => {
            ResetForm();
            onClose();
          }}
          className="px-6"
        >
          <SheetHeader className="px-0">
            <SheetTitle>
              {project ? "Edit " : "Create a new"} Project
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-40px)]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4  mt-6">
                <div>
                  <Label htmlFor="projectName" className="mb-1.5">
                    Project Name
                  </Label>
                  <Input
                    type="text"
                    {...register("title")}
                    placeholder="Project Name"
                    className={cn("", {
                      "border-destructive focus:border-destructive":
                        errors.title,
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="mb-1.5">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Project Description"
                    {...register("description")}
                  />
                </div>
              </div>

              <div className="mt-12 flex gap-6">
                <Button
                  color="warning"
                  variant="soft"
                  className="flex-1"
                  onClick={() => {
                    onClose()
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isPending} className="flex-1">
                  {project ? "Update" : "  Create  "} Project
                </Button>
              </div>
            </form>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProjectsSheet;
