import { useEffect, useState } from 'react'
import { getAllExpenses, deleteExpense } from '../services/api'
import { Trash2, Search } from 'lucide-react'

const CATEGORY_EMOJI = {
    Food: '🍕', Travel: '✈️', Shopping: '🛍️',
    Bills: '💡', Health: '💊', Entertainment: '🎬', Other: '📦'
}

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other']

export default function Expenses() {
    const [expenses, setExpenses] = useState([])
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [deleting, setDeleting] = useState(null)

    useEffect(() => {
        fetchExpenses()
    }, [])

    useEffect(() => {
        let result = expenses
        if (category !== 'All') {
            result = result.filter(e => e.category === category)
        }
        if (search) {
            result = result.filter(e =>
                e.title.toLowerCase().includes(search.toLowerCase())
            )
        }
        setFiltered(result)
    }, [expenses, category, search])

    const fetchExpenses = async () => {
        try {
            const res = await getAllExpenses()
            const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date))
            setExpenses(sorted)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        setDeleting(id)
        try {
            await deleteExpense(id)
            setExpenses(prev => prev.filter(e => e.id !== id))
        } catch (err) {
            console.error(err)
        } finally {
            setDeleting(null)
        }
    }

    const total = filtered.reduce((sum, e) => sum + e.amount, 0)

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 animate-pulse text-lg">Loading...</div>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white">Expenses</h2>
                <p className="text-gray-400 text-sm mt-1">{filtered.length} transactions · ₹{total.toFixed(2)} total</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder-gray-600"
                    />
                </div>
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Expense List */}
            {filtered.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                    <p className="text-gray-600 text-lg">No expenses found</p>
                    <p className="text-gray-700 text-sm mt-1">Try changing filters or add a new expense</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(expense => (
                        <div key={expense.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between hover:border-gray-700 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-800 w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                    {CATEGORY_EMOJI[expense.category] || '📦'}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{expense.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-gray-500">{expense.date}</span>
                                        <span className="text-gray-700">·</span>
                                        <span className="text-xs text-violet-400">{expense.category}</span>
                                        {expense.note && (
                                            <>
                                                <span className="text-gray-700">·</span>
                                                <span className="text-xs text-gray-600 truncate max-w-32">{expense.note}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-white font-semibold">₹{expense.amount.toFixed(2)}</span>
                                <button
                                    onClick={() => handleDelete(expense.id)}
                                    disabled={deleting === expense.id}
                                    className="text-gray-600 hover:text-red-400 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}