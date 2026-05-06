import React, { useState } from 'react'
import { Checklist, ChecklistItem, checklistService } from '../../services/checklist.service'
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{checklist.title}</h2>
        {checklist.description && (
          <p className="text-gray-600 mb-4">{checklist.description}</p>
        )}

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">進捗</span>
            <span className="text-sm font-bold text-blue-600">
              {completedCount}/{totalCount} ({percentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {checklist.items
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <label
              key={item.id}
              className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={item.isCompleted}
                onChange={() => handleToggleItem(item.id, item.isCompleted)}
                disabled={updating === item.id}
                className="mt-1 h-5 w-5 text-blue-600 rounded cursor-pointer"
              />
              <div className="ml-3 flex-1">
                <p
                  className={`font-medium ${
                    item.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
              {item.isCompleted && (
                <span className="ml-2 text-green-600 font-bold">✓</span>
              )}
            </label>
          ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          作成: {new Date(checklist.createdAt).toLocaleDateString('ja-JP')}
        </p>
      </div>
    </div>
  )
}
