import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import AddExpense from './pages/AddExpense'
import Summary from './pages/Summary'
import { LayoutDashboard, List, PlusCircle, BarChart2 } from 'lucide-react'

function App() {
  return (
      <Router>
        <div className="min-h-screen bg-gray-950 text-white flex">

          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-6 fixed h-full">
            <div className="mb-10">
              <h1 className="text-xl font-bold text-white">💰 ExpenseIQ</h1>
              <p className="text-xs text-gray-500 mt-1">Smart expense tracking</p>
            </div>

            <nav className="flex flex-col gap-2">
              <NavLink to="/" end className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${isActive ? 'bg-violet-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
              }>
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>

              <NavLink to="/expenses" className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${isActive ? 'bg-violet-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
              }>
                <List size={18} /> Expenses
              </NavLink>

              <NavLink to="/add" className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${isActive ? 'bg-violet-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
              }>
                <PlusCircle size={18} /> Add Expense
              </NavLink>

              <NavLink to="/summary" className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${isActive ? 'bg-violet-600 text-white' : 'text/gray-400 hover:bg-gray-800 hover:text-white'}`
              }>
                <BarChart2 size={18} /> Summary
              </NavLink>
            </nav>

            <div className="mt-auto text-xs text-gray-600">
              Built with Spring Boot + React
            </div>
          </aside>

          {/* Main content */}
          <main className="ml-64 flex-1 p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/add" element={<AddExpense />} />
              <Route path="/summary" element={<Summary />} />
            </Routes>
          </main>
        </div>
      </Router>
  )
}

export default App