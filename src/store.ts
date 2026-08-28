import { InterviewData, ThemeResponse } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'excies_interviews';

export const getInterviews = (): InterviewData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data) as any[];
    // Migrate to answerSets
    return parsed.map(item => {
      const migrateCategory = (catData: any[]) => {
        if (!catData) return [];
        return catData.map(theme => {
          if (theme.answerSets) return theme;
          return {
            id: theme.id,
            themeName: theme.themeName,
            answerSets: [{
              id: uuidv4(),
              infoGebruik: theme.infoGebruik || '',
              infoBron: theme.infoBron || '',
              opbrengst: theme.opbrengst || '',
              actie: theme.actie || '',
              delenOptIn: theme.delenOptIn || '',
              delen: theme.delen || ''
            }]
          };
        });
      };
      return {
        ...item,
        toetsbeleid: migrateCategory(item.toetsbeleid),
        toetsorganisatie: migrateCategory(item.toetsorganisatie),
        toetsbekwaamheid: migrateCategory(item.toetsbekwaamheid),
        toetsTaken: migrateCategory(item.toetsTaken),
        toetsprogramma: migrateCategory(item.toetsprogramma),
      } as InterviewData;
    });
  } catch (e) {
    console.error('Failed to parse interviews from local storage', e);
    return [];
  }
};

export const saveInterview = (interview: InterviewData) => {
  const interviews = getInterviews();
  const existingIndex = interviews.findIndex(i => i.id === interview.id);
  
  if (existingIndex >= 0) {
    interviews[existingIndex] = { ...interview, lastUpdated: new Date().toISOString() };
  } else {
    interviews.push({ ...interview, lastUpdated: new Date().toISOString() });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(interviews));
};

export const deleteInterview = (id: string) => {
  const interviews = getInterviews();
  const filtered = interviews.filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getInterviewById = (id: string): InterviewData | undefined => {
  return getInterviews().find(i => i.id === id);
};
