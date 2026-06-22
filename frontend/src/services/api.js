import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Expenses
export const getAllExpenses = () => api.get('/expenses')
export const addExpense = (expense) => api.post('/expenses', expense)
export const updateExpense = (id, expense) => api.put(`/expenses/${id}`, expense)
export const deleteExpense = (id) => api.delete(`/expenses/${id}`)
export const getByCategory = (category) => api.get(`/expenses/category/${category}`)
export const getByDateRange = (start, end) => api.get(`/expenses/range?start=${start}&end=${end}`)
export const getMonthlySummary = (year, month) => api.get(`/expenses/summary/${year}/${month}`)