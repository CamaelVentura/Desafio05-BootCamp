import Transaction from '../models/Transaction';

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions
      .filter(transactions => transactions.type === 'income')
      .reduce((sumIncome, transaction) => sumIncome + transaction.value, 0);
    const outcome = this.transactions
      .filter(transactions => transactions.type === 'outcome')
      .reduce((sumIncome, transaction) => sumIncome + transaction.value, 0);

    const total = income - outcome;
    const balance: Balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    const balance = this.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw Error('Error. Your outcome is bigger them income');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
