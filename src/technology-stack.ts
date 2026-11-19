export type TechnologyCategory = "Frontend" | "Data" | "Graphics" | "Automation";

export interface Technology {
  name: string;
  category: TechnologyCategory;
  description: string;
  stage: "Exploring" | "Learning" | "Building";
  tags: string[];
}

export const technologies: Technology[] = [
  { name: "HTML", category: "Frontend", description: "Semantic structure for accessible web experiences.", stage: "Building", tags: ["Web", "Markup"] },
  { name: "CSS", category: "Frontend", description: "Responsive layouts, visual systems, and interface styling.", stage: "Building", tags: ["Web", "Design"] },
  { name: "JavaScript", category: "Frontend", description: "Interactive browser experiences and application logic.", stage: "Building", tags: ["Web", "Programming"] },
  { name: "TypeScript", category: "Frontend", description: "Typed JavaScript for safer, more maintainable applications.", stage: "Learning", tags: ["Types", "Tooling"] },
  { name: "React", category: "Frontend", description: "Reusable component-driven user interfaces.", stage: "Exploring", tags: ["Components", "UI"] },
  { name: "Tailwind CSS", category: "Frontend", description: "Utility-first styling for consistent design systems.", stage: "Exploring", tags: ["CSS", "Design"] },
  { name: "Next.js", category: "Frontend", description: "React application architecture and full-stack web patterns.", stage: "Exploring", tags: ["React", "Framework"] },
  { name: "SQL", category: "Data", description: "Structured queries and relational database concepts.", stage: "Learning", tags: ["Database", "Queries"] },
  { name: "Supabase", category: "Data", description: "Managed database, authentication, and application services.", stage: "Building", tags: ["Backend", "Database"] },
  { name: "Python", category: "Data", description: "General-purpose programming, scripting, and data workflows.", stage: "Exploring", tags: ["Programming", "Automation"] },
  { name: "GLSL", category: "Graphics", description: "Shader programming for real-time visual effects.", stage: "Exploring", tags: ["Shaders", "Rendering"] },
  { name: "Three.js", category: "Graphics", description: "Interactive 3D graphics in the browser.", stage: "Learning", tags: ["3D", "WebGL"] },
  { name: "Bash", category: "Automation", description: "Command-line workflows and development automation.", stage: "Exploring", tags: ["Shell", "CLI"] }
];

export function filterTechnologies(items: Technology[], category: TechnologyCategory | "All", query: string): Technology[] {
  const normalizedQuery = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const searchableText = [item.name, item.category, item.description, ...item.tags].join(" ").toLowerCase();
    return matchesCategory && searchableText.includes(normalizedQuery);
  });
}
