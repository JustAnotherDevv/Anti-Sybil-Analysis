import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserList } from "./pages/UserList";
import { UserDetails } from "./pages/UserDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/user/:address" element={<UserDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

// import { Activity, Users, AlertTriangle, Clock } from "lucide-react";
// import { StatCards } from "@/components/dashboard/StatCards";
// import { UserTable } from "@/components/dashboard/UserTable";
// import { BehaviorChart } from "@/components/dashboard/BehaviorChart";
// import { TrendChart } from "@/components/dashboard/TrendChart";
// import { mockUsers, timeSeriesData, behaviorMetrics } from "@/data/mockData";
// import { StatCard } from "@/types";

// const stats: StatCard[] = [
//   {
//     title: "Total Users Analyzed",
//     value: "2,853",
//     description: "Active users in the game",
//     trend: 12,
//     icon: <Users className="h-4 w-4 text-muted-foreground" />,
//   },
//   {
//     title: "Average Risk Score",
//     value: "42.8",
//     description: "Across all users",
//     trend: -8,
//     icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
//   },
//   {
//     title: "Bot Detection Rate",
//     value: "18.3%",
//     description: "Last 30 days",
//     trend: 4,
//     icon: <Activity className="h-4 w-4 text-muted-foreground" />,
//   },
//   {
//     title: "Avg. Session Time",
//     value: "2.4h",
//     description: "Per user daily",
//     trend: -2,
//     icon: <Clock className="h-4 w-4 text-muted-foreground" />,
//   },
// ];

// function App() {
//   return (
//     <div className="min-h-screen bg-background">
//       <div className="flex-1 space-y-4 p-8 pt-6">
//         <div className="flex items-center justify-between space-y-2">
//           <h2 className="text-3xl font-bold tracking-tight">
//             Anti-Sybil Dashboard
//           </h2>
//         </div>
//         <div className="space-y-4">
//           <StatCards stats={stats} />

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <BehaviorChart data={behaviorMetrics} />
//             <TrendChart data={timeSeriesData} title="Risk Score Trend" />
//           </div>

//           <div className="grid gap-4">
//             <div className="rounded-lg border bg-card">
//               <div className="p-6">
//                 <h3 className="text-lg font-medium">User Analysis</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Detailed breakdown
//                 </p>
//               </div>
//               <UserTable users={mockUsers} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
