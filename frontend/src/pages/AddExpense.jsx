import { useState } from 'react'
import { addExpense } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other']

export default function AddExpense() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        title: '',
        amount: '',
        category: 'Food',
        note: '',
        date: new Date().toISOString().split('T')[0]
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!form.title || !form.amount || !form.date) {
            setError('Title, amount and date are required.')
            return
        }
        if (form.amount <= 0) {
            setError('Amount must be greater than 0.')
            return
        }
        try {
            setLoading(true)
            await addExpense({ ...form, amount: parseFloat(form.amount) })
            navigate('/')
        } catch (err) {
            setError('Failed to add expense. Is the backend running?')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Add Expense</h2>
                <p className="text-gray-400 text-sm mt-1">Record a new expense</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Zomato dinner"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder-gray-600"
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="e.g. 350"
                            min="0"
                            step="0.01"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder-gray-600"
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Note <span className="text-gray-600">(optional)</span></label>
                        <textarea
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            placeholder="Any additional details..."
                            rows={3}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder-gray-600 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <PlusCircle size={18} />
                        {loading ? 'Adding...' : 'Add Expense'}
                    </button>

                </form>
            </div>
        </div>
    )
}