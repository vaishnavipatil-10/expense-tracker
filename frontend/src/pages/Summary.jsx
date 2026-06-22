import { useState } from 'react'
import { getMonthlySummary } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626', '#0891b2']

const CATEGORY_EMOJI = {
    Food: '🍕', Travel: '✈️', Shopping: '🛍️',
    Bills: '💡', Health: '💊', Entertainment: '🎬', Other: '📦', Transport: '🚗'
}

export default function Summary() {
    const now = new Date()
    const [year, setYear] = useState(now.getFullYear())
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    const handleSearch = async () => {
        setLoading(true)
        try {
            const res = await getMonthlySummary(year, month)
            setSummary(res.data)
            setSearched(true)
        } catch (err) {
            console.error(err)
            setSummary(null)
        } finally {
            setLoading(false)
        }
    }

    const chartData = summary?.byCategory
        ? Object.entries(summary.byCategory).map(([name, value]) => ({ name, value }))
        : []

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Monthly Summary</h2>
                <p className="text-gray-400 text-sm mt-1">Analyse your spending by month</p>
            </div>

            {/* Month Picker */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Year</label>
                        <select
                            value={year}
                            onChange={e => setYear(Number(e.target.value))}
                            className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500"
                        >
                            {[2024, 2025, 2026, 2027].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Month</label>
                        <select
                            value={month}
                            onChange={e => setMonth(Number(e.target.value))}
                            className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500"
                        >
                            {monthNames.map((m, i) => (
                                <option key={i} value={i + 1}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'View Summary'}
                    </button>
                </div>
            </div>

            {/* Results */}
            {searched && summary && (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                            <p className="text-3xl font-bold text-white">₹{summary.totalAmount?.toFixed(2)}</p>
                            <p className="text-gray-500 text-xs mt-1">{monthNames[month-1]} {year}</p>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <p className="text-gray-400 text-sm mb-1">Transactions</p>
                            <p className="text-3xl font-bold text-white">{summary.totalExpenses}</p>
                            <p className="text-gray-500 text-xs mt-1">{monthNames[month-1]} {year}</p>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    {chartData.length > 0 && (
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-6">Spending by Category</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData} barSize={40}>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={v => `₹${v}`}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
                                        contentStyle={{
                                            backgroundColor: '#111827',
                                            border: '1px solid #374151',
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {chartData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Category Breakdown */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-white font-semibold mb-4">Category Breakdown</h3>
                        <div className="space-y-3">
                            {chartData.sort((a,b) => b.value - a.value).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{CATEGORY_EMOJI[item.name] || '📦'}</span>
                                        <span className="text-white text-sm">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-32 bg-gray-800 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 rounded-full"
                                                style={{
                                                    width: `${(item.value / summary.totalAmount) * 100}%`,
                                                    backgroundColor: COLORS[index % COLORS.length]
                                                }}
                                            />
                                        </div>
                                        <span className="text-white text-sm font-medium w-24 text-right">
                      ₹{item.value.toFixed(2)}
                    </span>
                                        <span className="text-gray-500 text-xs w-10 text-right">
                      {((item.value / summary.totalAmount) * 100).toFixed(0)}%
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {searched && (!summary || summary.totalExpenses === 0) && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                    <p className="text-gray-600 text-lg">No expenses found</p>
                    <p className="text-gray-700 text-sm mt-1">Try a different month or add some expenses</p>
                </div>
            )}
        </div>
    )
}