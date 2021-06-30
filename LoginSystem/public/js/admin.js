function del(button) {
    console.log(button.id);
    var request = new Request('/admin', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'email':button.id})
    });

    fetch(request)
        .then((response) => {
            if(response.ok){
                console.log(response);
                button.parentElement.remove();
                alert('User successfully deleted');
            }
            else{
                console.log(response);
                alert('Not OK');
            }
        })
        .catch((error) => {
            console.log(error);
            alert(error);
        })
}