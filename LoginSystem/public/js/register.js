let form = document.getElementById('form');
form.onsubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData(form);
    let plainFormData = Object.fromEntries(formData.entries());
    let formDataJsonString = JSON.stringify(plainFormData);

    var request = new Request('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: formDataJsonString
    });

    fetch(request)
        .then((response) => {
            if(response.ok){
                console.log(response);
                alert('User successfully registered');
                window.location.assign("/login");
            }
            else{
                console.log(response);
                alert('This information belongs to another user');
                form.reset();
            }
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        })

}