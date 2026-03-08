import chalk from 'chalk';

const logger = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✔'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
  error: (msg) => console.error(chalk.red('✖'), msg),
  debug: (msg) => process.env.DEBUG && console.log(chalk.gray('⚙'), msg),
  title: (msg) => console.log('\n' + chalk.bold.cyan(msg.toUpperCase()) + '\n'),
  divider: () => console.log(chalk.gray('━'.repeat(50)))
};

export default logger;
