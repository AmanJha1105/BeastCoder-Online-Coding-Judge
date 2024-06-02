import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactCalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import 'tailwindcss/tailwind.css';
import '../index.css';
import { format } from 'date-fns';

const MonthlySubmissionsHeatmap = ({ username }) => {
  const [submissionData, setSubmissionData] = useState([]);

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const response = await axios.get(
          `http://localhost:5000/profile/submissions/${username}/${currentYear}/${currentMonth}`
        );
        const parsedData = response.data.map((submission) => ({
          ...submission,
          submittedAt: new Date(submission.submittedAt),
        }));

        setSubmissionData(parsedData);
      } catch (error) {
        console.error('Error fetching submission data:', error);
      }
    };

    fetchSubmissionData();
  }, [username]);

  const transformSubmissionData = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 1); // Add one day to include the current day in the range

    const dateCounts = {};

    // Initialize all dates within the range to 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dateCounts[dateStr] = 0;
    }

    // Increment counts for each submission date
    submissionData.forEach((submission) => {
      // Adjust date to local time zone
      const localDate = new Date(submission.submittedAt.getTime() - submission.submittedAt.getTimezoneOffset() * 60000);
      const dateStr = localDate.toISOString().split('T')[0];
      if (dateCounts[dateStr] !== undefined) {
        dateCounts[dateStr]++;
      }
    });

    const transformedData = Object.keys(dateCounts).map((date) => ({
      date,
      count: dateCounts[date],
    }));

    return transformedData;
  };

  const startDate = new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1); // Add one day to include the current day in the range

  return (
    <div className="w-3/4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        <strong>{submissionData.length} submissions in the past one year</strong>
      </h1>
      <ReactCalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={transformSubmissionData()}
        classForValue={(value) => {
          if (!value || value.count === 0) {
            return 'color-empty';
          } else if (value.count > 10) {
            return 'color-morefilled';
          }
          return 'color-filled';
        }}
        showWeekdayLabels={false}
        showMonthLabels={true}
        titleForValue={(value) => {
          const date = value ? new Date(value.date) : new Date();
          const formattedDate = format(date, 'd MMM yyyy');
          return `${value ? value.count : '0'} submissions on ${formattedDate}`;
        }}
      />
    </div>
  );
};

export default MonthlySubmissionsHeatmap;
