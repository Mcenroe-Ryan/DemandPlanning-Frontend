// import { useState, useEffect } from 'react';

// const API_BASE_URL = `http://localhost:5000/api`;

// export const useAlertCount = () => {
//   const [alertCount, setAlertCount] = useState(0);
//   const [alertCountLoading, setAlertCountLoading] = useState(true);
//   const [alertCountError, setAlertCountError] = useState(null);

//   useEffect(() => {
//     const fetchAlertCount = async () => {
//       setAlertCountLoading(true);
//       setAlertCountError(null);
//       try {
//         const response = await fetch(`${API_BASE_URL}/alerts`);
//         if (!response.ok) throw new Error('Failed to fetch alert count');
//         const data = await response.json();
//         setAlertCount(data.count || 0);
//       } catch (error) {
//         console.error('Error fetching alert count:', error);
//         setAlertCountError(error.message);
//         setAlertCount(0);
//       } finally {
//         setAlertCountLoading(false);
//       }
//     };

//     fetchAlertCount();
//   }, []);

//   return { alertCount, alertCountLoading, alertCountError };
// };
