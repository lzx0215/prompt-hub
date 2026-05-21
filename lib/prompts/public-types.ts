export interface PublicPromptListFilters {
  query?: string;
  category?: string;
  tag?: string;
}

export interface RelatedPromptInput {
  id: string;
  categoryId: string;
  tagIds: string[];
}
