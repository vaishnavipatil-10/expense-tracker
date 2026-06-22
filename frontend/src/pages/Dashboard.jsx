import { useEffect, useState } from 'react'
import { getAllExpenses, getMonthlySummary } from '../services/api'
import { TrendingUp, Wallet, Tag, Calendar } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626', '#0891b2']

const CATEGORY_EMOJI = {
    Food: '🍕', Travel: '✈️', Shopping: '🛍️',
    Bills: '💡', Health: '💊', Entertainment: '🎬', Other: '📦'
}

export default function Dashboard() {
    const [summary, setSummary] = useState(null)
    const [recentExpenses, setRecentExpenses] = useState([])
    const [loading, setLoading] = useState(true)

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, expensesRes] = await Promise.all([
                    getMonthlySummary(year, month),
                    getAllExpenses()
                ])
                setSummary(summaryRes.data)
                const sorted = expensesRes.data
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5)
                setRecentExpenses(sorted)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 animate-pulse text-lg">Loading...</div>
        </div>
    )

    const chartData = summary?.byCategory
        ? Object.entries(summary.byCategory).map(([name, value]) => ({ name, value }))
        : []

    const topCategory = chartData.length > 0
        ? chartData.reduce((a, b) => a.value > b.value ? a : b).name
        : 'N/A'

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                <p className="text-gray-400 text-sm mt-1">
                    {now.toLocaleString('default', { month: 'long' })} {year} overview
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-violet-600/20 p-2 rounded-xl">
                            <Wallet size={20} className="text-violet-400" />
                        </div>
                        <span className="text-gray-400 text-sm">Total Spent</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        ₹{summary?.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">This month</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-600/20 p-2 rounded-xl">
                            <TrendingUp size={20} className="text-blue-400" />
                        </div>
                        <span className="text-gray-400 text-sm">Transactions</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {summary?.totalExpenses || 0}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">This month</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-emerald-600/20 p-2 rounded-xl">
                            <Tag size={20} className="text-emerald-400" />
                        </div>
                        <span className="text-gray-400 text-sm">Top Category</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {CATEGORY_EMOJI[topCategory] || '📦'} {topCategory}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Highest spending</p>
                </div>
            </div>

            {/* Chart + Recent */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Pie Chart */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-white font-semibold mb-4">Spending by Category</h3>
                    {chartData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {chartData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [`₹${value.toFixed(2)}`, '']}
                                        contentStyle={{
                                            backgroundColor: '#111827',
                                            border: '1px solid #374151',
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {chartData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-600">
                            No data for this month
                        </div>
                    )}
                </div>

                {/* Recent Expenses */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-white font-semibold mb-4">Recent Expenses</h3>
                    {recentExpenses.length > 0 ? (
                        <div className="space-y-3">
                            {recentExpenses.map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
                                    <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {CATEGORY_EMOJI[expense.category] || '📦'}
                    </span>
                                        <div>
                                            <p className="text-white text-sm font-medium">{expense.title}</p>
                                            <p className="text-gray-500 text-xs">{expense.date}</p>
                                        </div>
                                    </div>
                                    <span className="text-white font-semibold text-sm">
                    ₹{expense.amount.toFixed(2)}
                  </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-600">
                            No expenses yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}