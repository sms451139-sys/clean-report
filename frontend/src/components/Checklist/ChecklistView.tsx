import React, { useState } from 'react'
import { Checklist, checklistService } from '../../services/checklist.service'
import { useChecklistStore } from '../../store/checklistStore'

interface ChecklistViewProps {
  checklist: Checklist
  onUpdate?: (checklist: Checklist) => void
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({ checklist, onUpdate }) => {
  const [updating, setUpdating] = useState<string | null>(null)
  const updateItem = useChecklistStore((state) => state.updateChecklistItem)

  const handleToggleItem = async (itemId: string, currentState: boolean) => {
    try {
      setUpdating(itemId)
      const updatedChecklist = await checklistService.updateChecklistItem(
        checklist.id,
        itemId,
        !currentState
      )
      updateItem(checklist.id, itemId, {
        ...checklist.items.find((i) => i.id === itemId)!,
        isCompleted: !currentState,
      })
      onUpdate?.(updatedChecklist)
    } catch (err) {
      alert('更新に失敗しました')
    } finally {
      setUpdating(null)
    }
  }

  const completedCount = checklist.items.filter((item) => item.isCompleted).length
  const totalCount = checklist.items.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{checklist.title}</h2>
        {checklist.description && (
          <p className="text-gray-600 mb-6">{checklist.description}</p>
        )}

        {/* Progress Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">完了度</span>
            <span className="text-2xl font-bold text-indigo-600">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {completedCount} / {totalCount} 項目完了
          </p>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {checklist.items
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <label
              key={item.id}
              className={`flex items-start p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                item.isCompleted
                  ? 'bg-emerald-50 border border-emerald-100'
                  : 'bg-gray-50 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <input
                type="checkbox"
                checked={item.isCompleted}
                onChange={() => handleToggleItem(item.id, item.isCompleted)}
                disabled={updating === item.id}
                className="mt-1 h-5 w-5 text-emerald-600 rounded cursor-pointer accent-emerald-600"
              />
              <div className="ml-4 flex-1">
                <p
                  className={`font-medium ${
                    item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p className={`text-sm mt-1 ${item.isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                )}
              </div>
              {item.isCompleted && (
                <span className="ml-2 text-emerald-600 font-bold text-lg">✓</span>
              )}
            </label>
          ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          作成日時: {new Date(checklist.createdAt).toLocaleDateString('ja-JP')}
        </p>
      </div>
    </div>
  )
}
