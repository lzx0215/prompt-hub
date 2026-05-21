interface PromptStructureProps {
  role: string;
  task: string;
  context: string;
  constraints: string;
  outputFormat: string;
}

export function PromptStructure({ role, task, context, constraints, outputFormat }: PromptStructureProps) {
  const sections = [
    { label: "角色", value: role },
    { label: "任务", value: task },
    { label: "上下文", value: context },
    { label: "约束", value: constraints },
    { label: "输出格式", value: outputFormat },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sections.map((section) => (
        <div key={section.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{section.label}</dt>
          <dd className="mt-1 text-sm text-slate-950">{section.value}</dd>
        </div>
      ))}
    </div>
  );
}
