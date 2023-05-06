import { TaskFunction } from 'gulp'

export const start: TaskFunction = function start(cb) {
  console.log('Hello world!')
  cb()
}

export const build: TaskFunction = function build(cb) {
  console.log('Goodbye world!')
  cb()
}
