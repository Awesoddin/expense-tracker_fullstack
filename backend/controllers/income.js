const IncomeSchema= require("../models/IncomeModel")


exports.addIncome = async (req, res) => {
    const {title, amount, category, description, date}  = req.body
    const userId = req.userId;

    try {
        //validations
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'All fields are required!'})
        }
        
        const numAmount = Number(amount)
        if(isNaN(numAmount) || numAmount <= 0){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }

        const income = new IncomeSchema({
            title,
            amount: numAmount,
            category,
            description,
            date,
            user: userId
        })

        await income.save()
        res.status(200).json({message: 'Income Added'})
    } catch (error) {
        console.error('Add Income Error:', error);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.getIncomes = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId
        const incomes = await IncomeSchema.find({ user: userId }).sort({createdAt: -1})
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteIncome = async (req, res) =>{
    const {id} = req.params;
    IncomeSchema.findByIdAndDelete(id)
        .then((income) =>{
            res.status(200).json({message: 'Income Deleted'})
        })
        .catch((err) =>{
            res.status(500).json({message: 'Server Error'})
        })
}