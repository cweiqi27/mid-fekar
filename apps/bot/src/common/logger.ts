import chalk from 'chalk'

export const logger = {
  error: (...args: unknown[]): void => console.log(chalk.red(...args)),
  info: (...args: unknown[]): void => console.log(chalk.blue(...args)),
  warn: (...args: unknown[]): void => console.log(chalk.yellow(...args)),
  success: (...args: unknown[]): void => console.log(chalk.green(...args)),
}
