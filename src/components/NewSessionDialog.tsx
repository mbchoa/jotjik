import { DatePicker } from '@/components/Tremor/DatePicker';
import { Dialog, DialogPanel, TextInput } from '@tremor/react';
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
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Add Session
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div>
                <DatePicker
                  value={selectedDateTime}
                  onChange={(date) => setSelectedDateTime(date)}
                  className="w-full"
                  toDate={new Date()}
                  showTimePicker
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2">
                  Hours
                </label>
                <TextInput
                  className="min-w-fit"
                  type="number"
                  id="hours"
                  min={0}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-2">
                  Minutes
                </label>
                <TextInput
                  className="min-w-fit"
                  type="number"
                  id="minutes"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
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
      </DialogPanel>
    </Dialog>
  );
};

export default NewSessionDialog;
