declare module '../../api/Birthday' {
  export interface Birthday {
    id: number
    name: string
    birthdate: string
    daysUntilBirthday: number
  }

  export function getBirthdays(): Promise<Birthday[]>
  export function createBirthday(params: { name: string; birthdate: string }): Promise<Birthday>
}

declare module '../../api/Exchange' {
  export interface ExchangeResult {
    convertedAmount: number
    rate: number
    from: string
    to: string
    amount: number
    date?: string
  }

  export function getConvertedAmount(params: {
    from: string
    to: string
    amount: string | number
    date?: string
  }): Promise<ExchangeResult>
}

declare module '../../api/Numbers' {
  export function getTheNumber(params: { first: string | number; second: string | number }): Promise<any>
}

