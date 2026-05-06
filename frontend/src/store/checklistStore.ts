import { create } from 'zustand'
import { Checklist, ChecklistItem } from '../services/checklist.service'

interface ChecklistState {
  checklists: Checklist[]
  currentChecklist: Checklist | null
  isLoading: boolean
  error: string | null

  setChecklists: (checklists: Checklist[]) => void
  setCurrentChecklist: (checklist: Checklist | null) => void
  addChecklist: (checklist: Checklist) => void
  updateChecklist: (checklist: Checklist) => void
  removeChecklist: (id: string) => void
  updateChecklistItem: (checklistId: string, itemId: string, item: ChecklistItem) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useChecklistStore = create<ChecklistState>((set) => ({
  checklists: [],
  currentChecklist: null,
  isLoading: false,
  error: null,

  setChecklists: (checklists) => set({ checklists }),
  setCurrentChecklist: (checklist) => set({ currentChecklist: checklist }),
  addChecklist: (checklist) => set((state) => ({
    checklists: [...state.checklists, checklist],
  })),
  updateChecklist: (checklist) => set((state) => ({
    checklists: state.checklists.map((c) => (c.id === checklist.id ? checklist : c)),
    currentChecklist: state.currentChecklist?.id === checklist.id ? checklist : state.currentChecklist,
  })),
  removeChecklist: (id) => set((state) => ({
    checklists: state.checklists.filter((c) => c.id !== id),
  })),
  updateChecklistItem: (checklistId, itemId, item) => set((state) => {
    const updated = state.checklists.map((c) => {
      if (c.id === checklistId) {
        return {
          ...c,
          items: c.items.map((i) => (i.id === itemId ? item : i)),
        }
      }
      return c
    })
    return {
      checklists: updated,
      currentChecklist:
        state.currentChecklist?.id === checklistId
          ? {
              ...state.currentChecklist,
              items: state.currentChecklist.items.map((i) => (i.id === itemId ? item : i)),
            }
          : state.currentChecklist,
    }
  }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
