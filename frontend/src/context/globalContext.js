import React, { useContext, useState } from "react"
import axios from 'axios'

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {
    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    const BASE_URL = "http://localhost:5000/api/v1/";

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    };
    
    //calculate incomes
    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${BASE_URL}add-income`, income, getAuthHeaders())
            getIncomes()
        } catch (err) {
            if (err.message === 'No authentication token found') {
                setError('Please login again');
                return;
            }
            setError(err.response?.data?.message || 'Failed to add income')
        }
    }

    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`, getAuthHeaders())
            setIncomes(response.data)
        } catch (err) {
            console.error('Get Incomes Error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to fetch incomes')
        }
    }

    const deleteIncome = async (id) => {
        try {
            const res  = await axios.delete(`${BASE_URL}delete-income/${id}`, getAuthHeaders())
            getIncomes()
        } catch (err) {
            setError(err.response.data.message)
        }
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }

    //calculate expenses
    const addExpense = async (expense) => {
        try {
            const response = await axios.post(`${BASE_URL}add-expense`, expense, getAuthHeaders())
            getExpenses()
        } catch (err) {
            setError(err.response.data.message)
        }
    }

    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`, getAuthHeaders())
            setExpenses(response.data)
        } catch (err) {
            setError(err.response.data.message)
        }
    }

    const deleteExpense = async (id) => {
        try {
            const res  = await axios.delete(`${BASE_URL}delete-expense/${id}`, getAuthHeaders())
            getExpenses()
        } catch (err) {
            setError(err.response.data.message)
        }
    }

    const totalExpenses = () => {
        let totalExpense = 0;
        expenses.forEach((expense) =>{
            totalExpense = totalExpense + expense.amount
        })

        return totalExpense;
    }

    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        return history.slice(0, 3) // Add this return statement
    }

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}