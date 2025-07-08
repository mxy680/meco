
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { getProject } from "@/lib/db/project";
import ProjectMenuSection from "./project-menu-section";
import NavigationControls from "./navigation-controls";
import ActionsSection from "./actions-section";

export interface Project {
  id: string;
  name: string;
  color: string;
}


export default function DevConsoleNavbar() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const projectId = params?.projectid as string;
        if (projectId) {
          const proj = await getProject(projectId);
          setProject(proj);
        }
      } catch (err) {
        console.error("Failed to fetch project", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [params]);

  if (loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="backdrop-blur-sm border-b border-white/20 shadow-md"
    >
      <div className="flex items-center justify-between px-4 py-2 h-12">
        <ProjectMenuSection project={project} />
        <NavigationControls />
        <ActionsSection />
      </div>
    </motion.div>
  );
}
