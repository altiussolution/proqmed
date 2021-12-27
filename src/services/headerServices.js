
const checkLogin = () => {
    const userToken = (typeof(localStorage.getItem('userToken') !== undefined ) ? localStorage.getItem('userToken') : undefined)
    if(userToken){
        return true;
    }else{
        return false  
    }
}
const checkUser = () => {
    const whatuser = (typeof(localStorage.getItem('permissions') !== undefined ) ? localStorage.getItem('permissions') : undefined)
    if(whatuser){
        return true;
    }else{
        return false  
    }
}

const logout = (val) => {
    if(val === 'logOut'){
        localStorage.clear();
    }
}  

module.exports = {
    checkLogin,
    logout,
    checkUser
};
  