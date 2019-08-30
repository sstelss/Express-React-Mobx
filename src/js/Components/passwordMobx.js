import { createContext } from 'react'
import { decorate, observable, computed } from 'mobx'

export class Psw {
    username = ''
    password = ''
    cofirmPassword = ''
 

  get isIdentical(){
    if(this.password === this.cofirmPassword){
        return true;
    }
    else{
        return false;
    }
  }

  togglePassword = e => {
    
    this.password = e.target.value;

  }

  toggleUsername = e => {
    
    this.username = e.target.value;

  }

  toggleConfirmPassword = e => {
    
    this.confirmPassword = e.target.value;

  }

}

decorate(Psw, {
  password: observable,
  confirmPassword:observable, 
  isIdentical: computed
})

export default createContext(new Psw())