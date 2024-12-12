import React, { useState } from 'react';
import { PollBody, PollOption, PollSetting } from '../../types/poll';
import { PlusCircle, Trash2 } from 'lucide-react';

interface PollCreateProps {
  onSubmit: (pollData: PollBody) => void;
  initialData?: Partial<PollBody>;
}

const PollCreate: React.FC<PollCreateProps> = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [options, setOptions] = useState<PollOption[]>(
    initialData?.options || [
      { id: 1, text: '' },
      { id: 2, text: '' }
    ]
  );
  const [setting, setSetting] = useState<PollSetting>(
    initialData?.setting || {
      voices: 1,
      worst: false,
      deadline: undefined
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddOption = () => {
    const newId = Math.max(...options.map(opt => opt.id)) + 1;
    setOptions([...options, { id: newId, text: '' }]);
  };

  const handleRemoveOption = (id: number) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
    }
  };

  const handleOptionChange = (id: number, text: string) => {
    setOptions(options.map(option =>
      option.id === id ? { ...option, text } : option
    ));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    const validOptions = options.filter(opt => opt.text.trim() !== '');
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    if (setting.voices && setting.voices > options.length) {
      newErrors.voices = 'Number of voices cannot exceed number of options';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const validOptions = options.filter(opt => opt.text.trim() !== '');
    
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      options: validOptions,
      setting: {
        voices: setting.voices,
        worst: setting.worst || undefined,
        deadline: setting.deadline
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Poll</h2>
        
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="What would you like to ask?"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add more context to your poll"
          />
        </div>

        {/* Options */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Options
          </label>
          {options.map((option, index) => (
            <div key={option.id} className="flex gap-2">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md ${
                  errors.options ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(option.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          {errors.options && (
            <p className="text-red-500 text-sm">{errors.options}</p>
          )}
          <button
            type="button"
            onClick={handleAddOption}
            className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Option
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Poll Settings</h3>
          
          {/* Number of voices */}
          <div className="flex items-center justify-between">
            <label htmlFor="voices" className="block text-sm font-medium text-gray-700">
              Number of choices per voter
            </label>
            <select
              id="voices"
              value={setting.voices}
              onChange={(e) => setSetting({ ...setting, voices: Number(e.target.value) })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: options.length }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Allow worst choice */}
          <div className="flex items-center justify-between">
            <label htmlFor="worst" className="block text-sm font-medium text-gray-700">
              Allow worst choice selection
            </label>
            <input
              id="worst"
              type="checkbox"
              checked={setting.worst || false}
              onChange={(e) => setSetting({ ...setting, worst: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Deadline (Optional)
            </label>
            <input
              id="deadline"
              type="datetime-local"
              value={setting.deadline || ''}
              onChange={(e) => setSetting({ ...setting, deadline: e.target.value })}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default PollCreate;