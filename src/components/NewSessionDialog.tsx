import { Dialog, DialogPanel } from '@tremor/react';
import { format } from 'date-fns';
import { useState } from 'react';

interface NewSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (startedAt: string, duration: number) => void;
}

const NewSessionDialog = ({ isOpen, onClose, onSubmit }: NewSessionDialogProps) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(undefined);
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateTime) return;
    const startedAt = selectedDateTime.toISOString();
    const duration = (parseInt(hours) * 60 + parseInt(minutes)) * 60 * 1000;
    onSubmit(startedAt, duration);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} static={true}>
      <DialogPanel>
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Add Session Manually
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date and Time
              </label>
              <div className="flex flex-col space-y-2">
                <Calendar
                  mode="single"
                  selected={selectedDateTime}
                  onSelect={(date) => {
                    if (date) {
                      // If we already have a time, preserve it
                      if (selectedDateTime) {
                        date = setHours(date, selectedDateTime.getHours());
                        date = setMinutes(date, selectedDateTime.getMinutes());
                      } else {
                        // Default to current time
                        const now = new Date();
                        date = setHours(date, now.getHours());
                        date = setMinutes(date, now.getMinutes());
                      }
                    }
                    setSelectedDateTime(date);
                  }}
                  className="rounded-md border border-gray-300"
                  required
                />
                <input
                  type="time"
                  value={selectedDateTime ? format(selectedDateTime, 'HH:mm') : ''}
                  onChange={(e) => {
                    if (selectedDateTime && e.target.value) {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      let newDateTime = setHours(selectedDateTime, hours);
                      newDateTime = setMinutes(newDateTime, minutes);
                      setSelectedDateTime(newDateTime);
                    }
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                  Hours
                </label>
                <input
                  type="number"
                  id="hours"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="minutes" className="block text-sm font-medium text-gray-700">
                  Minutes
                </label>
                <input
                  type="number"
                  id="minutes"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedDateTime}
                className="rounded-md bg-pink-900 px-4 py-2 text-sm font-medium text-white hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Session
              </button>
            </div>
          </form>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default NewSessionDialog;
