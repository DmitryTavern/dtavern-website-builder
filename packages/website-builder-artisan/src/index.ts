import { program } from 'commander'

program.name('artisan')

program
  .command('test')
  .description('Test script')
  .action(() => {
    console.log('Hello world')
  })

program.parse()
