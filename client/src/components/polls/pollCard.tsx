import * as React from 'react';
import { Poll } from '../../types/poll';
import { Calendar, Lock, Users, Edit, Trash } from 'lucide-react';

interface PollCardProps {
  poll: Poll;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  isAdmin?: boolean;
}

const PollCard = ({
  poll,
  onEdit,
  onDelete,
  onClick,
  isAdmin = false
}: PollCardProps) => {
  const { body, security } = poll;
  const isLocked = security?.visibility === 'lock';
  const totalVotes = 0; // This should come from statistics when implemented

  const formatDeadline = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Header with Title and Lock Status */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{body.title}</h3>
          {body.description && (
            <p className="mt-2 text-gray-600 text-sm line-clamp-2">{body.description}</p>
          )}
        </div>
        {isLocked && (
          <Lock className="h-5 w-5 text-amber-500" />
        )}
      </div>

      {/* Poll Information */}
      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
        {body.setting?.deadline && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4" />
            <span className="ml-1">{formatDeadline(body.setting.deadline)}</span>
          </div>
        )}
        <div className="flex items-center">
          <Users className="h-4 w-4" />
          <span className="ml-1">{totalVotes} votes</span>
        </div>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="mt-4 flex justify-end space-x-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            >
              <Trash className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Options Preview */}
      <div className="mt-4">
        <div className="text-sm text-gray-500">
          {body.options.length} options available
        </div>
      </div>
    </div>
  );
};

export default PollCard;