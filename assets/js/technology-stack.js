const technologies = [
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

const explorer = document.getElementById("stackExplorer");

if (explorer) {
  const filters = explorer.querySelector("[data-stack-filters]");
  const search = explorer.querySelector("[data-stack-search]");
  const results = explorer.querySelector("[data-stack-results]");
  const count = explorer.querySelector("[data-stack-count]");
  const categories = ["All", "Frontend", "Data", "Graphics", "Automation"];
  let activeCategory = "All";

  const createElement = (tag, className, content) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  };

  const renderFilters = () => {
    filters.replaceChildren();
    categories.forEach((category) => {
      const button = createElement("button", "stack-filter", category);
      button.type = "button";
      button.setAttribute("aria-pressed", String(activeCategory === category));
      button.addEventListener("click", () => {
        activeCategory = category;
        renderFilters();
        renderResults();
      });
      filters.append(button);
    });
  };

  const renderResults = () => {
    const query = search.value.trim().toLowerCase();
    const visible = technologies.filter((item) => {
      const categoryMatch = activeCategory === "All" || item.category === activeCategory;
      const searchable = [item.name, item.category, item.description, ...item.tags].join(" ").toLowerCase();
      return categoryMatch && searchable.includes(query);
    });

    results.replaceChildren();
    visible.forEach((item) => {
      const card = createElement("article", "stack-result");
      const top = createElement("div", "stack-result-top");
      top.append(createElement("span", "stack-result-category", item.category));
      top.append(createElement("span", "stack-result-stage", item.stage));
      card.append(top);
      card.append(createElement("h4", "", item.name));
      card.append(createElement("p", "", item.description));
      const tags = createElement("div", "stack-result-tags");
      item.tags.forEach((tag) => tags.append(createElement("span", "", tag)));
      card.append(tags);
      results.append(card);
    });

    count.textContent = visible.length + (visible.length === 1 ? " technology" : " technologies");
    if (!visible.length) {
      results.append(createElement("p", "stack-empty", "No matching technologies. Try another search."));
    }
  };

  search.addEventListener("input", renderResults);
  renderFilters();
  renderResults();
}
