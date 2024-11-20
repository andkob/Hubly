import React, { useEffect, useState } from 'react';
import { Calendar, Search, AlertCircle } from 'lucide-react';

const EVENT_TYPES = [
  { id: 'BROTHERHOOD', label: 'Brotherhood', color: 'bg-green-100 text-green-800' },
  { id: 'MANDATORY', label: 'Mandatory', color: 'bg-red-300 text-red-800' },
  { id: 'SOCIAL', label: 'Social', color: 'bg-blue-100 text-blue-800' },
  { id: 'PHILANTHROPY', label: 'Philanthropy', color: 'bg-purple-100 text-purple-800' },
  { id: 'OTHER', label: 'Other', color: 'bg-gray-100 text-gray-800' }
];

export default function OrganizationEvents({ orgId, isNewEvents, setIsNewEvents }) {
  const[events, setEvents] = useState([]);
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch(`/api/org/get/events/${orgId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message || 'Failed to load events');
      } finally {
        setIsNewEvents(false); 
        setLoading(false);
      }
    };

  if (orgId) {
    fetchEvents();
  }
}, [orgId, isNewEvents])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Upcoming Events</h3>
        </div>
        <div className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Upcoming Events</h3>
        </div>
        <div className="p-8 text-center">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">Failed to load events</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!events?.length) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Upcoming Events</h3>
        </div>
        <div className="p-8 text-center">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Calendar className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No events found</p>
            <p className="text-sm">Events created by your organization will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Upcoming Events</h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search events..."
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Event Name</th>
              <th scope="col" className="px-6 py-3">Created By</th>
              <th scope="col" className="px-6 py-3">Date & Time</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Type</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr 
                key={event.id || index} 
                className="bg-white border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {event.name}
                </td>
                <td className="px-6 py-4">
                  {event.createdBy || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>{formatDate(event.date)}</span>
                    <span className="text-xs text-gray-500">{formatTime(event.startTime)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {event.location || 'TBD'}
                </td>
                <td className="px-6 py-4">
                  <span className={`${EVENT_TYPES.find(t => t.id === event.type)?.color || EVENT_TYPES.find(t => t.id === 'OTHER').color} text-xs font-medium px-2.5 py-0.5 rounded`}>
                    {EVENT_TYPES.find(t => t.id === event.type)?.label || 'Other'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}