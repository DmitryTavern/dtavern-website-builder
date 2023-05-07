import { environment } from '@shared/environment'
import { isDevelopment, isProduction } from '@shared/mode'
import { TaskFunction } from 'gulp'

export const start: TaskFunction = function start(cb) {
  console.log(environment())
  console.log('Is dev: ', isDevelopment())
  console.log('Is prod: ', isProduction())
  cb()
}

export const build: TaskFunction = function build(cb) {
  console.log(environment())
  console.log('Is dev: ', isDevelopment())
  console.log('Is prod: ', isProduction())
  cb()
}
