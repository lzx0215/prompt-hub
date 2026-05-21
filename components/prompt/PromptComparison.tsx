interface PromptComparisonProps {
  weakPrompt: string;
  improvedPrompt: string;
  improvementNotes: string;
}

export function PromptComparison({ weakPrompt, improvedPrompt, improvementNotes }: PromptComparisonProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="mb-2 text-sm font-semibold text-slate-500">普通版</h4>
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{weakPrompt}</p>
      </div>
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="mb-2 text-sm font-semibold text-blue-700">优化版</h4>
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{improvedPrompt}</p>
      </div>
      <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h4 className="mb-2 text-sm font-semibold text-slate-500">改进说明</h4>
        <p className="text-sm text-slate-700">{improvementNotes}</p>
      </div>
    </div>
  );
}
