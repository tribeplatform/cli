export interface TemplateFieldMapping {
  from: string
  to: string
}

export interface TemplateMapping {
  from: string
  to: string
  fields?: TemplateFieldMapping[]
}
