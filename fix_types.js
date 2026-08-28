const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

// First, clean up all the analysis fields everywhere to start fresh
content = content.replace(/  isAnalysis\?: boolean;\n/g, '');
content = content.replace(/  analysisTitle\?: string;\n/g, '');
content = content.replace(/  analysisSourceIds\?: string\[\];\n/g, '');

// Now define the correct structures
const answerSetDef = `export interface AnswerSet {
  id: string;
  infoGebruik: string;
  infoBron: string;
  opbrengst: string;
  actie: string;
  delenOptIn: 'Ja' | 'Nee' | '';
  delen: string;
}\n\n`;

content = content.replace('export interface ThemeResponse {', answerSetDef + 'export interface ThemeResponse {');

content = content.replace(/export interface ThemeResponse \{[\s\S]*?\}/, `export interface ThemeResponse {
  id: string;
  themeName: string;
  answerSets: AnswerSet[];
}`);

content = content.replace(/export interface InterviewData \{/, `export interface InterviewData {
  isAnalysis?: boolean;
  analysisTitle?: string;
  analysisSourceIds?: string[];`);

// Also update createEmptyThemeResponse
content = content.replace(/export const createEmptyThemeResponse = \(themeName: string\): ThemeResponse => \(\{[\s\S]*?\}\);/, `export const createEmptyAnswerSet = (): AnswerSet => ({
  id: uuidv4(),
  infoGebruik: '',
  infoBron: '',
  opbrengst: '',
  actie: '',
  delenOptIn: '',
  delen: ''
});

export const createEmptyThemeResponse = (themeName: string): ThemeResponse => ({
  id: uuidv4(),
  themeName,
  answerSets: [createEmptyAnswerSet()]
});`);

fs.writeFileSync('src/types.ts', content);
