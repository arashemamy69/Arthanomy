import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes'

// TODO: Replace with your actual Sanity Project ID once created
export const SANITY_PROJECT_ID = '9yc0h8hx'; 
export const SANITY_DATASET = 'production';

export default defineConfig({
  name: 'default',
  title: 'Arthanomy Studio',

  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,

  basePath: '/studio',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})
