const renderHomePage = (res, user) => {
    res.render('home', {
        user:user
    });
}

const renderLoginPage = (res) => {
    res.render('login');
}

const renderRegisterPage = (res, message) => {
    if(message){
        res.render('register',{message:message});
    }
    res.render('register');
}



const renderAdminLoginPage = (res) => {
    res.render('adminLogin');
}

const renderAdminPage = (res, userList) => {
    res.render('admin', {
        userList:userList
    })
}

module.exports = {
    renderHomePage,
    renderLoginPage,
    renderRegisterPage,
    renderAdminLoginPage,
    renderAdminPage
}