export interface Birthday {
  id: number
  name: string
  birthdate: string
  daysUntilBirthday: number
}

export interface ExchangeResult {
  convertedAmount: number
  rate: number
  from: string
  to: string
  amount: number
  date?: string
}

