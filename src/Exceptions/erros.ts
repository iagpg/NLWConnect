export class EmailAlreadyExist extends Error {
  constructor() {
    super('EmailAlreadyExist')
    this.name = 'EmailAlreadyExistException'
  }
}
