import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import ScheduleEntryList from "./ScheduleEntryList";
import { useEffect, useState } from "react";
import DayDistributionChart from "../charts/DayDistributionChart";
import Toast from '../notification/Toast';
import WeeklyScheduleGrid from "../charts/WeeklyScheduleGrid";
import { fetchUserSchedules, updateUserScheduleEntries } from "../../util/EndpointManager";

export default function EditSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [activeScheduleId, setActiveScheduleId] = useState(null);
  const [scheduleEntries, setScheduleEntries] = useState([]);
  const [oldScheduleEntries, setOldScheduleEntries] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [toastCounter, setToastCounter] = useState(0);
  const navigate = useNavigate();

  const addToast = (type, message) => {
    const newToast = {
      id: toastCounter,
      type,
      message
    };
    setToasts(prev => [...prev, newToast]);
    setToastCounter(prev => prev + 1);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const fetchScheduleData = async () => {
      const data = await fetchUserSchedules(setSchedules);
      if (data.length > 0) setActiveScheduleId(data[0].id);
    }

    fetchScheduleData();
  }, []);

  useEffect(() => {
    if (activeScheduleId) {
      const selectedSchedule = schedules.find(
        (schedule) => schedule.id === activeScheduleId
      );
      setScheduleEntries(selectedSchedule ? selectedSchedule.entries : []);
      setOldScheduleEntries(selectedSchedule ? selectedSchedule.entries : []); // in case of discard
    }
  }, [activeScheduleId, schedules]);

  const handleSaveChanges = () => {
    const scheduleToUpdate = {
      ...schedules.find(s => s.id === activeScheduleId),
      entries: scheduleEntries
    };
    
    updateUserScheduleEntries(activeScheduleId, scheduleToUpdate, schedules, scheduleEntries, setSchedules, setOldScheduleEntries, addToast);

  };

  const handleDiscardChanges = () => setScheduleEntries(oldScheduleEntries);
  const onSelectSchedule = (selectedScheduleId) => setActiveScheduleId(selectedScheduleId);
  const handleEntryChange = (updatedEntries) => setScheduleEntries(updatedEntries);

  return (
    <div className="flex h-screen">
      <Sidebar
        schedules={schedules}
        activeScheduleId={activeScheduleId}
        onSelectSchedule={onSelectSchedule}
      />

      <div className="flex flex-col w-full p-4">
        <button
          className="text-blue-600 mb-4"
          onClick={() => navigate("/dashboard")}
        >
          <span className="flex items-center space-x-4">
            <ChevronLeft />
            <span>Back to Dashboard</span>
          </span>
        </button>

        <div className="flex flex-1 h-full overflow-hidden">
          <div className="w-1/2 pr-4 flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-2">Edit Schedule Entries:</h2>
            <div className="flex-1 overflow-y-auto">
              <ScheduleEntryList 
                entries={scheduleEntries}
                onEntryChange={handleEntryChange}
              />
            </div>
          </div>

          <div className="w-1/2 pl-4 overflow-y-auto">
            {schedules.length > 0 && scheduleEntries.length > 0 ? (
              <div className="space-y-6 mb-12">
                <WeeklyScheduleGrid entries={scheduleEntries} />
                <DayDistributionChart entries={scheduleEntries} />
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>

        <div className="fixed bottom-4 right-4 space-x-2 z-50">
          <button
            onClick={handleDiscardChanges}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}